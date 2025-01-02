import { CONTRACT_ADDRESS } from '@/config/web3Config';
import { abi } from './contractAbi';
import { requestWalletAccess, getWalletClient } from './walletUtils';
import { sepolia } from 'viem/chains';

export const approveVoter = async (voterAddress: string): Promise<void> => {
  try {
    console.log('Approving voter:', voterAddress);
    
    const account = await requestWalletAccess();
    const walletClient = await getWalletClient();
    
    const hash = await walletClient.writeContract({
      address: CONTRACT_ADDRESS as `0x${string}`,
      abi,
      functionName: 'approveVoter',
      args: [voterAddress as `0x${string}`],
      account: account as `0x${string}`,
      chain: sepolia
    });

    console.log('Transaction hash:', hash);
  } catch (error) {
    console.error('Error in approveVoter:', error);
    throw error;
  }
};

export const addCandidate = async (
  name: string,
  party: string,
  tagline: string,
  logoIPFS: string
): Promise<void> => {
  try {
    const account = await requestWalletAccess();
    const walletClient = await getWalletClient();
    
    await walletClient.writeContract({
      address: CONTRACT_ADDRESS as `0x${string}`,
      abi,
      functionName: 'addCandidate',
      args: [name, party, tagline, logoIPFS],
      account: account as `0x${string}`,
      chain: sepolia
    });
  } catch (error) {
    console.error('Error adding candidate:', error);
    throw error;
  }
};

export const removeCandidate = async (candidateId: number): Promise<void> => {
  try {
    const account = await requestWalletAccess();
    const walletClient = await getWalletClient();
    
    await walletClient.writeContract({
      address: CONTRACT_ADDRESS as `0x${string}`,
      abi,
      functionName: 'removeCandidate',
      args: [BigInt(candidateId)],
      account: account as `0x${string}`,
      chain: sepolia
    });
  } catch (error) {
    console.error('Error removing candidate:', error);
    throw error;
  }
};

export const castVote = async (candidateId: number): Promise<void> => {
  try {
    const account = await requestWalletAccess();
    const walletClient = await getWalletClient();
    
    await walletClient.writeContract({
      address: CONTRACT_ADDRESS as `0x${string}`,
      abi,
      functionName: 'vote',
      args: [BigInt(candidateId)],
      account: account as `0x${string}`,
      chain: sepolia
    });
  } catch (error) {
    console.error('Error casting vote:', error);
    throw error;
  }
};

export const startElection = async (durationInMinutes: number): Promise<void> => {
  try {
    const account = await requestWalletAccess();
    const walletClient = await getWalletClient();
    
    await walletClient.writeContract({
      address: CONTRACT_ADDRESS as `0x${string}`,
      abi,
      functionName: 'startElection',
      args: [BigInt(durationInMinutes)],
      account: account as `0x${string}`,
      chain: sepolia
    });
  } catch (error) {
    console.error('Error starting election:', error);
    throw error;
  }
};
