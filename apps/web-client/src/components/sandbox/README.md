# PhysicsSandbox SDK

## Overview

The **PhysicsSandbox** component is a reusable React wrapper that acts as a "World Engine" for creating interactive physics lessons. This SDK follows the **"Roblox Model"** architecture, separating the physics engine from curriculum content to enable rapid lesson creation without writing Three.js boilerplate.

## Architecture: The "Roblox Model"

```
┌─────────────────────────────────────────────────────┐
│                  LESSON MODULE                      │
│              (Lightweight Script)                   │
│                                                     │
│  • Passes JSON configuration                       │
│  • Defines learning objectives                     │
│  • No rendering code needed                        │
└────────────────┬────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────┐
│              PHYSICS SANDBOX                        │
│            (Reusable Engine)                       │
│                                                     │
│  • Handles rendering (Canvas/WebGL)                │
│  • Physics simulation loop                         │
│  • Vector field visualization                      │
│  • NGSS metadata integration                       │
└────────────────┬────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────┐
│              OUTPUT LAYER                           │
│                                                     │
│  • Visual simulation                               │
│  • Proof-of-Knowledge triggers                     │
│  • NGSS-tagged credentials                         │
└─────────────────────────────────────────────────────┘
```

## Usage

### Basic Example

```jsx
import PhysicsSandbox from './components/sandbox/PhysicsSandbox.jsx';

function MyLesson() {
  return (
    <PhysicsSandbox
      config={{
        gravity: [0, -9.8, 0],
        timeScale: 1.0,
        debug: false
      }}
      showForceLines={true}
      onSuccess={() => console.log('Lesson completed!')}
      metadata={{
        standardID: "HS-PS2-1",
        conceptTag: "Forces and Motion",
        difficulty: "High School"
      }}
    />
  );
}
```

### Props Interface

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `config` | `Object` | `{ gravity: [0, -9.8, 0], timeScale: 1.0, debug: false }` | Physics configuration |
| `config.gravity` | `[x, y, z]` | `[0, -9.8, 0]` | Gravity vector in m/s² |
| `config.timeScale` | `float` | `1.0` | Time dilation factor |
| `config.debug` | `boolean` | `false` | Show debug overlay |
| `showForceLines` | `boolean` | `false` | Visualize vector fields |
| `onSuccess` | `function` | `() => {}` | Callback when lesson is completed |
| `metadata` | `Object` | `null` | NGSS lesson metadata |
| `children` | `ReactNode` | - | Custom UI overlays |

### NGSS Metadata Schema

The SDK integrates with the NGSS (Next Generation Science Standards) curriculum through a standardized JSON schema located in `src/data/curriculum.json`.

#### Metadata Structure

```json
{
  "lessonId": "unique-id",
  "title": "Lesson Title",
  "standardID": "HS-PS2-1",
  "conceptTag": "Forces and Motion",
  "difficulty": "High School | University | Research",
  "description": "Lesson description",
  "physicsConfig": {
    "gravity": [0, -9.8, 0],
    "timeScale": 1.0,
    "debug": false
  },
  "learningObjectives": [
    "Objective 1",
    "Objective 2"
  ]
}
```

## Features

### 1. Zero-Boilerplate Instantiation

Developers can create physics simulations without writing canvas, WebGL, or Three.js code:

```jsx
<PhysicsSandbox config={{ gravity: [0, -9.8, 0] }} />
```

### 2. Force Line Visualization

Toggle invisible vector fields to make physics concepts visible:

```jsx
<PhysicsSandbox showForceLines={true} />
```

Green arrows appear showing the direction and magnitude of force fields.

### 3. NGSS Standard Logging

On component mount, the active NGSS standard is logged to the console:

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📚 PhysicsSandbox: NGSS Standard Active
   Standard ID: HS-PS2-1
   Concept: Forces and Motion
   Difficulty: High School
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### 4. Custom UI Overlays

Add custom controls or information as children:

```jsx
<PhysicsSandbox config={config}>
  <div className="absolute bottom-4 left-4">
    <h3>Custom Controls</h3>
    <button>Interact</button>
  </div>
</PhysicsSandbox>
```

## Integration with Curriculum

### Loading Lesson Data

```jsx
import curriculumData from '../../data/curriculum.json';

const lessonMetadata = curriculumData.lessons.find(
  lesson => lesson.lessonId === 'chaos-001'
);

<PhysicsSandbox
  config={lessonMetadata.physicsConfig}
  metadata={lessonMetadata}
/>
```

## Acceptance Criteria

✅ **Criterion 1**: Developer can instantiate a scene using `<PhysicsSandbox config={{gravity: -9.8}} />` without writing Three.js boilerplate.

✅ **Criterion 2**: "Force Lines" (vectors) render visibly when `showForceLines={true}`.

✅ **Criterion 3**: Console logs confirm which NGSS standard is active upon component mount.

## Examples

See the following example components:
- `PhysicsSandboxExample.jsx` - Interactive demo with controls
- `AcceptanceCriteriaTest.jsx` - Automated acceptance test suite

## Physics Simulation

The sandbox uses a requestAnimationFrame loop (similar to React Three Fiber's `useFrame`) to update physics state:

```javascript
// Simplified physics update
const updatePhysics = (deltaTime) => {
  objects.forEach(obj => {
    // Apply gravity
    obj.velocity.y += gravity[1] * deltaTime;
    
    // Update position
    obj.position.y += obj.velocity.y * deltaTime;
  });
};
```

## Future Enhancements

- [ ] Integration with Rapier or Cannon.js physics engines
- [ ] Collision detection and response
- [ ] More complex force field types (electromagnetic, friction)
- [ ] VR/AR support
- [ ] Multi-object simulations
- [ ] Particle systems

## License

Part of the EntanglEducation Platform.
