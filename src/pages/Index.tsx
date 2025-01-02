import { useEffect, useState } from 'react';
import { useAccount } from 'wagmi';
import { Web3Button } from '@web3modal/react';
import AdminPortal from '@/components/AdminPortal';
import VoterPanel from '@/components/VoterPanel';
import Navbar from '@/components/Navbar';
import { getAdminAddress } from '@/utils/contractUtils';

const Index = () => {
  const { address, isConnected } = useAccount();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAdminStatus = async () => {
      if (address) {
        const adminAddress = await getAdminAddress();
        const isAdminUser = adminAddress?.toLowerCase() === address.toLowerCase();
        setIsAdmin(isAdminUser);
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

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="container mx-auto py-6">
        {isAdmin ? <AdminPortal /> : <VoterPanel />}
      </main>
      <footer className="bg-[#1e3a8a] text-white py-4 text-center mt-auto">
        <p className="text-sm">© 2024 Satya Vote. Secure and Transparent Voting System</p>
      </footer>
    </div>
  );
};

export default Index;