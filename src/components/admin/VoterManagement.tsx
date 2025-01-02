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
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAddVoter = async () => {
    if (!newVoterAddress) {
      toast({
        title: "Error",
        description: "Please enter a valid address",
        variant: "destructive"
      });
      return;
    }

    // Check if address is valid Ethereum address
    if (!/^0x[a-fA-F0-9]{40}$/.test(newVoterAddress)) {
      toast({
        title: "Error",
        description: "Please enter a valid Ethereum address",
        variant: "destructive"
      });
      return;
    }

    // Check if voter is already registered
    if (voters.includes(newVoterAddress.toLowerCase())) {
      toast({
        title: "Error",
        description: "This voter is already registered",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    try {
      await approveVoter(newVoterAddress);
      toast({
        title: "Success",
        description: "Voter added successfully",
      });
      setNewVoterAddress('');
      
      // Refresh the voters list
      const updatedVoters = await getVoters();
      console.log('Updated voters list:', updatedVoters);
      setVoters(updatedVoters);
    } catch (error) {
      console.error('Error adding voter:', error);
      toast({
        title: "Error",
        description: "Failed to add voter. Please check the address and try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
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
                disabled={isSubmitting}
              />
            </div>
            <Button 
              onClick={handleAddVoter}
              className="mt-8"
              disabled={isSubmitting}
            >
              <UserPlus className="w-4 h-4 mr-2" />
              {isSubmitting ? "Adding..." : "Add Voter"}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Registered Voters ({voters.length})</CardTitle>
          <CardDescription>List of all registered voters</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {voters.length === 0 ? (
              <div className="text-center py-4 text-muted-foreground">
                No voters registered yet
              </div>
            ) : (
              voters.map((voter, index) => (
                <div 
                  key={voter} 
                  className="p-4 bg-secondary rounded-lg flex items-center justify-between hover:bg-secondary/80 transition-colors"
                >
                  <span className="font-mono">{voter}</span>
                  <span className="text-sm text-muted-foreground">Registered</span>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default VoterManagement;