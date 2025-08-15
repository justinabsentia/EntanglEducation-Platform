EntanglEducation-Platform

EntanglEdu is an educational platform focused on interactive physics quizzes gated by NFT ownership. This repository is a full-stack scaffold including:
- Smart contracts (Solidity) for minting and managing NFTs (Polygon compatible)
- Next.js frontend with wallet connect helpers
- Express backend API for content and minting orchestration

Quickstart (local dev):
1. Create .env files in backend/ and frontend/ with required keys (INFURA/ALCHEMY, PRIVATE_KEY)
2. Install dependencies per package (contract tooling: Hardhat/Foundry; frontend: Next.js; backend: Node/Express)
3. Run backend: cd backend && npm install && npm run dev
4. Run frontend: cd frontend && npm install && npm run dev
5. Deploy contracts to Mumbai and update FRONTEND_CONTRACT_ADDRESS in .env