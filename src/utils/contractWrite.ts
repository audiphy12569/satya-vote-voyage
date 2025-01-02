import { CONTRACT_ADDRESS } from '@/config/web3Config';
import { abi } from './contractAbi';
import { requestWalletAccess, getWalletClient } from './walletUtils';

export const approveVoter = async (voterAddress: string): Promise<void> => {
  try {
    console.log('Approving voter:', voterAddress);
    
    await requestWalletAccess();
    const walletClient = getWalletClient();
    
    const hash = await walletClient.writeContract({
      address: CONTRACT_ADDRESS as `0x${string}`,
      abi,
      functionName: 'approveVoter',
      args: [voterAddress as `0x${string}`]
    });

    console.log('Transaction hash:', hash);
  } catch (error) {
    console.error('Error in approveVoter:', error);
    throw error;
  }
};

export const castVote = async (candidateId: number): Promise<void> => {
  try {
    await requestWalletAccess();
    const walletClient = getWalletClient();
    
    await walletClient.writeContract({
      address: CONTRACT_ADDRESS as `0x${string}`,
      abi,
      functionName: 'vote',
      args: [BigInt(candidateId)]
    });
  } catch (error) {
    console.error('Error casting vote:', error);
    throw error;
  }
};

export const startElection = async (durationInMinutes: number): Promise<void> => {
  try {
    await requestWalletAccess();
    const walletClient = getWalletClient();
    
    await walletClient.writeContract({
      address: CONTRACT_ADDRESS as `0x${string}`,
      abi,
      functionName: 'startElection',
      args: [BigInt(durationInMinutes)]
    });
  } catch (error) {
    console.error('Error starting election:', error);
    throw error;
  }
};