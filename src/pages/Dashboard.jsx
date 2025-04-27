import "./ds.css";
import React, { useContext, useEffect, useState } from "react";
//import { useAddress, useContract, useContractWrite } from "@thirdweb-dev/react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { WalletContext } from '../context/WalletContext'; // NEW
import axios from "axios";
import { ethers } from "ethers"; 
import ContractABI from './ContractABI.json'; // ✅ Correct the path!
const CONTRACT_ADDRESS = "0xEd994eC1DeF0c700492756057150f8Af8C4F83A8";

const Dashboard = () => {
  const { walletAddress } = useContext(WalletContext); // ✅ NEW
  //const { contract } = useContract("0xEd994eC1DeF0c700492756057150f8Af8C4F83A8");
  //const { mutateAsync: withdrawFunds, isLoading } = useContractWrite(contract, "withdraw");
  const [transactions, setTransactions] = useState([]); // ✅ Add this
  const [isLoading, setIsLoading] = useState(false); // ADD THIS

// Fetch real-time txs from Etherscan
useEffect(() => {
  const fetchTxHistory = async () => {
    if (!walletAddress) return;

    try {
      const response = await axios.get(`https://api-sepolia.etherscan.io/api`, {
        params: {
          module: "account",
          action: "txlist",
          address: walletAddress,
          startblock: 0,
          endblock: 99999999,
          sort: "desc",
          apikey: "BGVCAGEXGABEKF927Q5AUT9BNYNSTHQGCV" // 🔁 Replace with your key
        }
      });

      if (response.data.status === "1") {
        setTransactions(response.data.result.slice(0, 5)); // Show last 5
      } else {
        toast.error("No transaction history found.");
      }
    } catch (error) {
      console.error("Failed to fetch transactions", error);
    }
  };

  fetchTxHistory();
}, [walletAddress]);
const handleWithdraw = async () => {
  try {
    if (!window.ethereum) {
      return toast.error("MetaMask not detected. Please install MetaMask.");
    }

    setIsLoading(true); // Start loading

    const browserProvider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = browserProvider.getSigner();

    const userContract = new ethers.Contract(CONTRACT_ADDRESS, ContractABI, signer);

    const tx = await userContract.withdraw();
    await tx.wait();

    toast.success("Successfully withdrew your full investment + earned interest!");
  } catch (err) {
    console.error("Withdrawal error:", err);
    toast.error("Withdrawal failed. Please try again.");
  } finally {
    setIsLoading(false); // Always stop loading
  }
};

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">Dashboard</h1>

      {/* Wallet Summary */}
      <div className="card-grid">
        <div className="card-custom">
          <p>Connected Wallet</p>
          <h2>{walletAddress || "Not connected"}</h2>
          </div>
        <div className="card-custom">
          <p>Total Invested</p>
          <h2>Ξ 0.045 ETH</h2>
        </div>
        <div className="card-custom">
          <p>Interest Earned</p>
          <h2>Ξ 0.0032 ETH</h2>
        </div>
      </div>

      {/* Withdraw Section */}
      <div className="section">
        <h2>Withdraw Funds</h2>
        <p className="mb-2">Click below to withdraw your full investment + interest.</p>
        <button
          onClick={handleWithdraw}
          disabled={isLoading}
          className="withdraw-button"
        >
          {isLoading ? "Processing..." : "Withdraw Now"}
        </button>
      </div>

      {/* Transaction History */}
      <div className="section">
        <h2>Recent Transactions</h2>
        <ul className="tx-history">
          {transactions.length > 0 ? (
            transactions.map((tx) => (
              <li key={tx.hash}>
                ✅ {tx.value / 1e18} ETH — {new Date(tx.timeStamp * 1000).toLocaleString()}
                <br />
                <a href={`https://sepolia.etherscan.io/tx/${tx.hash}`} target="_blank" rel="noreferrer">
                  View on Etherscan
                </a>
              </li>
            ))
          ) : (
            <li>No transactions to display.</li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default Dashboard;