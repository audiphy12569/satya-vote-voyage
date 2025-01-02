import { publicClient } from './contractUtils';
import { CONTRACT_ADDRESS } from '@/config/web3Config';
import { abi } from './contractAbi';
import type { ElectionStatus, Candidate, CandidateResponse, ElectionStatusResponse } from './types';
import { sepolia } from 'viem/chains';
import { getWalletClient } from './walletUtils';

// Store the deployment block number to optimize log fetching
const DEPLOYMENT_BLOCK = 4795000n; // Replace with your contract deployment block

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
    
    // First try to get the latest block for better performance
    const latestBlock = await publicClient.getBlockNumber();
    const fromBlock = latestBlock - 10000n > DEPLOYMENT_BLOCK ? latestBlock - 10000n : DEPLOYMENT_BLOCK;
    
    console.log('Fetching logs from block:', fromBlock.toString());
    
    // Get VoterApproved events with pagination
    const logs = await publicClient.getLogs({
      address: CONTRACT_ADDRESS as `0x${string}`,
      event: {
        type: 'event',
        name: 'VoterApproved',
        inputs: [{ type: 'address', name: 'voter', indexed: false }],
      },
      fromBlock: fromBlock,
      toBlock: 'latest'
    });

    // Extract unique voter addresses from the events
    const voters = [...new Set(logs.map(log => 
      log.args.voter as string
    ))];

    console.log('Found voters from events:', voters);

    // Verify each voter is still approved by calling approvedVoters mapping
    const approvedVoters = await Promise.all(
      voters.map(async (voter) => {
        try {
          const isApproved = await publicClient.readContract({
            address: CONTRACT_ADDRESS as `0x${string}`,
            abi,
            functionName: 'approvedVoters',
            args: [voter],
            chain: sepolia
          }) as boolean;
          return isApproved ? voter : null;
        } catch (error) {
          console.error(`Error checking voter ${voter} status:`, error);
          return null;
        }
      })
    );

    // Filter out null values and return only currently approved voters
    const currentVoters = approvedVoters.filter((voter): voter is string => voter !== null);
    
    console.log('Currently approved voters:', currentVoters);
    return currentVoters;
  } catch (error) {
    console.error('Error fetching voters:', error);
    
    // Fallback: try direct contract call if logs fail
    try {
      console.log('Attempting fallback method to fetch voters...');
      const voter = await publicClient.readContract({
        address: CONTRACT_ADDRESS as `0x${string}`,
        abi,
        functionName: 'approvedVoters',
        args: [CONTRACT_ADDRESS],
        chain: sepolia
      });
      console.log('Fallback method result:', voter);
    } catch (fallbackError) {
      console.error('Fallback method also failed:', fallbackError);
    }
    
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
        args: [BigInt(i + 1)], // Adding 1 because candidate IDs start from 1
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