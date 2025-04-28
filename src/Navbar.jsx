import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import Web3 from "web3";
import "./Navbarr.css";
import { WalletContext } from "./context/WalletContext"; // ✅ Correct import

const Navbar = () => {
  const { walletAddress, setWalletAddress } = useContext(WalletContext);
  const [web3, setWeb3] = useState(null);
  const [connecting, setConnecting] = useState(false); // Optional: show loading

  useEffect(() => {
    if (typeof window !== "undefined" && typeof window.ethereum !== "undefined") {
      const web3Instance = new Web3(window.ethereum);
      setWeb3(web3Instance);
    } else {
      console.log("MetaMask not detected");
    }
  }, []);

  const connectWallet = async () => {
    if (typeof window === "undefined" || typeof window.ethereum === "undefined") {
      alert("MetaMask is not installed. Please install it to connect.");
      return;
    }

    try {
      setConnecting(true); // Show connecting status
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      const address = accounts[0];

      const chainId = await window.ethereum.request({ method: "eth_chainId" });
      if (chainId !== "0xaa36a7") { // Sepolia network
        alert("Please switch to Sepolia Test Network in MetaMask.");
        setConnecting(false);
        return;
      }

      setWalletAddress(address);
    } catch (error) {
      console.error("Wallet connection error:", error);
      alert("Failed to connect wallet. Please try again.");
    } finally {
      setConnecting(false); // Done trying
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
            <button type="button" className="disconnect-btn" onClick={disconnectWallet}>
              Disconnect
            </button>
          </div>
        ) : (
          <button type="button" className="connect-btn" onClick={connectWallet}>
            {connecting ? "Connecting..." : "Connect Wallet"}
          </button>
        )}
      </nav>
    </header>
  );
};

export default Navbar;
