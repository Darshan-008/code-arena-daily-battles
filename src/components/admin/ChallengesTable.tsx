
import { useState } from "react";
import { Edit, Trash, Sparkles, ChevronDown, ChevronUp } from "lucide-react";
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Challenge, useChallenges } from "@/hooks/useChallenges";
import { useToast } from "@/hooks/use-toast";

const ChallengesTable = () => {
  const navigate = useNavigate();
  const { challenges, isLoading, error, deleteChallenge } = useChallenges();
  const [expandedRows, setExpandedRows] = useState<string[]>([]);
  const [challengeToDelete, setChallengeToDelete] = useState<Challenge | null>(null);
  const { toast } = useToast();

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

  const handleDeleteChallenge = async () => {
    if (!challengeToDelete) return;
    
    try {
      await deleteChallenge(challengeToDelete.id);
      setChallengeToDelete(null);
    } catch (error) {
      console.error("Error deleting challenge:", error);
    }
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
            <>
              <TableRow 
                key={challenge.id}
                className="cursor-pointer"
                onClick={() => toggleRowExpansion(challenge.id)}
              >
                <TableCell className="font-medium">
                  <div className="flex items-center gap-2">
                    {challenge.title}
                    {challenge.is_ai_generated && (
                      <Badge variant="outline" className="flex items-center gap-1">
                        <Sparkles className="h-3 w-3" />
                        <span className="text-xs">AI</span>
                      </Badge>
                    )}
                    {expandedRows.includes(challenge.id) ? 
                      <ChevronUp className="h-4 w-4 ml-1" /> :
                      <ChevronDown className="h-4 w-4 ml-1" />
                    }
                  </div>
                </TableCell>
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
                        setChallengeToDelete(challenge);
                      }}
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
              {expandedRows.includes(challenge.id) && (
                <TableRow key={`${challenge.id}-expanded`}>
                  <TableCell colSpan={4} className="bg-muted/50 py-4">
                    <div className="space-y-2 p-2">
                      <h4 className="font-semibold">Description:</h4>
                      <p className="text-sm">{challenge.description}</p>
                      
                      <h4 className="font-semibold">Tags:</h4>
                      <div className="flex flex-wrap gap-1">
                        {challenge.tags.map((tag, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>

                      {challenge.solution_template && (
                        <>
                          <h4 className="font-semibold">Solution Template:</h4>
                          <pre className="bg-muted p-2 rounded text-xs overflow-x-auto">
                            {challenge.solution_template}
                          </pre>
                        </>
                      )}

                      <div className="pt-2">
                        <Button 
                          variant="default" 
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/challenge/${challenge.id}`);
                          }}
                        >
                          View Challenge
                        </Button>
                      </div>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </>
          ))}
        </TableBody>
      </Table>
      
      {/* Delete Challenge Dialog */}
      <AlertDialog open={!!challengeToDelete} onOpenChange={(open) => !open && setChallengeToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Challenge</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this challenge?
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteChallenge}
              className="bg-destructive text-destructive-foreground"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ChallengesTable;
