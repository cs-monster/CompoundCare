import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './Navbar';
import Markets from './pages/Markets';
import HelpSupport from './pages/HelpSupport';
import './App.css';

function App() {
  const [showPopup, setShowPopup] = useState(false);
  const [walletAddress, setWalletAddress] = useState(''); // State for wallet address

  return (
    <Router>
      <div>
        {/* Navbar - Always visible */}
        <Navbar walletAddress={walletAddress} setWalletAddress={setWalletAddress} />

        {/* Routes for different pages */}
        <Routes>
          {/* Home Route */}
          <Route
            path="/"
            element={
              <div className="app-container">
                <h1 className="hq">Decentralized Micro-Investments</h1>
                <p className="hq1">Invest small. Earn big. Secure your future with CompoundCare.</p>
                <button className="get-started-btn" onClick={() => setShowPopup(true)}>
                  Get Started
                </button>

                {/* Popup Modal */}
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
                      <button className="close-btn" onClick={() => setShowPopup(false)}>
                        Close
                      </button>
                    </div>
                  </div>
                )}
              </div>
            }
          />

          {/* Markets Route */}
          <Route path="/markets" element={<Markets walletAddress={walletAddress} />} />

          {/* Help & Support Route */}
          <Route path="/HelpSupport" element={<HelpSupport />} />
        </Routes>

        {/* Footer - Always visible */}
        <footer className="footer">
          <p>2025 CompoundCare. All rights reserved.</p>
        </footer>
      </div>
    </Router>
  );
}

export default App;