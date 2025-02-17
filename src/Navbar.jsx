import React, { useContext, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Navbarr.css';
import { CoinContext } from './context/CoinContext';
import Web3 from 'web3';

const Navbar = () => {
  const [walletAddress, setWalletAddress] = useState('');
  const { setAccount } = useContext(CoinContext);

  useEffect(() => {
    const checkWalletConnection = async () => {
      if (window.ethereum) {
        try {
          const web3 = new Web3(window.ethereum);
          const accounts = await web3.eth.getAccounts();
          if (accounts.length > 0) {
            setWalletAddress(accounts[0]);
            setAccount(accounts[0]);
          }
        } catch (error) {
          console.error('Error fetching wallet:', error);
        }
      }
    };
    checkWalletConnection();
  }, [setAccount]);

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const web3 = new Web3(window.ethereum);
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        const accounts = await web3.eth.getAccounts();
        if (accounts.length > 0) {
          setWalletAddress(accounts[0]);
          setAccount(accounts[0]);
        }
      } catch (error) {
        console.error('User denied account access or error occurred:', error);
      }
    } else {
      alert('MetaMask is not installed');
    }
  };

  const disconnectWallet = () => {
    setWalletAddress('');
    setAccount('');
    console.log('Wallet disconnected');
  };

  return (
    <header className="header">
      <a href="/" className='Cc'>CompoundCare</a>
      <nav className='navbar'>
        <Link to="/markets">Markets</Link>
        <a href="/">Dashboard</a>
        <Link to="/HelpSupport">Help & Support</Link>

        {walletAddress ? (
          <div className="wallet-container">
            <span className="wallet-address">
              {walletAddress.substring(0, 6)}...{walletAddress.slice(-4)}
            </span>
            <button className="disconnect-btn" onClick={disconnectWallet}>Disconnect Wallet</button>
          </div>
        ) : (
          <button className="connect-btn" onClick={connectWallet}>Connect Wallet</button>
        )}
      </nav>
    </header>
  );
};

export default Navbar;
