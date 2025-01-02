import { createWalletClient, custom } from 'viem';
import { sepolia } from 'viem/chains';

export const requestWalletAccess = async () => {
  if (!window.ethereum) {
    throw new Error('No Ethereum provider found. Please install MetaMask or another wallet.');
  }

  try {
    const accounts = await window.ethereum.request({ 
      method: 'eth_requestAccounts' 
    });

    if (!accounts || accounts.length === 0) {
      throw new Error('No accounts found. Please ensure your wallet is connected.');
    }

    return accounts[0];
  } catch (error) {
    console.error('Error requesting wallet access:', error);
    throw new Error('Failed to connect to wallet. Please try again.');
  }
};

export const getWalletClient = () => {
  if (!window.ethereum) {
    throw new Error('No Ethereum provider found. Please install MetaMask or another wallet.');
  }

  return createWalletClient({
    chain: sepolia,
    transport: custom(window.ethereum)
  });
};