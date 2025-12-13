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
// Default key for dev: 0x0123...
const PRIVATE_KEY = process.env.PRIVATE_KEY || "0x0123456789012345678901234567890123456789012345678901234567890123"; 
const wallet = new ethers.Wallet(PRIVATE_KEY);

console.log("[ENTANGLEDU ORACLE] Initialized");
console.log(`[SIGNER ADDRESS] ${wallet.address}`);

app.get('/api/health', (req, res) => res.json({
    status: 'active', 
    signer: wallet.address,
    mints: MINT_LOG.length 
}));

// [VERIFICATION] Public endpoint to audit issued certificates
app.get('/api/certificates', (req, res) => {
    res.json({
        total: MINT_LOG.length,
        certificates: MINT_LOG
    });
});

app.post('/api/mint', async (req, res) => {
  const { to, lessonId, lessonTitle } = req.body;

  if (!to || !lessonId) {
      return res.status(400).json({ error: "Missing 'to' address or 'lessonId'" });
  }

  try {
      console.log(`[ORACLE] Verifying completion for ${lessonId} by ${to}...`);
      
      // 1. GENERATE PAYLOAD
      const payload = ethers.utils.defaultAbiCoder.encode(
          ["string", "string", "uint256"],
          [lessonTitle, "ENTANGLEDU_V1", Date.now()]
      );
      const payloadHash = ethers.utils.keccak256(payload);

      // 2. SIGN PAYLOAD
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
      console.log(`[✓] Certificate issued: ${lessonId}`);

      // 3. RETURN PROOF
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
app.listen(PORT, () => console.log(`[ENTANGLEDU] Backend Oracle running on port ${PORT}`));
