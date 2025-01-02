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

export type CandidateResponse = [string, string, string, string, bigint];
export type ElectionStatusResponse = [boolean, bigint, bigint, bigint];