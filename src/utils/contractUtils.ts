import { createPublicClient, http, getContract, createWalletClient, custom } from 'viem';
import { sepolia } from 'viem/chains';
import { abi } from './contractAbi';

// Define types for our contract responses
interface ElectionStatus {
  isActive: boolean;
  startTime: bigint;
  endTime: bigint;
  totalVotes: bigint;
}

interface Candidate {
  name: string;
  party: string;
  tagline: string;
  logoIPFS: string;
  voteCount: bigint;
}

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
  transport: custom(window.ethereum)
});

// Create contract instance
export const getContractInstance = () => {
  console.log('Creating contract instance with address:', CONTRACT_ADDRESS);
  return getContract({
    address: CONTRACT_ADDRESS as `0x${string}`,
    abi,
    publicClient,
    walletClient,
  });
};

// Fetch admin address from contract
export const getAdminAddress = async (): Promise<string | null> => {
  const contract = getContractInstance();
  try {
    console.log('Fetching admin address from contract...');
    const admin = await contract.read.admin();
    console.log('Admin address fetched:', admin);
    return admin as string;
  } catch (error) {
    console.error('Error fetching admin address:', error);
    return null;
  }
};

// Get all approved voters
export const getVoters = async (): Promise<string[]> => {
  const contract = getContractInstance();
  try {
    console.log('Fetching approved voters from contract...');
    const voters = await contract.read.getVoters();
    return voters as string[];
  } catch (error) {
    console.error('Error fetching voters:', error);
    return [];
  }
};

// Fetch all candidates
export const getCandidates = async (): Promise<Candidate[]> => {
  const contract = getContractInstance();
  try {
    console.log('Fetching candidates from contract...');
    const count = await contract.read.getCandidateCount();
    const candidates: Candidate[] = [];
    
    for(let i = 0; i < Number(count); i++) {
      const candidate = await contract.read.getCandidate([BigInt(i)]);
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
  const contract = getContractInstance();
  try {
    console.log('Fetching election status from contract...');
    const status = await contract.read.getElectionStatus();
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

// Approve voter function
export const approveVoter = async (voterAddress: string): Promise<void> => {
  const contract = getContractInstance();
  try {
    console.log('Approving voter:', voterAddress);
    const [account] = await walletClient.requestAddresses();
    const hash = await contract.write.approveVoter([voterAddress], {
      account,
    });
    console.log('Voter approved successfully, transaction hash:', hash);
  } catch (error) {
    console.error('Error approving voter:', error);
    throw error;
  }
};

// Cast vote function
export const castVote = async (candidateId: number): Promise<void> => {
  const contract = getContractInstance();
  try {
    console.log('Casting vote for candidate:', candidateId);
    const [account] = await walletClient.requestAddresses();
    const hash = await contract.write.vote([BigInt(candidateId)], {
      account,
    });
    console.log('Vote cast successfully, transaction hash:', hash);
  } catch (error) {
    console.error('Error casting vote:', error);
    throw error;
  }
};

// Start election function
export const startElection = async (durationInMinutes: number): Promise<void> => {
  const contract = getContractInstance();
  try {
    console.log('Starting election with duration:', durationInMinutes);
    const [account] = await walletClient.requestAddresses();
    const hash = await contract.write.startElection([BigInt(durationInMinutes)], {
      account,
    });
    console.log('Election started successfully, transaction hash:', hash);
  } catch (error) {
    console.error('Error starting election:', error);
    throw error;
  }
};