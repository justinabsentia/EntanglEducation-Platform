import React, { useEffect, useRef, useState } from 'react';

/**
 * PhysicsSandbox - Reusable React wrapper acting as the "World Engine"
 * Based on the "Roblox Model" architecture for rapid lesson creation
 * 
 * @param {Object} config - Physics configuration { gravity: [x,y,z], timeScale: float, debug: boolean }
 * @param {boolean} showForceLines - Toggle for visualizing invisible vector fields
 * @param {function} onSuccess - Callback for the Proof-of-Knowledge trigger
 * @param {Object} metadata - NGSS metadata for the lesson
 * @param {React.ReactNode} children - Custom lesson content/controls
 */
const PhysicsSandbox = ({ 
  config = { gravity: [0, -9.8, 0], timeScale: 1.0, debug: false },
  showForceLines = false,
  onSuccess = () => {},
  metadata = null,
  children
}) => {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const animationFrameRef = useRef(null);
  const [physicsState, setPhysicsState] = useState({
    objects: [],
    forces: [],
    time: 0
  });

  // Log NGSS standard on mount (Acceptance Criteria)
  useEffect(() => {
    if (metadata) {
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('📚 PhysicsSandbox: NGSS Standard Active');
      console.log(`   Standard ID: ${metadata.standardID || 'N/A'}`);
      console.log(`   Concept: ${metadata.conceptTag || 'N/A'}`);
      console.log(`   Difficulty: ${metadata.difficulty || 'N/A'}`);
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    } else {
      console.log('⚠️  PhysicsSandbox: No NGSS metadata provided');
    }

    if (config.debug) {
      console.log('🔧 Debug Mode Active');
      console.log('   Gravity:', config.gravity);
      console.log('   Time Scale:', config.timeScale);
    }
  }, [metadata, config]);

  // Physics simulation loop using requestAnimationFrame (similar to R3F's useFrame)
  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d');
    let lastTime = performance.now();

    const handleResize = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = container.clientWidth * dpr;
      canvas.height = container.clientHeight * dpr;
      ctx.scale(dpr, dpr);
      canvas.style.width = `${container.clientWidth}px`;
      canvas.style.height = `${container.clientHeight}px`;
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);

    // Physics update loop (equivalent to R3F's useFrame)
    const updatePhysics = (currentTime) => {
      const deltaTime = ((currentTime - lastTime) / 1000) * config.timeScale;
      lastTime = currentTime;

      const width = container.clientWidth;
      const height = container.clientHeight;

      // Clear canvas
      ctx.fillStyle = '#020617';
      ctx.fillRect(0, 0, width, height);

      // Update physics state
      setPhysicsState(prev => {
        const newTime = prev.time + deltaTime;
        
        // Apply gravity to objects (simple physics simulation)
        const updatedObjects = prev.objects.map(obj => {
          // Calculate new velocity first
          const newVelocity = {
            x: obj.velocity.x,
            y: obj.velocity.y + config.gravity[1] * deltaTime,
            z: obj.velocity.z + config.gravity[2] * deltaTime
          };
          
          // Then update position using the new velocity
          const newPosition = {
            x: obj.position.x + newVelocity.x * deltaTime,
            y: obj.position.y + newVelocity.y * deltaTime,
            z: obj.position.z + newVelocity.z * deltaTime
          };
          
          return {
            ...obj,
            velocity: newVelocity,
            position: newPosition
          };
        });

        return {
          ...prev,
          objects: updatedObjects,
          time: newTime
        };
      });

      // Render force lines if enabled
      if (showForceLines) {
        renderForceLines(ctx, width, height);
      }

      // Debug info
      if (config.debug) {
        ctx.fillStyle = '#10b981';
        ctx.font = '12px monospace';
        ctx.fillText(`Time: ${physicsState.time.toFixed(2)}s`, 10, 20);
        ctx.fillText(`Gravity: ${config.gravity.join(', ')}`, 10, 35);
        ctx.fillText(`Objects: ${physicsState.objects.length}`, 10, 50);
      }

      animationFrameRef.current = requestAnimationFrame(updatePhysics);
    };

    animationFrameRef.current = requestAnimationFrame(updatePhysics);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [config, showForceLines]);

  // Render force lines (vector field visualization)
  const renderForceLines = (ctx, width, height) => {
    const gridSize = 40;
    const arrowLength = 20;

    ctx.strokeStyle = 'rgba(34, 197, 94, 0.6)'; // Green force lines
    ctx.fillStyle = 'rgba(34, 197, 94, 0.6)';
    ctx.lineWidth = 1.5;

    // Draw a grid of force vectors showing gravity direction
    for (let x = gridSize; x < width; x += gridSize) {
      for (let y = gridSize; y < height; y += gridSize) {
        const forceX = config.gravity[0] * 2;
        const forceY = config.gravity[1] * 2;

        // Draw arrow line
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x + forceX, y + forceY);
        ctx.stroke();

        // Draw arrowhead
        const angle = Math.atan2(forceY, forceX);
        const headLength = 6;
        ctx.beginPath();
        ctx.moveTo(x + forceX, y + forceY);
        ctx.lineTo(
          x + forceX - headLength * Math.cos(angle - Math.PI / 6),
          y + forceY - headLength * Math.sin(angle - Math.PI / 6)
        );
        ctx.lineTo(
          x + forceX - headLength * Math.cos(angle + Math.PI / 6),
          y + forceY - headLength * Math.sin(angle + Math.PI / 6)
        );
        ctx.lineTo(x + forceX, y + forceY);
        ctx.fill();
      }
    }

    // Label
    ctx.fillStyle = '#10b981';
    ctx.font = 'bold 12px monospace';
    ctx.fillText('⚡ Force Field Vectors', 10, height - 10);
  };

  return (
    <div 
      ref={containerRef} 
      className="relative w-full h-full overflow-hidden rounded-xl border border-slate-800 bg-[#020617]"
    >
      <canvas ref={canvasRef} className="block w-full h-full" />
      
      {/* Render custom lesson controls */}
      {children}

      {/* Debug overlay */}
      {config.debug && (
        <div className="absolute top-4 right-4 bg-slate-900/90 border border-green-500 p-3 rounded-lg backdrop-blur-md">
          <div className="text-green-400 font-mono text-xs">
            <div>🔧 DEBUG MODE</div>
            <div>Time: {physicsState.time.toFixed(2)}s</div>
            <div>Scale: {config.timeScale}x</div>
          </div>
        </div>
      )}

      {/* Force lines indicator */}
      {showForceLines && (
        <div className="absolute top-4 left-4 bg-green-900/50 border border-green-500 px-3 py-1 rounded-lg backdrop-blur-md">
          <span className="text-green-400 font-mono text-xs">⚡ Force Lines: ON</span>
        </div>
      )}
    </div>
  );
};

export default PhysicsSandbox;
