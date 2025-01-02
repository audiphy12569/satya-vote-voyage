import { publicClient } from './contractUtils';
import { CONTRACT_ADDRESS } from '@/config/web3Config';
import { abi } from './contractAbi';
import type { ElectionStatus, Candidate, CandidateResponse, ElectionStatusResponse } from './types';
import { sepolia } from 'viem/chains';
import { getWalletClient } from './walletUtils';

export const getAdminAddress = async (): Promise<string | undefined> => {
  try {
    console.log('Fetching admin address from contract...');
    const data = await publicClient.readContract({
      address: CONTRACT_ADDRESS as `0x${string}`,
      abi,
      functionName: 'admin',
      chain: sepolia
    }) as string;
    
    console.log('Admin address fetched:', data);
    return data;
  } catch (error) {
    console.error('Error fetching admin address:', error);
    return undefined;
  }
};

export const getVoters = async (): Promise<string[]> => {
  try {
    console.log('Fetching approved voters from contract...');
    const walletClient = await getWalletClient();
    const account = await walletClient.getAddresses();
    
    // First try to get the voter count
    const voterCount = await publicClient.readContract({
      address: CONTRACT_ADDRESS as `0x${string}`,
      abi,
      functionName: 'getVoterCount',
      chain: sepolia,
      account: account[0]
    }) as bigint;

    console.log('Voter count:', voterCount);

    // Then get each voter individually
    const voters: string[] = [];
    for (let i = 0; i < Number(voterCount); i++) {
      try {
        const voter = await publicClient.readContract({
          address: CONTRACT_ADDRESS as `0x${string}`,
          abi,
          functionName: 'voters',
          args: [BigInt(i)],
          chain: sepolia,
          account: account[0]
        }) as string;
        
        if (voter && voter !== '0x0000000000000000000000000000000000000000') {
          voters.push(voter);
        }
      } catch (error) {
        console.error(`Error fetching voter at index ${i}:`, error);
      }
    }
    
    console.log('Voters fetched successfully:', voters);
    return voters;
  } catch (error) {
    console.error('Error fetching voters:', error);
    return [];
  }
};

export const getCandidates = async (): Promise<Candidate[]> => {
  try {
    console.log('Fetching candidates from contract...');
    const walletClient = await getWalletClient();
    const account = await walletClient.getAddresses();
    
    const count = await publicClient.readContract({
      address: CONTRACT_ADDRESS as `0x${string}`,
      abi,
      functionName: 'getCandidateCount',
      chain: sepolia,
      account: account[0]
    }) as bigint;
    
    const candidates: Candidate[] = [];
    
    for(let i = 0; i < Number(count); i++) {
      const candidate = await publicClient.readContract({
        address: CONTRACT_ADDRESS as `0x${string}`,
        abi,
        functionName: 'getCandidate',
        args: [BigInt(i)],
        chain: sepolia,
        account: account[0]
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

export const getElectionStatus = async (): Promise<ElectionStatus> => {
  try {
    console.log('Fetching election status from contract...');
    const walletClient = await getWalletClient();
    const account = await walletClient.getAddresses();
    
    const status = await publicClient.readContract({
      address: CONTRACT_ADDRESS as `0x${string}`,
      abi,
      functionName: 'getElectionStatus',
      chain: sepolia,
      account: account[0]
    }) as ElectionStatusResponse;
    
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