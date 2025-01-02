import { useEffect, useState } from 'react';
import { useAccount } from 'wagmi';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, Award, Calendar } from "lucide-react";
import { getVoters, getCandidates, getElectionStatus } from '@/utils/contractUtils';
import { useToast } from "@/hooks/use-toast";
import VoterManagement from './admin/VoterManagement';
import CandidateList from './admin/CandidateList';
import ElectionControl from './admin/ElectionControl';

const AdminPortal = () => {
  const { toast } = useToast();
  const { address } = useAccount();
  const [voters, setVoters] = useState<string[]>([]);
  const [candidates, setCandidates] = useState<any[]>([]);
  const [electionActive, setElectionActive] = useState(false);
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
        setElectionActive(status.isActive);
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

        <TabsContent value="voters">
          <VoterManagement voters={voters} setVoters={setVoters} />
        </TabsContent>

        <TabsContent value="candidates">
          <CandidateList candidates={candidates} />
        </TabsContent>

        <TabsContent value="election">
          <ElectionControl electionActive={electionActive} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminPortal;