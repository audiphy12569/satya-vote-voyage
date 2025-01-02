import { useEffect, useState } from 'react';
import { useAccount, useDisconnect } from 'wagmi';
import { Web3Button } from '@web3modal/react';
import AdminPortal from '@/components/AdminPortal';
import VoterPanel from '@/components/VoterPanel';
import { getAdminAddress } from '@/utils/contractUtils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';

const Index = () => {
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAdminStatus = async () => {
      if (address) {
        const adminAddress = await getAdminAddress();
        console.log('Connected address:', address);
        console.log('Admin address from contract:', adminAddress);
        
        // Convert both addresses to lowercase for comparison
        const isAdminUser = adminAddress?.toLowerCase() === address.toLowerCase();
        console.log('Is admin?', isAdminUser);
        
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

  const truncateAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  return (
    <div>
      <div className="absolute top-4 right-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">
              {address && truncateAddress(address)}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => disconnect()}>
              <LogOut className="mr-2 h-4 w-4" />
              Disconnect
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      {isAdmin ? <AdminPortal /> : <VoterPanel />}
    </div>
  );
};

export default Index;