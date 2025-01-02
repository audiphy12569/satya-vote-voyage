import { useEffect, useState } from 'react';
import { useAccount } from 'wagmi';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { getCandidates, getElectionStatus } from '@/utils/contractUtils';
import { Vote, History, Timer } from "lucide-react";

const VoterPanel = () => {
  const { toast } = useToast();
  const { address } = useAccount();
  const [candidates, setCandidates] = useState<any[]>([]);
  const [electionActive, setElectionActive] = useState(false);
  const [loading, setLoading] = useState(true);
  const [votingHistory, setVotingHistory] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [candidatesList, status] = await Promise.all([
          getCandidates(),
          getElectionStatus()
        ]);
        setCandidates(candidatesList);
        setElectionActive(status);
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
  }, [toast]);

  const handleVote = async (candidateId: number) => {
    try {
      // Add contract interaction here
      toast({
        title: "Success",
        description: "Vote cast successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to cast vote",
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
              ? "Election is currently active. Cast your vote below."
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

      {electionActive && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Vote className="w-5 h-5" />
              Cast Your Vote
            </CardTitle>
            <CardDescription>Select a candidate to cast your vote</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              {candidates.map((candidate, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle>{candidate.name}</CardTitle>
                    <CardDescription>{candidate.party}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground">{candidate.tagline}</p>
                    <Button 
                      className="w-full"
                      onClick={() => handleVote(candidate.id)}
                    >
                      Vote for {candidate.name}
                    </Button>
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