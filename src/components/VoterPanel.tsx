import { useEffect, useState } from 'react';
import { useAccount } from 'wagmi';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { getCandidates, getElectionStatus } from '@/utils/contractUtils';
import { Vote, History, Timer } from "lucide-react";
import { castVote } from '@/utils/contractWrite';

const VoterPanel = () => {
  const { toast } = useToast();
  const { address } = useAccount();
  const [candidates, setCandidates] = useState<any[]>([]);
  const [electionActive, setElectionActive] = useState(false);
  const [loading, setLoading] = useState(true);
  const [votingHistory, setVotingHistory] = useState<any[]>([]);
  const [remainingTime, setRemainingTime] = useState<string>('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [candidatesList, status] = await Promise.all([
          getCandidates(),
          getElectionStatus()
        ]);
        console.log('Fetched candidates:', candidatesList); // Debug log
        setCandidates(candidatesList);
        setElectionActive(status.isActive);
        
        // Calculate remaining time if election is active
        if (status.isActive) {
          const endTime = Number(status.endTime) * 1000; // Convert to milliseconds
          const now = Date.now();
          const remaining = endTime - now;
          
          if (remaining > 0) {
            const minutes = Math.floor(remaining / (1000 * 60));
            const seconds = Math.floor((remaining % (1000 * 60)) / 1000);
            setRemainingTime(`${minutes}m ${seconds}s`);
          }
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        toast({
          title: "Error",
          description: "Failed to fetch data from the contract",
          variant: "destructive"
        });
        setLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 30000); // Refresh every 30 seconds

    return () => clearInterval(interval);
  }, [toast]);

  const handleVote = async (candidateId: number) => {
    try {
      await castVote(candidateId);
      toast({
        title: "Success",
        description: "Vote cast successfully",
      });
      
      // Refresh candidates list after voting
      const updatedCandidates = await getCandidates();
      setCandidates(updatedCandidates);
    } catch (error) {
      console.error('Error casting vote:', error);
      toast({
        title: "Error",
        description: "Failed to cast vote. Please try again.",
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto p-6 space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-4xl font-bold text-primary">Voter Dashboard</h1>
        <div className="px-4 py-2 bg-secondary rounded-lg">
          <span className="text-sm font-medium">Connected: {address?.slice(0, 6)}...{address?.slice(-4)}</span>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Timer className="w-5 h-5" />
            Election Status
          </CardTitle>
          <CardDescription>
            {electionActive 
              ? `Election is currently active. Time remaining: ${remainingTime}`
              : "No active election at the moment."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className={`p-4 rounded-lg ${electionActive ? 'bg-green-100' : 'bg-yellow-100'}`}>
            <p className="text-sm font-medium">
              {electionActive ? "🗳️ Voting is open" : "⏳ Waiting for next election"}
            </p>
          </div>
        </CardContent>
      </Card>

      {electionActive && candidates.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Vote className="w-5 h-5" />
              Cast Your Vote
            </CardTitle>
            <CardDescription>Select a candidate to cast your vote</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {candidates.map((candidate, index) => (
                <Card key={candidate.id.toString()} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="text-lg">{candidate.name}</CardTitle>
                    <CardDescription>{candidate.party}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground">{candidate.tagline}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">
                        Votes: {Number(candidate.voteCount)}
                      </span>
                      <Button 
                        onClick={() => handleVote(Number(candidate.id))}
                        className="w-32"
                      >
                        Vote
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <History className="w-5 h-5" />
            Voting History
          </CardTitle>
          <CardDescription>Your past voting records</CardDescription>
        </CardHeader>
        <CardContent>
          {votingHistory.length > 0 ? (
            <div className="space-y-4">
              {votingHistory.map((vote, index) => (
                <div key={index} className="p-4 bg-secondary rounded-lg">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">{vote.candidateName}</p>
                      <p className="text-sm text-muted-foreground">{vote.timestamp}</p>
                    </div>
                    <a
                      href={`https://sepolia.etherscan.io/tx/${vote.transactionHash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:text-blue-600"
                    >
                      View on Etherscan
                    </a>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              No voting history available
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default VoterPanel;