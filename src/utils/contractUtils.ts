import { createPublicClient, http } from 'viem';
import { sepolia } from 'viem/chains';

export const publicClient = createPublicClient({
  chain: sepolia,
  transport: http()
});

// Re-export all contract functions
export * from './contractRead';
export * from './contractWrite';