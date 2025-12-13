# Entangledu: Decentralized Knowledge Protocol

**A Web3-native educational platform featuring high-fidelity physics simulations and sovereign credentialing.**

This repository hosts the **Entangledu** ecosystem, a "Proof of Knowledge" platform that combines interactive HTML5 Canvas simulations with a decentralized identity architecture.

## 🌌 Modules Implemented

The current release (v1.1.0) includes three "Enhanced" interactive laboratories:

### 1. Holographic Principle (AdS/CFT)
* **Visual:** A rotating 3D Fibonacci Sphere projected onto a 2D canvas using perspective projection.
* **Physics:** Simulates the "Bulk" vs. "Boundary" correspondence.
* **Tech:** Custom particle engine with depth sorting (`z-scale`) and sine-wave data shimmering.

### 2. Quantum Tunneling
* **Visual:** Real-time wave function visualization responding to user energy input.
* **Physics:** Finite difference method simulating a particle encountering a potential barrier ($E < V$).
* **Tech:** DPI-aware rendering for crisp lines on Retina displays.

### 3. Lorenz Attractor (Chaos Theory)
* **Visual:** Continuous ribbon rendering of the strange attractor.
* **Physics:** Solves the Lorenz differential equations ($\rho, \sigma, \beta$) in real-time.
* **Tech:** Memoized physics engine (`useMemo`) separating calculation from rendering for 60fps performance.

---

## 🏗️ Architecture

The repository follows a monorepo structure to separate the Frontend (Brain) from the Smart Contracts (Chain).

```text
EntanglEducation-Platform/
├── apps/
│   └── web-client/          # React + Vite + TailwindCSS Application
│       ├── src/
│       │   ├── components/  # Physics Engines (Canvas API)
│       │   ├── hooks/       # Persistence Logic (useLocalStorage)
│       │   └── EntangleduMain.jsx
└── contracts/               # (Upcoming) Solidity/Hardhat Environment
```

---

## 🚀 Installation & Setup

Because this is a monorepo, you must install dependencies inside the client application folder.

### 1. Clone the repository
```bash
git clone https://github.com/justinabsentia/EntanglEducation-Platform.git
cd EntanglEducation-Platform
```

### 2. Install Dependencies
Navigate to the web client directory before installing:
```bash
cd apps/web-client
npm install
```

### 3. Run the Simulation
Start the local development server:
```bash
npm run dev
```

> Open the local link (usually http://localhost:5173) to launch the platform.

---

## 🛠️ Tech Stack

* **Frontend Framework:** React 18 + Vite 5
* **Styling:** TailwindCSS 3.3
* **Graphics:** Native HTML5 Canvas API (No WebGL libraries required)
* **Icons:** Lucide React
* **State Management:** Local-First Persistence (Simulating Wallet State)

---

## 📜 License

MIT License. Open source for educational use.
