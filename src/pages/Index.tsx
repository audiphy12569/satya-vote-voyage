import { useAccount } from 'wagmi';
import { Web3Button } from '@web3modal/react';
import AdminPortal from '@/components/AdminPortal';

// This should be replaced with your actual admin address
const ADMIN_ADDRESS = "0x0000000000000000000000000000000000000000";

const Index = () => {
  const { address, isConnected } = useAccount();
  
  const isAdmin = address?.toLowerCase() === ADMIN_ADDRESS.toLowerCase();

  if (!isConnected) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <h1 className="text-4xl font-bold mb-8">Welcome to Satya Vote</h1>
        <p className="text-lg mb-8 text-center max-w-2xl">
          Connect your wallet to access the voting platform
        </p>
        <Web3Button />
      </div>
    );
  }

  if (isAdmin) {
    return <AdminPortal />;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <h1 className="text-4xl font-bold mb-8">Voter Dashboard</h1>
      <p className="text-lg mb-8 text-center max-w-2xl">
        Welcome to the voter dashboard. Elections will appear here when they are active.
      </p>
    </div>
  );
};

export default Index;