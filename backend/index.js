const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { ethers } = require('ethers');

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

// --- MOCK DATABASE ---
// In production, this syncs with your Solidity Contract state
const MINT_LOG = [];

// --- PROTOCOL WALLET ---
// effectively the "Private Key" of the University
const PRIVATE_KEY = process.env.PRIVATE_KEY || "0x0123456789012345678901234567890123456789012345678901234567890123"; 
const wallet = new ethers.Wallet(PRIVATE_KEY);

app.get('/api/health', (req, res) => res.json({
    status: 'active', 
    signer: wallet.address,
    mints: MINT_LOG.length 
}));

app.post('/api/mint', async (req, res) => {
  const { to, lessonId, lessonTitle } = req.body;

  if (!to || !lessonId) {
      return res.status(400).json({ error: "Missing 'to' address or 'lessonId'" });
  }

  try {
      console.log(`[ORACLE] Verifying completion for ${lessonId} by ${to}...`);
      
      // 1. GENERATE PAYLOAD
      // We create a hash representing the certificate
      const payload = ethers.utils.defaultAbiCoder.encode(
          ["string", "string", "uint256"],
          [lessonTitle, "ENTANGLEDU_V1", Date.now()]
      );
      const payloadHash = ethers.utils.keccak256(payload);

      // 2. SIGN PAYLOAD
      // This signature proves the backend authorized this specific achievement
      const signature = await wallet.signMessage(ethers.utils.arrayify(payloadHash));

      const certificate = {
          id: `mint-${Date.now()}`,
          lessonId,
          title: lessonTitle,
          recipient: to,
          signature,
          hash: payloadHash,
          timestamp: Date.now()
      };

      MINT_LOG.push(certificate);

      // 3. RETURN PROOF
      // The client receives this and stores it. In the future, they submit this to the contract.
      return res.json({ 
          success: true, 
          certificate 
      });

  } catch (e) {
      console.error(e);
      return res.status(500).json({ error: "Signing failed" });
  }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`[ENTANGLEDU] Backend Oracle running on ${PORT}`));
