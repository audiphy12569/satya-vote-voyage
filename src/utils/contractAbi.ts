// This is the ABI for your deployed smart contract
export const abi = [
  {
    "inputs": [],
    "name": "owner",
    "outputs": [
      {
        "internalType": "address",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getAllVoters",
    "outputs": [
      {
        "internalType": "address[]",
        "type": "address[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getAllCandidates",
    "outputs": [
      {
        "components": [
          {
            "internalType": "uint256",
            "type": "uint256"
          },
          {
            "internalType": "string",
            "type": "string"
          },
          {
            "internalType": "string",
            "type": "string"
          },
          {
            "internalType": "string",
            "type": "string"
          }
        ],
        "internalType": "struct VotingContract.Candidate[]",
        "type": "tuple[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "electionStatus",
    "outputs": [
      {
        "internalType": "bool",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
] as const;