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
    const admin = await contract.read.owner();
    console.log('Admin address fetched:', admin);
    return admin;
  } catch (error) {
    console.error('Error fetching admin address:', error);
    return null;
  }
};

// Fetch all voters
export const getVoters = async () => {
  const contract = getContractInstance();
  try {
    console.log('Fetching voters from contract...');
    const voters = await contract.read.getAllVoters();
    console.log('Voters fetched:', voters);
    return voters;
  } catch (error) {
    console.error('Error fetching voters:', error);
    return [];
  }
};

// Fetch all candidates
export const getCandidates = async () => {
  const contract = getContractInstance();
  try {
    console.log('Fetching candidates from contract...');
    const candidates = await contract.read.getAllCandidates();
    console.log('Candidates fetched:', candidates);
    return candidates.map((candidate: any, index: number) => ({
      id: index,
      name: candidate[1],
      party: candidate[2],
      tagline: candidate[3]
    }));
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
    const status = await contract.read.electionStatus();
    console.log('Election status fetched:', status);
    return status;
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
    const tx = await contract.write.addVoter([voterAddress]);
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
    const tx = await contract.write.vote([candidateId]);
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
    const tx = await contract.write.startElection([durationInMinutes]);
    console.log('Election started successfully:', tx);
    return tx;
  } catch (error) {
    console.error('Error starting election:', error);
    throw error;
  }
};

// End election function
export const endElection = async () => {
  const contract = getContractInstance();
  try {
    console.log('Ending election...');
    const tx = await contract.write.endElection();
    console.log('Election ended successfully:', tx);
    return tx;
  } catch (error) {
    console.error('Error ending election:', error);
    throw error;
  }
};