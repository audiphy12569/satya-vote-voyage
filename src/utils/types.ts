// Define types for our contract responses
export interface ElectionStatus {
  isActive: boolean;
  startTime: bigint;
  endTime: bigint;
  totalVotes: bigint;
}

export interface Candidate {
  name: string;
  party: string;
  tagline: string;
  logoIPFS: string;
  voteCount: bigint;
}