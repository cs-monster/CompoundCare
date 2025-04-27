import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import CoinContextProvider from './context/CoinContext.jsx';
import { ThirdwebProvider } from "@thirdweb-dev/react";
import { WalletProvider } from './context/WalletContext.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThirdwebProvider
      clientId="1345e1e711977bd057c3fdf378abf23d"
      activeChain="sepolia"
    >
      <WalletProvider>
      <CoinContextProvider>
        <App />
      </CoinContextProvider>
      </WalletProvider>
    </ThirdwebProvider>
  </StrictMode>
);
