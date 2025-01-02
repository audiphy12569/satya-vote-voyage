import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

const AdminPortal = () => {
  const { toast } = useToast();

  const handleAddVoter = () => {
    toast({
      title: "Coming soon",
      description: "This feature is under development",
    });
  };

  const handleRegisterCandidate = () => {
    toast({
      title: "Coming soon",
      description: "This feature is under development",
    });
  };

  const handleManageElections = () => {
    toast({
      title: "Coming soon",
      description: "This feature is under development",
    });
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4 space-y-6">
      <h1 className="text-3xl font-bold text-center mb-8">Admin Portal</h1>
      
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Voter Management</CardTitle>
          </CardHeader>
          <CardContent>
            <Button onClick={handleAddVoter} className="w-full">
              Add Voter
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Candidate Management</CardTitle>
          </CardHeader>
          <CardContent>
            <Button onClick={handleRegisterCandidate} className="w-full">
              Register Candidate
            </Button>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Election Management</CardTitle>
          </CardHeader>
          <CardContent>
            <Button onClick={handleManageElections} className="w-full">
              Manage Elections
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminPortal;