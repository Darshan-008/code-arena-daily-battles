
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { Link } from "react-router-dom";

type Challenge = {
  id: string;
  title: string;
  difficulty: "Easy" | "Medium" | "Hard";
  tags: string[];
  description: string;
  createdAt: string;
  solved: boolean;
};

// Mock data for frontend development (will be replaced by MongoDB data)
const mockChallenges: Challenge[] = [
  {
    id: "c1",
    title: "Two Sum",
    difficulty: "Easy",
    tags: ["Arrays", "Hash Table"],
    description: "Find two numbers in an array that add up to a specific target.",
    createdAt: "2025-05-08T10:00:00Z",
    solved: false
  },
  {
    id: "c2",
    title: "Longest Palindromic Substring",
    difficulty: "Medium",
    tags: ["String", "Dynamic Programming"],
    description: "Find the longest palindromic substring in a string.",
    createdAt: "2025-05-07T10:00:00Z",
    solved: true
  },
  {
    id: "c3",
    title: "Merge K Sorted Lists",
    difficulty: "Hard",
    tags: ["Linked List", "Heap"],
    description: "Merge k sorted linked lists into one sorted linked list.",
    createdAt: "2025-05-06T10:00:00Z",
    solved: false
  },
  {
    id: "c4",
    title: "Valid Parentheses",
    difficulty: "Easy",
    tags: ["Stack", "String"],
    description: "Determine if a string of parentheses is valid.",
    createdAt: "2025-05-05T10:00:00Z",
    solved: false
  },
  {
    id: "c5",
    title: "Course Schedule",
    difficulty: "Medium",
    tags: ["Graph", "DFS"],
    description: "Determine if it's possible to finish all courses given prerequisites.",
    createdAt: "2025-05-04T10:00:00Z",
    solved: false
  }
];

const ChallengesList = () => {
  const { toast } = useToast();
  const [challenges, setChallenges] = useState<Challenge[]>(mockChallenges);
  const [filter, setFilter] = useState<"All" | "Easy" | "Medium" | "Hard">("All");

  const filteredChallenges = filter === "All" 
    ? challenges 
    : challenges.filter(challenge => challenge.difficulty === filter);

  const handleSolve = (id: string) => {
    toast({
      title: "Backend Not Connected",
      description: "MongoDB and Express backend implementation required to solve challenges.",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-codewars-navy to-codewars-dark">
      <div className="container py-8 px-4 mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-codewars-blue">Coding Challenges</h1>
          <Link to="/">
            <Button variant="outline" className="text-codewars-light border-codewars-light">
              Back to Home
            </Button>
          </Link>
        </div>

        <div className="flex justify-between items-center mb-6">
          <div className="flex space-x-2">
            {["All", "Easy", "Medium", "Hard"].map((difficulty) => (
              <Button
                key={difficulty}
                variant={filter === difficulty ? "default" : "outline"}
                onClick={() => setFilter(difficulty as any)}
                className={
                  filter === difficulty
                    ? "bg-codewars-blue text-codewars-navy"
                    : "text-codewars-light border-codewars-light"
                }
              >
                {difficulty}
              </Button>
            ))}
          </div>
          <Button 
            className="bg-codewars-blue text-codewars-navy hover:bg-opacity-80"
            onClick={() => toast({
              title: "Backend Required",
              description: "MongoDB connection required to fetch daily challenges.",
            })}
          >
            Refresh Challenges
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredChallenges.map((challenge) => (
            <Card key={challenge.id} className="bg-codewars-navy border-codewars-blue">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="text-codewars-light">{challenge.title}</CardTitle>
                  <span 
                    className={`px-2 py-1 text-xs rounded-full ${
                      challenge.difficulty === "Easy" 
                        ? "bg-green-600" 
                        : challenge.difficulty === "Medium" 
                        ? "bg-yellow-600" 
                        : "bg-red-600"
                    }`}
                  >
                    {challenge.difficulty}
                  </span>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-codewars-light opacity-80 mb-4">{challenge.description}</p>
                <div className="flex flex-wrap gap-2 mb-3">
                  {challenge.tags.map((tag) => (
                    <span key={tag} className="bg-codewars-dark text-codewars-light text-xs px-2 py-1 rounded">
                      {tag}
                    </span>
                  ))}
                </div>
                <p className="text-xs text-codewars-light opacity-50">
                  Added on {new Date(challenge.createdAt).toLocaleDateString()}
                </p>
              </CardContent>
              <CardFooter>
                <Button 
                  onClick={() => handleSolve(challenge.id)}
                  className={`w-full ${
                    challenge.solved
                      ? "bg-green-600 hover:bg-green-700"
                      : "bg-codewars-blue text-codewars-navy hover:bg-opacity-80"
                  }`}
                >
                  {challenge.solved ? "Solved" : "Solve Challenge"}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        <div className="py-8 text-center text-codewars-light">
          <p className="opacity-70">
            Note: This is a frontend demo. Backend implementation with MongoDB and Express.js is required for full functionality.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ChallengesList;
