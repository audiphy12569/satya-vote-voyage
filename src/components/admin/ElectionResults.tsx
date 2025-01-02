import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Trophy, Medal, Award } from "lucide-react";

interface ElectionResultsProps {
  candidates: Array<{
    id: bigint;
    name: string;
    party: string;
    voteCount: bigint;
  }>;
  totalVotes: bigint;
}

const ElectionResults = ({ candidates, totalVotes }: ElectionResultsProps) => {
  // Sort candidates by vote count in descending order
  const sortedCandidates = [...candidates].sort((a, b) => 
    Number(b.voteCount - a.voteCount)
  );

  const getPercentage = (votes: bigint) => {
    if (totalVotes === BigInt(0)) return 0;
    return (Number(votes) / Number(totalVotes) * 100).toFixed(1);
  };

  // Check if there's a tie for first place
  const hasWinner = sortedCandidates.length > 0 && 
    sortedCandidates[0].voteCount > BigInt(0) &&
    (sortedCandidates.length === 1 || sortedCandidates[0].voteCount > sortedCandidates[1].voteCount);

  const isTie = sortedCandidates.length > 1 && 
    sortedCandidates[0].voteCount === sortedCandidates[1].voteCount;

  const getRankIcon = (index: number, voteCount: bigint) => {
    if (voteCount === BigInt(0)) return null;
    switch(index) {
      case 0: return hasWinner ? <Trophy className="w-5 h-5 text-yellow-500" /> : null;
      case 1: return !isTie ? <Medal className="w-5 h-5 text-gray-400" /> : null;
      case 2: return !isTie ? <Award className="w-5 h-5 text-amber-600" /> : null;
      default: return null;
    }
  };

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle>Past Election Results</CardTitle>
        <CardDescription>Final vote count and rankings</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {totalVotes === BigInt(0) ? (
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-center text-muted-foreground">No votes were cast in this election</p>
            </div>
          ) : isTie ? (
            <div className="p-4 bg-yellow-50 rounded-lg mb-4">
              <p className="text-center font-medium">Election resulted in a tie!</p>
            </div>
          ) : null}
          
          {sortedCandidates.map((candidate, index) => (
            <div 
              key={candidate.name} 
              className={`p-4 rounded-lg ${hasWinner && index === 0 ? 'bg-yellow-50' : 'bg-gray-50'}`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {getRankIcon(index, candidate.voteCount)}
                  <div>
                    <p className="font-medium">{candidate.name}</p>
                    <p className="text-sm text-muted-foreground">{candidate.party}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium">{Number(candidate.voteCount)} votes</p>
                  <p className="text-sm text-muted-foreground">
                    {getPercentage(candidate.voteCount)}% of total
                  </p>
                </div>
              </div>
            </div>
          ))}
          <div className="mt-4 p-4 bg-secondary rounded-lg">
            <p className="text-sm font-medium">Total Votes Cast: {Number(totalVotes)}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ElectionResults;