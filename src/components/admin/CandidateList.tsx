import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";

interface CandidateListProps {
  candidates: any[];
}

const CandidateList = ({ candidates }: CandidateListProps) => {
  return (
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
  );
};

export default CandidateList;