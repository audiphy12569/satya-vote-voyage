import { configureChains, createConfig } from 'wagmi';
import { sepolia } from 'wagmi/chains';
import { alchemyProvider } from 'wagmi/providers/alchemy';
import { publicProvider } from 'wagmi/providers/public';
import { getDefaultWallets } from '@web3modal/ethereum';

// This will be replaced with your actual contract address after deployment
export const CONTRACT_ADDRESS = '0x0000000000000000000000000000000000000000';

// Configure chains & providers
const { chains, publicClient } = configureChains(
  [sepolia],
  [
    alchemyProvider({ apiKey: process.env.ALCHEMY_API_KEY || '' }),
    publicProvider(),
  ]
);

// Configure wallet connection
const { projectId } = getDefaultWallets({
  appName: 'Satya Vote',
  projectId: process.env.WALLET_CONNECT_PROJECT_ID || '',
  chains,
});

// Create wagmi config
export const wagmiConfig = createConfig({
  autoConnect: true,
  publicClient,
  projectId,
});

export const ethereumChains = chains;