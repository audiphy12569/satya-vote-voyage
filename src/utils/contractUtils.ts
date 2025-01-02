import { createPublicClient, http, createWalletClient, custom } from 'viem';
import { sepolia } from 'viem/chains';
import { abi } from './contractAbi';
import type { ElectionStatus, Candidate, CandidateResponse, ElectionStatusResponse } from './types';

const CONTRACT_ADDRESS = import.meta.env.VITE_CONTRACT_ADDRESS;

export const publicClient = createPublicClient({
  chain: sepolia,
  transport: http()
});

// Get admin address from contract
export const getAdminAddress = async (): Promise<string | undefined> => {
  try {
    console.log('Fetching admin address from contract...');
    const data = await publicClient.readContract({
      address: CONTRACT_ADDRESS as `0x${string}`,
      abi,
      functionName: 'admin'
    }) as string;
    
    console.log('Admin address fetched:', data);
    return data;
  } catch (error) {
    console.error('Error fetching admin address:', error);
    return undefined;
  }
};

// Get all approved voters
export const getVoters = async (): Promise<string[]> => {
  try {
    console.log('Fetching approved voters from contract...');
    const data = await publicClient.readContract({
      address: CONTRACT_ADDRESS as `0x${string}`,
      abi,
      functionName: 'getApprovedVoters'
    }) as string[];
    
    return data;
  } catch (error) {
    console.error('Error fetching voters:', error);
    return [];
  }
};

// Fetch all candidates
export const getCandidates = async (): Promise<Candidate[]> => {
  try {
    console.log('Fetching candidates from contract...');
    const count = await publicClient.readContract({
      address: CONTRACT_ADDRESS as `0x${string}`,
      abi,
      functionName: 'getCandidateCount'
    }) as bigint;
    
    const candidates: Candidate[] = [];
    
    for(let i = 0; i < Number(count); i++) {
      const candidate = await publicClient.readContract({
        address: CONTRACT_ADDRESS as `0x${string}`,
        abi,
        functionName: 'getCandidate',
        args: [BigInt(i)]
      }) as CandidateResponse;
      
      candidates.push({
        name: candidate[0],
        party: candidate[1],
        tagline: candidate[2],
        logoIPFS: candidate[3],
        voteCount: candidate[4]
      });
    }
    
    console.log('Candidates fetched:', candidates);
    return candidates;
  } catch (error) {
    console.error('Error fetching candidates:', error);
    return [];
  }
};

// Fetch election status
export const getElectionStatus = async (): Promise<ElectionStatus> => {
  try {
    console.log('Fetching election status from contract...');
    const status = await publicClient.readContract({
      address: CONTRACT_ADDRESS as `0x${string}`,
      abi,
      functionName: 'getElectionStatus'
    }) as ElectionStatusResponse;
    
    console.log('Election status fetched:', status);
    return {
      isActive: status[0],
      startTime: status[1],
      endTime: status[2],
      totalVotes: status[3]
    };
  } catch (error) {
    console.error('Error fetching election status:', error);
    return {
      isActive: false,
      startTime: BigInt(0),
      endTime: BigInt(0),
      totalVotes: BigInt(0)
    };
  }
};

// Approve a voter
export const approveVoter = async (voterAddress: string): Promise<void> => {
  try {
    console.log('Approving voter:', voterAddress);
    const walletClient = createWalletClient({
      chain: sepolia,
      transport: custom(window.ethereum)
    });
    
    const [address] = await walletClient.requestAddresses();
    
    await walletClient.writeContract({
      address: CONTRACT_ADDRESS as `0x${string}`,
      abi,
      functionName: 'approveVoter',
      args: [voterAddress as `0x${string}`]
    });
  } catch (error) {
    console.error('Error approving voter:', error);
    throw error;
  }
};

// Cast a vote
export const castVote = async (candidateId: number): Promise<void> => {
  try {
    const walletClient = createWalletClient({
      chain: sepolia,
      transport: custom(window.ethereum)
    });
    
    const [address] = await walletClient.requestAddresses();
    
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

// Start election
export const startElection = async (durationInMinutes: number): Promise<void> => {
  try {
    const walletClient = createWalletClient({
      chain: sepolia,
      transport: custom(window.ethereum)
    });
    
    const [address] = await walletClient.requestAddresses();
    
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