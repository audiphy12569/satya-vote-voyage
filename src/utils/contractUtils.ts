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
    const admin = await contract.read.owner();
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
    const voters = await contract.read.getAllVoters();
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
    const candidates = await contract.read.getAllCandidates();
    return candidates.map((candidate, index) => ({
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
    const status = await contract.read.electionStatus();
    return status;
  } catch (error) {
    console.error('Error fetching election status:', error);
    return false;
  }
};