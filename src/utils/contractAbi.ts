// Split ABI into smaller parts for better maintainability
const adminFunctions = [
  {
    "inputs": [],
    "name": "admin",
    "outputs": [{ "internalType": "address", "name": "", "type": "address" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "address", "name": "_voter", "type": "address" }],
    "name": "approveVoter",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "address", "name": "", "type": "address" }],
    "name": "approvedVoters",
    "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }],
    "stateMutability": "view",
    "type": "function"
  }
] as const;

const candidateFunctions = [
  {
    "inputs": [
      { "internalType": "string", "name": "_name", "type": "string" },
      { "internalType": "string", "name": "_party", "type": "string" },
      { "internalType": "string", "name": "_tagline", "type": "string" },
      { "internalType": "string", "name": "_logoIPFS", "type": "string" }
    ],
    "name": "addCandidate",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "uint256", "name": "_id", "type": "uint256" }],
    "name": "removeCandidate",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getCandidateCount",
    "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "uint256", "name": "_id", "type": "uint256" }],
    "name": "getCandidate",
    "outputs": [
      { "internalType": "string", "name": "name", "type": "string" },
      { "internalType": "string", "name": "party", "type": "string" },
      { "internalType": "string", "name": "tagline", "type": "string" },
      { "internalType": "string", "name": "logoIPFS", "type": "string" },
      { "internalType": "uint256", "name": "voteCount", "type": "uint256" }
    ],
    "stateMutability": "view",
    "type": "function"
  }
] as const;

const electionFunctions = [
  {
    "inputs": [{ "internalType": "uint256", "name": "_durationInMinutes", "type": "uint256" }],
    "name": "startElection",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getElectionStatus",
    "outputs": [
      { "internalType": "bool", "name": "isActive", "type": "bool" },
      { "internalType": "uint256", "name": "startTime", "type": "uint256" },
      { "internalType": "uint256", "name": "endTime", "type": "uint256" },
      { "internalType": "uint256", "name": "totalVotes", "type": "uint256" }
    ],
    "stateMutability": "view",
    "type": "function"
  }
] as const;

const votingFunctions = [
  {
    "inputs": [{ "internalType": "uint256", "name": "_candidateId", "type": "uint256" }],
    "name": "vote",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "address", "name": "_voter", "type": "address" }],
    "name": "hasVoted",
    "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }],
    "stateMutability": "view",
    "type": "function"
  }
] as const;

const events = [
  {
    "type": "event",
    "name": "VoterApproved",
    "inputs": [{ "type": "address", "name": "voter", "indexed": false }]
  },
  {
    "type": "event",
    "name": "CandidateAdded",
    "inputs": [
      { "type": "uint256", "name": "id", "indexed": false },
      { "type": "string", "name": "name", "indexed": false },
      { "type": "string", "name": "party", "indexed": false }
    ]
  },
  {
    "type": "event",
    "name": "ElectionStarted",
    "inputs": [
      { "type": "uint256", "name": "startTime", "indexed": false },
      { "type": "uint256", "name": "endTime", "indexed": false }
    ]
  },
  {
    "type": "event",
    "name": "VoteCast",
    "inputs": [
      { "type": "address", "name": "voter", "indexed": false },
      { "type": "uint256", "name": "candidateId", "indexed": false }
    ]
  }
] as const;

// Combine all ABI parts
export const abi = [
  ...adminFunctions,
  ...candidateFunctions,
  ...electionFunctions,
  ...votingFunctions,
  ...events
] as const;