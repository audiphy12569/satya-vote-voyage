import { publicClient } from './contractUtils';
import { CONTRACT_ADDRESS } from '@/config/web3Config';
import { abi } from './contractAbi';
import type { ElectionStatus, Candidate, CandidateResponse, ElectionStatusResponse } from './types';
import { getWalletClient } from './walletUtils';

// Store the deployment block number to optimize log fetching
const RECENT_BLOCKS = 10000n; // Look back 10,000 blocks by default

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

export const getVoters = async (): Promise<string[]> => {
  try {
    console.log('Fetching approved voters from contract...');
    
    // Get the latest block and calculate fromBlock
    const latestBlock = await publicClient.getBlockNumber();
    const fromBlock = latestBlock - RECENT_BLOCKS;
    
    console.log('Fetching logs from block:', fromBlock.toString(), 'to latest:', latestBlock.toString());
    
    // Get VoterApproved events
    const logs = await publicClient.getLogs({
      address: CONTRACT_ADDRESS as `0x${string}`,
      event: {
        type: 'event',
        name: 'VoterApproved',
        inputs: [{ type: 'address', name: 'voter', indexed: false }],
      },
      fromBlock,
      toBlock: latestBlock
    });

    // Extract unique voter addresses from the events and convert to lowercase
    const voters = [...new Set(logs.map(log => 
      (log.args.voter as string).toLowerCase()
    ))];

    console.log('Found voters from events:', voters);

    // Verify each voter is still approved
    const approvedVoters = await Promise.all(
      voters.map(async (voter) => {
        try {
          const isApproved = await publicClient.readContract({
            address: CONTRACT_ADDRESS as `0x${string}`,
            abi,
            functionName: 'approvedVoters',
            args: [voter as `0x${string}`]
          }) as boolean;
          return isApproved ? voter : null;
        } catch (error) {
          console.error(`Error checking voter ${voter} status:`, error);
          return null;
        }
      })
    );

    // Filter out null values and ensure unique addresses
    const currentVoters = [...new Set(approvedVoters.filter((voter): voter is string => voter !== null))];
    console.log('Currently approved voters:', currentVoters);
    return currentVoters;
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
      account: account[0]
    }) as bigint;
    
    const candidates: Candidate[] = [];
    
    for(let i = 0; i < Number(count); i++) {
      const candidate = await publicClient.readContract({
        address: CONTRACT_ADDRESS as `0x${string}`,
        abi,
        functionName: 'getCandidate',
        args: [BigInt(i + 1)],
        account: account[0]
      }) as CandidateResponse;
      
      candidates.push({
        id: BigInt(i + 1),
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