export const SANDBOX_MODULE = {
  id: 'physics-sandbox',
  title: 'R3F Physics Lab',
  description: 'Experimental Rapier physics playground with real-time objectives.',
  type: 'sandbox',
  config: {
    gravity: [0, -9.81, 0],
    theme: 'dark',
    debug: true, 
    initialCamera: [0, 5, 10],
  },
  objectives: [
    { id: 'obj-1', text: 'Interact with the 3D Box', completed: false },
    { id: 'obj-2', text: 'Test Gravity', completed: false }
  ]
};
