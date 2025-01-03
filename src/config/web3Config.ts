import { configureChains, createConfig } from 'wagmi';
import { sepolia } from 'wagmi/chains';
import { alchemyProvider } from 'wagmi/providers/alchemy';
import { publicProvider } from 'wagmi/providers/public';
import { EthereumClient, w3mConnectors, w3mProvider } from '@web3modal/ethereum';

// This will be replaced with your actual contract address after deployment
export const CONTRACT_ADDRESS = '0x0000000000000000000000000000000000000000';

// Replace this with your admin address
export const ADMIN_ADDRESS = '0x0000000000000000000000000000000000000000';

// Fallback API key for development
const FALLBACK_ALCHEMY_KEY = "YOUR_FALLBACK_ALCHEMY_KEY";

// Configure chains & providers
const { chains, publicClient, webSocketPublicClient } = configureChains(
  [sepolia],
  [
    alchemyProvider({ apiKey: import.meta.env.VITE_ALCHEMY_API_KEY || FALLBACK_ALCHEMY_KEY }),
    publicProvider(),
  ]
);

// Create wagmi config
export const config = createConfig({
  autoConnect: true,
  connectors: w3mConnectors({ 
    projectId: import.meta.env.VITE_WALLET_CONNECT_PROJECT_ID || "YOUR_FALLBACK_PROJECT_ID", 
    chains 
  }),
  publicClient,
  webSocketPublicClient,
});

export const ethereumClient = new EthereumClient(config, chains);