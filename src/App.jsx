import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThirdwebProvider } from "@thirdweb-dev/react"; // ✅ Correct
import Navbar from './Navbar'; 
import Markets from './pages/Markets';
import './App.css';
import { checkBackendConnection } from './api.js';
import Dashboard from './pages/Dashboard.jsx';
import HelpAndSupport from './pages/HelpSupport.jsx';

function App() {
  const [showPopup, setShowPopup] = useState(false);
  const [walletAddress, setWalletAddress] = useState(null);

  useEffect(() => {
    checkBackendConnection();
  }, []);

  const Home = () => (
    <div className="app-container">
      <h1 className="hq">Decentralized Micro-Investments</h1>
      <p className="hq1">Invest small. Earn big. Secure your future with CompoundCare.</p>
      
      <button 
        className="get-started-btn" 
        onClick={() => setShowPopup(true)}
      >
        Get Started
      </button>

      {showPopup && (
        <div className="popup-overlay">
          <div className="popup">
            <h2>Welcome to Compound Care!</h2>
            <ol>
              <li>Connect your wallet (e.g., MetaMask)</li>
              <li>Choose the amount you want to invest</li>
              <li>Calculate your compound interest</li>
              <li>Make your first investment and watch your earnings grow!</li>
            </ol>
            <button 
              className="close-btn" 
              onClick={() => setShowPopup(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
      
      <footer className="footer1">
        <p>2025 CompoundCare. All rights reserved.</p>
      </footer>
    </div>
  );

  return (
    <ThirdwebProvider
    activeChain="sepolia"
    clientId="1345e1e711977bd057c3fdf378abf23d"
    >
      <Router>
        <Navbar 
          walletAddress={walletAddress} 
          setWalletAddress={setWalletAddress}
        />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/markets" element={<Markets walletAddress={walletAddress} />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/HelpSupport" element={<HelpAndSupport />} />
        </Routes>
      </Router>
    </ThirdwebProvider>
  );
}

export default App;