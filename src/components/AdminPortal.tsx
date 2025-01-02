import { useEffect, useState } from 'react';
import { useAccount } from 'wagmi';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, UserPlus, Award, Calendar } from "lucide-react";
import { getVoters, getCandidates, getElectionStatus } from '@/utils/contractUtils';

const AdminPortal = () => {
  const { toast } = useToast();
  const { address } = useAccount();
  const [voters, setVoters] = useState<string[]>([]);
  const [candidates, setCandidates] = useState<any[]>([]);
  const [electionActive, setElectionActive] = useState(false);
  const [newVoterAddress, setNewVoterAddress] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [votersList, candidatesList, status] = await Promise.all([
          getVoters(),
          getCandidates(),
          getElectionStatus()
        ]);
        setVoters(votersList);
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
      // Add contract interaction here
      toast({
        title: "Success",
        description: "Voter added successfully",
      });
      setNewVoterAddress('');
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add voter",
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
        <h1 className="text-4xl font-bold text-primary">Admin Portal</h1>
        <div className="px-4 py-2 bg-secondary rounded-lg">
          <span className="text-sm font-medium">Connected: {address?.slice(0, 6)}...{address?.slice(-4)}</span>
        </div>
      </div>

      <Tabs defaultValue="voters" className="w-full">
        <TabsList className="grid w-full grid-cols-3 lg:w-[400px]">
          <TabsTrigger value="voters" className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            Voters
          </TabsTrigger>
          <TabsTrigger value="candidates" className="flex items-center gap-2">
            <Award className="w-4 h-4" />
            Candidates
          </TabsTrigger>
          <TabsTrigger value="election" className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            Election
          </TabsTrigger>
        </TabsList>

        <TabsContent value="voters" className="space-y-6">
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
        </TabsContent>

        <TabsContent value="candidates" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Registered Candidates</CardTitle>
              <CardDescription>List of all registered candidates</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                {candidates.map((candidate, index) => (
                  <Card key={index}>
                    <CardHeader>
                      <CardTitle>{candidate.name}</CardTitle>
                      <CardDescription>{candidate.party}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">{candidate.tagline}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="election" className="space-y-6">
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
                  <Button
                    variant={electionActive ? "destructive" : "default"}
                    onClick={() => {
                      toast({
                        title: "Coming soon",
                        description: "This feature is under development",
                      });
                    }}
                  >
                    {electionActive ? "End Election" : "Start Election"}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminPortal;