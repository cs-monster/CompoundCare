import React, { useContext, useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { CoinContext } from '../context/CoinContext';
import './marketss.css';
import { ethers } from 'ethers';
import ContractABI from './ContractABI.json';
import { WalletContext } from '../context/WalletContext'; // ✅

const CONTRACT_ADDRESS = "0xEd994eC1DeF0c700492756057150f8Af8C4F83A8";

const Markets = () => {
  const [marketData, setMarketData] = useState([]);
  const [selectedAsset, setSelectedAsset] = useState('BNSOL');
  const [investmentAmount, setInvestmentAmount] = useState('');
  const [convertedAmount, setConvertedAmount] = useState(null);
  const [simulatedReturns, setSimulatedReturns] = useState([]);
  const { allCoin } = useContext(CoinContext);
  const { walletAddress } = useContext(WalletContext); // ✅

  useEffect(() => {
    const fetchMarketData = async () => {
      try {
        const response = await fetch('https://api.coingecko.com/api/v3/coins/ethereum/market_chart?vs_currency=usd&days=7&interval=daily');
        const data = await response.json();
        const formattedData = data.prices.map((price) => ({
          date: new Date(price[0]).toLocaleDateString(),
          price: price[1],
        }));
        setMarketData(formattedData);
      } catch (error) {
        console.error('Error fetching market data:', error);
      }
    };

    fetchMarketData();
  }, []);

  const handleAmountChange = (e) => {
    const value = e.target.value;
    if (value === '' || (Number(value) >= 5 && !isNaN(value))) {
      setInvestmentAmount(value);
      calculateConvertedAmount(value, selectedAsset);
      calculateSimulatedReturns(value);
    }
  };

  const handleAssetChange = (e) => {
    const asset = e.target.value;
    setSelectedAsset(asset);
    calculateConvertedAmount(investmentAmount, asset);
    calculateSimulatedReturns(investmentAmount);
  };

  const calculateConvertedAmount = (amount, asset) => {
    if (amount === '' || isNaN(amount)) {
      setConvertedAmount(null);
      return;
    }

    const selectedCoin = asset === "sepeth"
      ? { current_price: 1 }
      : allCoin.find((coin) => coin.symbol === asset.toLowerCase());

    if (selectedCoin) {
      const price = selectedCoin.current_price;
      const converted = (amount / price).toFixed(6);
      setConvertedAmount(converted);
    } else {
      setConvertedAmount(null);
    }
  };

  const calculateSimulatedReturns = (amount) => {
    if (amount === '' || isNaN(amount)) {
      setSimulatedReturns([]);
      return;
    }

    const annualInterestRate = 0.1;
    const principal = parseFloat(amount);

    const returns = [
      { period: '1 Month', value: principal * Math.pow(1 + annualInterestRate / 12, 1) },
      { period: '6 Months', value: principal * Math.pow(1 + annualInterestRate / 12, 6) },
      { period: '1 Year', value: principal * Math.pow(1 + annualInterestRate, 1) },
    ];

    setSimulatedReturns(returns);
  };

  const DISPLAY_TO_ETH_CONVERSION = 0.00024;
  const handleInvest = async () => {
    try {
      if (!investmentAmount || parseFloat(investmentAmount) <= 0) {
        return alert("Please enter a valid amount.");
      }
  
      if (!window.ethereum) {
        return alert("MetaMask not detected. Please install MetaMask extension.");
      }
  
      if (!walletAddress) {
        return alert("Please connect your wallet first.");
      }
  
      const browserProvider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = browserProvider.getSigner();
      const userContract = new ethers.Contract(CONTRACT_ADDRESS, ContractABI, signer);
  
      const ethAmount = (parseFloat(investmentAmount) * DISPLAY_TO_ETH_CONVERSION).toFixed(6);
      const amountInWei = ethers.utils.parseEther(ethAmount.toString());
  
      const tx = await userContract.invest({ value: amountInWei });
      await tx.wait();
  
      alert(`Successfully invested ${investmentAmount} ETH!`);
      setInvestmentAmount("");
    } catch (error) {
      console.error("Investment failed:", error);
      alert("Transaction failed. Please try again.");
    }
  };
  

  const handleLearnMore = () => {
    const helpUrl = `/help-support`;
    window.location.href = helpUrl;
  };

  return (
    <div className="market-page">
      <nav className="navigation-bar">
        <h1>Markets</h1>
        <ul>
          <li>Market Trends</li>
        </ul>
      </nav>

      <div className="content">
        <div className="chart-section">
          <h2>Market Trends</h2>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={marketData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="price" stroke="#00FFCC" activeDot={{ r: 8 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="market-overview">
          <h2>Market Overview</h2>
          <table>
            <thead>
              <tr>
                <th>Market</th>
                <th>Price</th>
                <th>24h Change</th>
                <th>Market Cap</th>
                <th>Total Volume</th>
              </tr>
            </thead>
            <tbody>
              {allCoin.map((coin) => (
                <tr key={coin.id}>
                  <td>
                    <img src={coin.image} alt={coin.name} width="20" height="20" /> {coin.name} ({coin.symbol.toUpperCase()})
                  </td>
                  <td>${coin.current_price}</td>
                  <td style={{ color: coin.price_change_percentage_24h >= 0 ? '#00FFCC' : '#FF0000' }}>
                    {coin.price_change_percentage_24h.toFixed(2)}%
                  </td>
                  <td>${coin.market_cap.toLocaleString()}</td>
                  <td>${coin.total_volume.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="invest-section">
          <h2>Invest in a Market</h2>

          <div className="asset-selection">
            <label htmlFor="asset-select">Select Asset:</label>
            <select id="asset-select" value={selectedAsset} onChange={handleAssetChange}>
              <option value="sepeth">Ethereum (Sepolia)</option>
              {allCoin.map((coin) => (
                <option key={coin.id} value={coin.symbol}>
                  {coin.name} ({coin.symbol.toUpperCase()})
                </option>
              ))}
            </select>
          </div>

          <div className="investment-amount">
            <label htmlFor="investment-amount">Enter Amount (Minimum £5):</label>
            <input
              type="number"
              id="investment-amount"
              value={investmentAmount}
              onChange={handleAmountChange}
              min="5"
              placeholder="Enter amount"
            />
          </div>

          {convertedAmount !== null && (
            <div className="converted-amount">
              <p>You will get: <strong>{convertedAmount}</strong> {selectedAsset.toUpperCase()}</p>
            </div>
          )}

          {simulatedReturns.length > 0 && (
            <div className="simulated-returns">
              <h3>Simulated Returns</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={simulatedReturns}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="period" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="value" fill="#00FFCC" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}

          <div className="invest-buttons">
            <button className="buy-now-btn" onClick={handleInvest}>
              Invest Now
            </button>
            <a
              className="learn-more-btn"
              href="https://www.coinbase.com/en-gb/uk-fca-info"
              target="_blank"
              rel="noopener noreferrer"
            >
              Learn More
            </a>
          </div>

          <p className="demo-note">
            * For demo purposes, only Sepolia ETH will be invested regardless of selected asset.
          </p>

          <div className="borrowing-options">
            <h3>Borrowing Options</h3>
            <div className="platforms">
              {/* Example platforms */}
              <div className="platform-card">
                <h4>Aave</h4>
                <p>Interest Rate: 5% APR</p>
                <p>Collateral Ratio: 75% LTV</p>
                <p>Supported Assets: ETH, BTC, USDC, DAI</p>
                <a href="https://aave.com" target="_blank" rel="noopener noreferrer">Visit Aave</a>
              </div>
              <div className="platform-card">
                <h4>Compound</h4>
                <p>Interest Rate: 4.5% APR</p>
                <p>Collateral Ratio: 80% LTV</p>
                <p>Supported Assets: ETH, WBTC, USDT, LINK</p>
                <a href="https://compound.finance" target="_blank" rel="noopener noreferrer">Visit Compound</a>
              </div>
              <div className="platform-card">
                <h4>MakerDAO</h4>
                <p>Interest Rate: 3% APR</p>
                <p>Collateral Ratio: 150%</p>
                <p>Supported Assets: ETH, WBTC</p>
                <a href="https://makerdao.com" target="_blank" rel="noopener noreferrer">Visit MakerDAO</a>
              </div>
            </div>
            <div className="risk-warning">
              <p><strong>Warning:</strong> Borrowing against crypto assets carries risks, including liquidation and volatility risks. Please ensure you understand the terms before proceeding.</p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Markets;
