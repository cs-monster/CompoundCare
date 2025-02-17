import React, { useContext, useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { CoinContext } from '../context/CoinContext'; // Import the context
import './marketss.css';  // Import the CSS file for styling

const Markets = () => {
  const [marketData, setMarketData] = useState([]);
  const [selectedAsset, setSelectedAsset] = useState('BNSOL'); // Default selected asset
  const [investmentAmount, setInvestmentAmount] = useState(''); // State for investment amount
  const [convertedAmount, setConvertedAmount] = useState(null); // State for converted amount
  const [simulatedReturns, setSimulatedReturns] = useState([]); // State for simulated returns
  const { allCoin } = useContext(CoinContext); // Access allCoin data from context

  // Fetch real-time data for the chart (Ethereum price data)
  useEffect(() => {
    const fetchMarketData = async () => {
      try {
        const response = await fetch(
          'https://api.coingecko.com/api/v3/coins/ethereum/market_chart?vs_currency=usd&days=7&interval=daily'
        );
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

  // Handle investment amount input
  const handleAmountChange = (e) => {
    const value = e.target.value;
    if (value === '' || (Number(value) >= 5 && !isNaN(value))) {
      setInvestmentAmount(value);
      calculateConvertedAmount(value, selectedAsset);
      calculateSimulatedReturns(value);
    }
  };

  // Handle asset selection change
  const handleAssetChange = (e) => {
    const asset = e.target.value;
    setSelectedAsset(asset);
    calculateConvertedAmount(investmentAmount, asset);
    calculateSimulatedReturns(investmentAmount);
  };

  // Calculate the converted amount based on the selected asset's price
  const calculateConvertedAmount = (amount, asset) => {
    if (amount === '' || isNaN(amount)) {
      setConvertedAmount(null);
      return;
    }

    const selectedCoin = allCoin.find((coin) => coin.symbol === asset.toLowerCase());
    if (selectedCoin) {
      const price = selectedCoin.current_price;
      const converted = (amount / price).toFixed(6); // Convert to 6 decimal places
      setConvertedAmount(converted);
    } else {
      setConvertedAmount(null);
    }
  };

  // Calculate simulated returns using compound interest formula
  const calculateSimulatedReturns = (amount) => {
    if (amount === '' || isNaN(amount)) {
      setSimulatedReturns([]);
      return;
    }

    const annualInterestRate = 0.1; // 10% annual interest rate (example)
    const principal = parseFloat(amount);

    const returns = [
      {
        period: '1 Month',
        value: principal * Math.pow(1 + annualInterestRate / 12, 1), // 1 month
      },
      {
        period: '6 Months',
        value: principal * Math.pow(1 + annualInterestRate / 12, 6), // 6 months
      },
      {
        period: '1 Year',
        value: principal * Math.pow(1 + annualInterestRate, 1), // 1 year
      },
    ];

    setSimulatedReturns(returns);
  };

  // Redirect to Ramp Network's Buy page
  const handleBuyNow = () => {
    const rampUrl = `https://ramp.network/buy`; // Direct to Ramp Network's Buy page
    window.open(rampUrl, '_blank'); // Open in a new tab
  };

  // Redirect to Help & Support page
  const handleLearnMore = () => {
    const helpUrl = `/help-support`; // Replace with your Help & Support page URL
    window.location.href = helpUrl; // Redirect to the Help & Support page
  };

  return (
    <div className="market-page">
      <nav className="navigation-bar">
        <h1>Markets</h1>
        <ul>
          <li>Market Trends</li>
          <li>Wireframe - 1</li>
          <li>Mineframe - 2</li>
        </ul>
      </nav>

      <div className="content">
        {/* Chart Section */}
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

        {/* Market Overview Table */}
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

        {/* Invest in a Market Section */}
        <div className="invest-section">
          <h2>Invest in a Market</h2>
          <div className="asset-selection">
            <label htmlFor="asset-select">Select Asset:</label>
            <select
              id="asset-select"
              value={selectedAsset}
              onChange={handleAssetChange}
            >
              <option value="BNSOL">Binance Staked SOL (BNSOL)</option>
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

          {/* Converted Amount Display */}
          {convertedAmount !== null && (
            <div className="converted-amount">
              <p>
                You will get: <strong>{convertedAmount}</strong> {selectedAsset.toUpperCase()}
              </p>
            </div>
          )}

          {/* Simulated Returns */}
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

          {/* Buy Now Button */}
          <button className="buy-now-btn" onClick={handleBuyNow}>
            Buy Now
          </button>

          {/* Learn More Button */}

          <a
  className="learn-more-btn"
  href="https://www.coinbase.com/en-gb/uk-fca-info"
  target="_blank"
  rel="noopener noreferrer"
>
  Learn More
</a>

        </div>

        {/* Borrowing Options Section */}
        <div className="borrowing-options">
          <h3>Borrowing Options</h3>
          <div className="platforms">
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
            <p>
              <strong>Warning:</strong> Borrowing against crypto assets carries risks, including liquidation and volatility risks. Please ensure you understand the terms before proceeding.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Markets;