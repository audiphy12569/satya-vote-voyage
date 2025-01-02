import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UserPlus, Award } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { addCandidate } from '@/utils/contractWrite';

interface CandidateListProps {
  candidates: any[];
}

const CandidateList = ({ candidates }: CandidateListProps) => {
  const { toast } = useToast();
  const [newCandidate, setNewCandidate] = useState({
    name: '',
    party: '',
    tagline: '',
    logoIPFS: ''
  });

  const handleAddCandidate = async () => {
    if (!newCandidate.name || !newCandidate.party || !newCandidate.tagline) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    try {
      await addCandidate(
        newCandidate.name,
        newCandidate.party,
        newCandidate.tagline,
        newCandidate.logoIPFS || ''
      );
      toast({
        title: "Success",
        description: "Candidate added successfully",
      });
      setNewCandidate({ name: '', party: '', tagline: '', logoIPFS: '' });
    } catch (error) {
      console.error('Error adding candidate:', error);
      toast({
        title: "Error",
        description: "Failed to add candidate. Please try again.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserPlus className="w-5 h-5" />
            Add New Candidate
          </CardTitle>
          <CardDescription>Enter the details of the new candidate</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4">
            <div>
              <Label htmlFor="name">Candidate Name</Label>
              <Input
                id="name"
                value={newCandidate.name}
                onChange={(e) => setNewCandidate(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Enter candidate name"
              />
            </div>
            <div>
              <Label htmlFor="party">Party Name</Label>
              <Input
                id="party"
                value={newCandidate.party}
                onChange={(e) => setNewCandidate(prev => ({ ...prev, party: e.target.value }))}
                placeholder="Enter party name"
              />
            </div>
            <div>
              <Label htmlFor="tagline">Tagline</Label>
              <Input
                id="tagline"
                value={newCandidate.tagline}
                onChange={(e) => setNewCandidate(prev => ({ ...prev, tagline: e.target.value }))}
                placeholder="Enter candidate tagline"
              />
            </div>
            <div>
              <Label htmlFor="logoIPFS">Logo IPFS Hash (Optional)</Label>
              <Input
                id="logoIPFS"
                value={newCandidate.logoIPFS}
                onChange={(e) => setNewCandidate(prev => ({ ...prev, logoIPFS: e.target.value }))}
                placeholder="Enter IPFS hash for logo"
              />
            </div>
            <Button 
              onClick={handleAddCandidate}
              className="w-full"
            >
              Add Candidate
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="w-5 h-5" />
            Registered Candidates ({candidates.length})
          </CardTitle>
          <CardDescription>List of all registered candidates</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {candidates.map((candidate, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-lg">{candidate.name}</CardTitle>
                  <CardDescription>{candidate.party}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{candidate.tagline}</p>
                  {candidate.voteCount && (
                    <p className="mt-2 text-sm font-medium">
                      Votes: {Number(candidate.voteCount)}
                    </p>
                  )}
                </CardContent>
              </Card>
            ))}
            {candidates.length === 0 && (
              <div className="col-span-full text-center py-8 text-muted-foreground">
                No candidates registered yet
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CandidateList;