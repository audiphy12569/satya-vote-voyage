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

  const getRankIcon = (index: number) => {
    switch(index) {
      case 0: return <Trophy className="w-5 h-5 text-yellow-500" />;
      case 1: return <Medal className="w-5 h-5 text-gray-400" />;
      case 2: return <Award className="w-5 h-5 text-amber-600" />;
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
          {sortedCandidates.map((candidate, index) => (
            <div 
              key={candidate.name} 
              className={`p-4 rounded-lg ${index === 0 ? 'bg-yellow-50' : 'bg-gray-50'}`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {getRankIcon(index)}
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