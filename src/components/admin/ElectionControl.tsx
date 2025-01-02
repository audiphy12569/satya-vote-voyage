import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { startElection } from '@/utils/contractWrite';

interface ElectionControlProps {
  electionActive: boolean;
  candidateCount?: number;
}

const ElectionControl = ({ electionActive, candidateCount = 0 }: ElectionControlProps) => {
  const { toast } = useToast();
  const [duration, setDuration] = useState('60');

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
    } catch (error) {
      console.error('Error starting election:', error);
      toast({
        title: "Error",
        description: "Failed to start election. Please try again.",
        variant: "destructive"
      });
    }
  };

  return (
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
                {electionActive ? "Active" : "Inactive"}
              </p>
            </div>
            {!electionActive && (
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
                <Button
                  onClick={handleStartElection}
                  disabled={candidateCount < 2}
                  className="mt-6"
                >
                  Start Election
                </Button>
              </div>
            )}
            {electionActive && (
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
          </div>
          {!electionActive && candidateCount < 2 && (
            <p className="text-sm text-muted-foreground">
              Note: At least 2 candidates are required to start the election. Current count: {candidateCount}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ElectionControl;