import { createWalletClient, custom } from 'viem';
import { sepolia } from 'viem/chains';

declare global {
  interface Window {
    ethereum?: any;
  }
}

export const requestWalletAccess = async (): Promise<string> => {
  if (!window.ethereum) {
    throw new Error('No Ethereum provider found. Please install MetaMask.');
  }

  try {
    const accounts = await window.ethereum.request({ 
      method: 'eth_requestAccounts' 
    });
    
    if (!accounts[0]) {
      throw new Error('No account found');
    }

    return accounts[0];
  } catch (error) {
    console.error('Error requesting wallet access:', error);
    throw error;
  }
};

export const getWalletClient = async () => {
  if (!window.ethereum) {
    throw new Error('No Ethereum provider found. Please install MetaMask.');
  }

  const [account] = await window.ethereum.request({ 
    method: 'eth_requestAccounts' 
  });

  return createWalletClient({
    account,
    chain: sepolia,
    transport: custom(window.ethereum)
  });
};