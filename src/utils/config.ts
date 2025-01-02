import { createPublicClient, http, createWalletClient, custom } from 'viem';
import { sepolia } from 'viem/chains';

// Fallback contract address for development
const FALLBACK_CONTRACT_ADDRESS = "0x0000000000000000000000000000000000000000";

// Get contract address from environment variable
export const CONTRACT_ADDRESS = import.meta.env.VITE_CONTRACT_ADDRESS || FALLBACK_CONTRACT_ADDRESS;

// Create public client for read operations
export const publicClient = createPublicClient({
  chain: sepolia,
  transport: http()
});

// Create wallet client for write operations
export const walletClient = createWalletClient({
  chain: sepolia,
  transport: custom(window.ethereum!)
});