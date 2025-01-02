import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { startElection, getElectionStatus, getCandidates } from '@/utils/contractUtils';
import ElectionResults from './ElectionResults';

interface ElectionControlProps {
  electionActive: boolean;
  candidateCount?: number;
}

const ElectionControl = ({ electionActive, candidateCount = 0 }: ElectionControlProps) => {
  const { toast } = useToast();
  const [duration, setDuration] = useState('60');
  const [hasEnded, setHasEnded] = useState(false);
  const [endTime, setEndTime] = useState<bigint>(BigInt(0));
  const [totalVotes, setTotalVotes] = useState<bigint>(BigInt(0));
  const [candidates, setCandidates] = useState<any[]>([]);
  const [showDurationInput, setShowDurationInput] = useState(false);

  useEffect(() => {
    const checkElectionStatus = async () => {
      try {
        const status = await getElectionStatus();
        const currentTime = BigInt(Math.floor(Date.now() / 1000));
        setEndTime(status.endTime);
        setTotalVotes(status.totalVotes);
        const isEnded = status.endTime > BigInt(0) && currentTime >= status.endTime;
        
        if (isEnded && !hasEnded) {
          const candidatesList = await getCandidates();
          setCandidates(candidatesList);
        }
        
        setHasEnded(isEnded);
      } catch (error) {
        console.error('Error checking election status:', error);
      }
    };

    const interval = setInterval(checkElectionStatus, 1000);
    return () => clearInterval(interval);
  }, [hasEnded]);

  const handleStartElection = async () => {
    if (candidateCount < 2) {
      toast({
        title: "Error",
        description: "At least 2 candidates are required to start the election",
        variant: "destructive"
      });
      return;
    }

    const durationMinutes = parseInt(duration);
    if (isNaN(durationMinutes) || durationMinutes <= 0) {
      toast({
        title: "Error",
        description: "Please enter a valid duration in minutes",
        variant: "destructive"
      });
      return;
    }

    try {
      await startElection(durationMinutes);
      toast({
        title: "Success",
        description: `Election started successfully. Duration: ${durationMinutes} minutes`,
      });
      setHasEnded(false);
      setCandidates([]);
      setShowDurationInput(false);
    } catch (error) {
      console.error('Error starting election:', error);
      toast({
        title: "Error",
        description: "Failed to start election. Please try again.",
        variant: "destructive"
      });
    }
  };

  const getElectionStatusText = () => {
    if (!electionActive) return "Inactive";
    if (hasEnded) return "Ended";
    return "Active";
  };

  const getRemainingTime = () => {
    if (!electionActive || hasEnded) return null;
    const currentTime = BigInt(Math.floor(Date.now() / 1000));
    const remaining = Number(endTime - currentTime);
    if (remaining <= 0) return "Ending...";
    
    const minutes = Math.floor(remaining / 60);
    const seconds = remaining % 60;
    return `${minutes}m ${seconds}s remaining`;
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Election Management</CardTitle>
          <CardDescription>Control the election process</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-secondary rounded-lg">
              <div>
                <h3 className="font-semibold">Election Status</h3>
                <p className="text-sm text-muted-foreground">
                  {getElectionStatusText()}
                  {getRemainingTime() && (
                    <span className="ml-2 text-xs">({getRemainingTime()})</span>
                  )}
                </p>
              </div>
              {!electionActive && !hasEnded && !showDurationInput && (
                <Button
                  onClick={() => setShowDurationInput(true)}
                  disabled={candidateCount < 2}
                >
                  Start New Election
                </Button>
              )}
              {showDurationInput && (
                <div className="flex items-center gap-4">
                  <div className="w-32">
                    <Label htmlFor="duration">Duration (minutes)</Label>
                    <Input
                      id="duration"
                      type="number"
                      min="1"
                      value={duration}
                      onChange={(e) => setDuration(e.target.value)}
                      placeholder="60"
                    />
                  </div>
                  <div className="flex gap-2 mt-6">
                    <Button
                      onClick={handleStartElection}
                      disabled={candidateCount < 2}
                    >
                      Confirm Start
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setShowDurationInput(false)}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              )}
              {electionActive && !hasEnded && (
                <Button
                  variant="destructive"
                  onClick={() => {
                    toast({
                      title: "Coming soon",
                      description: "This feature is under development",
                    });
                  }}
                >
                  End Election
                </Button>
              )}
              {hasEnded && !showDurationInput && (
                <Button
                  onClick={() => setShowDurationInput(true)}
                  disabled={candidateCount < 2}
                >
                  Start New Election
                </Button>
              )}
            </div>
            {!electionActive && !hasEnded && candidateCount < 2 && (
              <p className="text-sm text-muted-foreground">
                Note: At least 2 candidates are required to start the election. Current count: {candidateCount}
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {hasEnded && candidates.length > 0 && (
        <ElectionResults candidates={candidates} totalVotes={totalVotes} />
      )}
    </div>
  );
};

export default ElectionControl;