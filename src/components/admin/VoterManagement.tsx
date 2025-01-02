import { useState } from 'react';
import { UserPlus } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { approveVoter, getVoters } from '@/utils/contractUtils';

interface VoterManagementProps {
  voters: string[];
  setVoters: (voters: string[]) => void;
}

const VoterManagement = ({ voters, setVoters }: VoterManagementProps) => {
  const { toast } = useToast();
  const [newVoterAddress, setNewVoterAddress] = useState('');

  const handleAddVoter = async () => {
    if (!newVoterAddress) {
      toast({
        title: "Error",
        description: "Please enter a valid address",
        variant: "destructive"
      });
      return;
    }

    try {
      await approveVoter(newVoterAddress);
      toast({
        title: "Success",
        description: "Voter added successfully",
      });
      setNewVoterAddress('');
      // Refresh the voters list
      const updatedVoters = await getVoters();
      setVoters(updatedVoters);
    } catch (error) {
      console.error('Error adding voter:', error);
      toast({
        title: "Error",
        description: "Failed to add voter. Please check the address and try again.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Add New Voter</CardTitle>
          <CardDescription>Enter the wallet address of the voter you want to add</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4">
            <div className="flex-1">
              <Label htmlFor="voterAddress">Voter Address</Label>
              <Input
                id="voterAddress"
                placeholder="0x..."
                value={newVoterAddress}
                onChange={(e) => setNewVoterAddress(e.target.value)}
              />
            </div>
            <Button 
              onClick={handleAddVoter}
              className="mt-8"
            >
              <UserPlus className="w-4 h-4 mr-2" />
              Add Voter
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Registered Voters</CardTitle>
          <CardDescription>List of all registered voters</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {voters.map((voter, index) => (
              <div key={index} className="p-4 bg-secondary rounded-lg flex items-center justify-between">
                <span className="font-mono">{voter}</span>
                <span className="text-sm text-muted-foreground">Registered</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default VoterManagement;