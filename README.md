# EntanglEducation Platform

**Chief Protocol Architect:** EntangledU
**Status:** v2.0 (Mobile-First PWA + Oracle)

EntanglEducation is a decentralized learning platform that combines interactive physics simulations with cryptographic proofs of knowledge.

## 🏗 Architecture v2.0

The platform has migrated from a monolith to a modular, Web3-native architecture:

* **📱 Client (`apps/web-client`)**: 
    * React 18 + Vite
    * Mobile-First PWA (Installable, Offline Support)
    * Tailwind CSS for responsive design
    * Interacts with the Oracle for verification

* **🔮 Oracle (`backend`)**:
    * Express.js + Ethers.js
    * Acts as the "University Registrar"
    * Cryptographically signs certificates using a private key
    * Auditable via `/api/certificates`

* **⛓️ Chain (`contracts`)**:
    * Hardhat environment
    * `SimpleNFT.sol` (ERC721) for on-chain credentials
    * Local devnet ready

## 🚀 Getting Started

### 1. Ignite the Oracle (Backend)
```bash
cd backend
npm install
node index.js
# Runs on http://localhost:4000
```

### 2. Launch the Client (Frontend)
```bash
cd apps/web-client
npm install
npm run dev
# Runs on http://localhost:5173
```

Note: Open the network URL (e.g., http://192.168.x.x:5173) on your mobile phone to test PWA features.

### 3. Deploy the Chain (Optional)
```bash
cd contracts
npm install
npx hardhat node
# In a new terminal:
npx hardhat run --network localhost scripts/deploy.js
```

🔒 Security
 * Proof of Knowledge: Certificates are signed by the backend Oracle only after lesson completion logic is verified.
 * Verifiable: The client stores the cryptographic signature (r,s,v) which can be verified on-chain.
📱 Mobile Features
 * PWA: "Add to Home Screen" enabled.
 * Offline Mode: Service Worker caches assets for offline learning.
 * Touch: Optimized UI for mobile interaction.

<!-- end -->
