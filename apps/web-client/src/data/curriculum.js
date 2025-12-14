// apps/web-client/src/data/curriculum.js

export const SANDBOX_MODULE = {
  id: 'physics-sandbox',
  title: 'R3F Physics Lab',
  description: 'Experimental Rapier physics playground with real-time objectives.',
  type: 'sandbox',
  // Config passed to the component
  config: {
    gravity: [0, -9.81, 0],
    theme: 'dark',
    debug: true, // Set to false to hide collision lines
    initialCamera: [0, 5, 10],
  },
  // Objectives for the HUD
  objectives: [
    { id: 'obj-1', text: 'Interact with the 3D Box', completed: false },
    { id: 'obj-2', text: 'Test Gravity', completed: false }
  ]
};

// You can export your other lessons here later to clean up EntangleduMain.jsx
export const CURRICULUM = [
  SANDBOX_MODULE
];
