
import { useState } from "react";
import { Edit, Trash } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Challenge, useChallenges } from "@/hooks/useChallenges";
import { toast } from "@/hooks/use-toast";

const ChallengesTable = () => {
  const navigate = useNavigate();
  const { challenges, isLoading, error } = useChallenges();
  const [expandedRows, setExpandedRows] = useState<string[]>([]);

  const toggleRowExpansion = (id: string) => {
    setExpandedRows((prev) => 
      prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id]
    );
  };

  if (isLoading) {
    return <div className="text-center py-4">Loading challenges...</div>;
  }

  if (error) {
    return <div className="text-center py-4 text-red-500">Failed to load challenges</div>;
  }

  if (!challenges.length) {
    return <div className="text-center py-4">No challenges found. Create your first one!</div>;
  }

  const handleEditChallenge = (challenge: Challenge) => {
    toast({
      description: "Edit functionality not implemented yet",
    });
  };

  const handleDeleteChallenge = (challengeId: string) => {
    toast({
      description: "Delete functionality not implemented yet",
    });
  };

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Difficulty</TableHead>
            <TableHead>Created</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {challenges.map((challenge) => (
            <TableRow 
              key={challenge.id}
              className="cursor-pointer"
              onClick={() => toggleRowExpansion(challenge.id)}
            >
              <TableCell className="font-medium">{challenge.title}</TableCell>
              <TableCell>
                <Badge className={
                  challenge.difficulty === "Easy" ? "bg-green-500" :
                  challenge.difficulty === "Medium" ? "bg-yellow-500" :
                  "bg-red-500"
                }>
                  {challenge.difficulty}
                </Badge>
              </TableCell>
              <TableCell>
                {new Date(challenge.created_at).toLocaleDateString()}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end space-x-2">
                  <Button 
                    variant="outline" 
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEditChallenge(challenge);
                    }}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteChallenge(challenge.id);
                    }}
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default ChallengesTable;
