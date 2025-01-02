import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useWeb3Modal } from '@web3modal/react';
import { useAccount } from 'wagmi';
import { LucideVote } from "lucide-react";

const Index = () => {
  const { open } = useWeb3Modal();
  const { isConnected, address } = useAccount();

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold text-blue-900 mb-4">Satya Vote</h1>
          <p className="text-lg text-blue-600">Secure and Transparent Voting Platform</p>
        </header>

        <div className="max-w-4xl mx-auto">
          {!isConnected ? (
            <Card className="p-8 text-center bg-white shadow-lg rounded-xl">
              <LucideVote className="w-16 h-16 mx-auto mb-6 text-blue-500" />
              <h2 className="text-2xl font-semibold mb-4 text-gray-800">Welcome to Satya Vote</h2>
              <p className="text-gray-600 mb-6">
                Connect your wallet to participate in secure and transparent voting.
              </p>
              <Button 
                onClick={() => open()}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-2 rounded-lg"
              >
                Connect Wallet
              </Button>
            </Card>
          ) : (
            <div className="space-y-6">
              <Card className="p-6 bg-white shadow-lg rounded-xl">
                <h2 className="text-xl font-semibold mb-4 text-gray-800">Connected Wallet</h2>
                <p className="text-gray-600 break-all">{address}</p>
              </Card>
              
              <Card className="p-6 bg-white shadow-lg rounded-xl">
                <h2 className="text-xl font-semibold mb-4 text-gray-800">Active Elections</h2>
                <p className="text-gray-600">No active elections at the moment.</p>
              </Card>

              <Card className="p-6 bg-white shadow-lg rounded-xl">
                <h2 className="text-xl font-semibold mb-4 text-gray-800">Voting History</h2>
                <p className="text-gray-600">Your voting history will appear here.</p>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Index;