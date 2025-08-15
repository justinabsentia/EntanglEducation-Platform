import React, { useState } from 'react';

export default function Home() {
  const [account, setAccount] = useState(null);

  async function connectWallet() {
    if (!window.ethereum) {
      alert('Please install MetaMask');
      return;
    }
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    setAccount(accounts[0]);
  }

  return (
    <main style={{padding: 40}}>
      <h1>EntanglEdu</h1>
      <p>Interactive physics quizzes gated by NFTs.</p>
      <button onClick={connectWallet}>{account ? `Connected: ${account.slice(0,6)}...${account.slice(-4)}` : 'Connect Wallet'}</button>
    </main>
  );
}