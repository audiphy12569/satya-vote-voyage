import { useEffect, useState } from 'react';
import { useAccount } from 'wagmi';
import { Web3Button } from '@web3modal/react';
import AdminPortal from '@/components/AdminPortal';
import VoterPanel from '@/components/VoterPanel';
import { getAdminAddress } from '@/utils/contractUtils';

const Index = () => {
  const { address, isConnected } = useAccount();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAdminStatus = async () => {
      if (address) {
        const adminAddress = await getAdminAddress();
        setIsAdmin(adminAddress?.toLowerCase() === address.toLowerCase());
      }
      setLoading(false);
    };

    checkAdminStatus();
  }, [address]);

  if (!isConnected) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-b from-blue-50 to-white">
        <h1 className="text-5xl font-bold mb-8 text-primary">Welcome to Satya Vote</h1>
        <p className="text-xl mb-12 text-center max-w-2xl text-muted-foreground">
          A secure and transparent voting platform on the Sepolia blockchain
        </p>
        <Web3Button />
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return isAdmin ? <AdminPortal /> : <VoterPanel />;
};

export default Index;