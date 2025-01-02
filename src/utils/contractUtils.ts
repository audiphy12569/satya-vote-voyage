import { createPublicClient, http, getContract } from 'viem';
import { sepolia } from 'viem/chains';
import { abi } from './contractAbi';

// Fallback contract address for development
const FALLBACK_CONTRACT_ADDRESS = "0x0000000000000000000000000000000000000000";

// Get contract address from environment variable
export const CONTRACT_ADDRESS = import.meta.env.VITE_CONTRACT_ADDRESS || FALLBACK_CONTRACT_ADDRESS;

// Create public client for read operations
export const publicClient = createPublicClient({
  chain: sepolia,
  transport: http()
});

// Create contract instance
export const getContractInstance = () => {
  console.log('Creating contract instance with address:', CONTRACT_ADDRESS);
  return getContract({
    address: CONTRACT_ADDRESS as `0x${string}`,
    abi,
    publicClient,
  });
};

// Fetch admin address from contract
export const getAdminAddress = async () => {
  const contract = getContractInstance();
  try {
    console.log('Fetching admin address from contract...');
    const admin = await contract.read.admin();
    console.log('Admin address fetched:', admin);
    return admin;
  } catch (error) {
    console.error('Error fetching admin address:', error);
    return null;
  }
};

// Fetch all candidates
export const getCandidates = async () => {
  const contract = getContractInstance();
  try {
    console.log('Fetching candidates from contract...');
    const count = await contract.read.getCandidateCount();
    const candidates = [];
    
    for(let i = 0; i < Number(count); i++) {
      const candidate = await contract.read.getCandidate([BigInt(i)]);
      candidates.push({
        id: i,
        name: candidate[0],
        party: candidate[1],
        tagline: candidate[2],
        logoIPFS: candidate[3],
        voteCount: Number(candidate[4])
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
export const getElectionStatus = async () => {
  const contract = getContractInstance();
  try {
    console.log('Fetching election status from contract...');
    const status = await contract.read.getElectionStatus();
    console.log('Election status fetched:', status);
    return status.isActive;
  } catch (error) {
    console.error('Error fetching election status:', error);
    return false;
  }
};

// Add voter function
export const addVoter = async (voterAddress: string) => {
  const contract = getContractInstance();
  try {
    console.log('Adding voter:', voterAddress);
    const tx = await contract.write.approveVoter([voterAddress]);
    console.log('Voter added successfully:', tx);
    return tx;
  } catch (error) {
    console.error('Error adding voter:', error);
    throw error;
  }
};

// Cast vote function
export const castVote = async (candidateId: number) => {
  const contract = getContractInstance();
  try {
    console.log('Casting vote for candidate:', candidateId);
    const tx = await contract.write.vote([BigInt(candidateId)]);
    console.log('Vote cast successfully:', tx);
    return tx;
  } catch (error) {
    console.error('Error casting vote:', error);
    throw error;
  }
};

// Start election function
export const startElection = async (durationInMinutes: number) => {
  const contract = getContractInstance();
  try {
    console.log('Starting election with duration:', durationInMinutes);
    const tx = await contract.write.startElection([BigInt(durationInMinutes)]);
    console.log('Election started successfully:', tx);
    return tx;
  } catch (error) {
    console.error('Error starting election:', error);
    throw error;
  }
};