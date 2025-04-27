import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import Web3 from "web3";
import "./Navbarr.css";
import { WalletContext } from "./context/WalletContext"; // ✅ Correct path from src/Navbar.jsx

const Navbar = () => {
  const { walletAddress, setWalletAddress } = useContext(WalletContext);
  const [web3, setWeb3] = useState(null);

  useEffect(() => {
    if (window.ethereum) {
      const web3Instance = new Web3(window.ethereum);
      setWeb3(web3Instance);
    } else {
      alert("MetaMask is not installed. Please install it to connect.");
    }
  }, []);

  const connectWallet = async () => {
    if (!web3) {
      alert("Web3 is not initialized. Please install MetaMask.");
      return;
    }

    try {
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      const address = accounts[0];
      const chainId = await window.ethereum.request({ method: 'eth_chainId' });
    if (chainId !== '0xaa36a7') { // Sepolia chainId is 0xaa36a7
      alert('Please switch to Sepolia Test Network in MetaMask.');
      return;
    }
      setWalletAddress(address);
    } catch (error) {
      console.error("User denied account access", error);
    }
  };

  const disconnectWallet = () => {
    setWalletAddress(null);
  };

  return (
    <header className="header">
      <a href="/" className="Cc">CompoundCare</a>
      <nav className="navbar">
        <Link to="/markets">Markets</Link>
        <Link to="/Dashboard">Dashboard</Link>
        <Link to="/HelpSupport">Help & Support</Link>

        {walletAddress ? (
          <div className="wallet-container">
            <span className="wallet-address">
              {walletAddress.substring(0, 6)}...{walletAddress.slice(-4)}
            </span>
            <button className="disconnect-btn" onClick={disconnectWallet}>Disconnect</button>
          </div>
        ) : (
          <button className="connect-btn" onClick={connectWallet}>Connect Wallet</button>
        )}
      </nav>
    </header>
  );
};

export default Navbar;
