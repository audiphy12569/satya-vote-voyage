import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface ElectionControlProps {
  electionActive: boolean;
}

const ElectionControl = ({ electionActive }: ElectionControlProps) => {
  const { toast } = useToast();

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
  );
};

export default ElectionControl;