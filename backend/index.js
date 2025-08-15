const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => res.json({status: 'ok'}));

// Placeholder mint route - requires server-side wallet/private key
app.post('/api/mint', async (req, res) => {
  const { to, tokenURI } = req.body;
  // Implement server-side mint orchestration using ethers + deployed contract
  return res.status(501).json({error: 'Not implemented', to, tokenURI});
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Backend running on ${PORT}`));