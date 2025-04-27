// src/context/WalletContext.jsx
import React, { createContext, useState, useContext, useEffect } from "react";
import { useAddress } from "@thirdweb-dev/react";

export const WalletContext = createContext();

export const WalletProvider = ({ children }) => {
  const address = useAddress();
  const [walletAddress, setWalletAddress] = useState(null);

  useEffect(() => {
    if (address) setWalletAddress(address);
  }, [address]);

  return (
    <WalletContext.Provider value={{ walletAddress, setWalletAddress }}>
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = () => useContext(WalletContext);
