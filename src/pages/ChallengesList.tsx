
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useChallenges, Challenge } from "@/hooks/useChallenges";
import { useSubmissions } from "@/hooks/useSubmissions";
import { useAuth } from "@/contexts/AuthContext";

const ChallengesList = () => {
  const { challenges, isLoading } = useChallenges();
  const { submissions } = useSubmissions();
  const { user } = useAuth();
  const [filter, setFilter] = useState<"All" | "Easy" | "Medium" | "Hard">("All");

  const filteredChallenges = filter === "All" 
    ? challenges 
    : challenges.filter(challenge => challenge.difficulty === filter);

  // Create a map of solved challenges
  const solvedChallengeIds = new Set(
    submissions.filter(sub => sub.status === "Correct").map(sub => sub.challenge_id)
  );

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
        </div>

        {isLoading ? (
          <div className="text-center py-12">
            <p className="text-codewars-light">Loading challenges...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredChallenges.map((challenge) => {
              const isSolved = solvedChallengeIds.has(challenge.id);
              
              return (
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
                      Added on {new Date(challenge.created_at).toLocaleDateString()}
                    </p>
                  </CardContent>
                  <CardFooter>
                    <Link to={`/challenge/${challenge.id}`} className="w-full">
                      <Button 
                        className={`w-full ${
                          isSolved
                            ? "bg-green-600 hover:bg-green-700"
                            : "bg-codewars-blue text-codewars-navy hover:bg-opacity-80"
                        }`}
                      >
                        {isSolved ? "Solved" : "Solve Challenge"}
                      </Button>
                    </Link>
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        )}

        {!user && (
          <div className="py-8 text-center text-codewars-light">
            <p className="opacity-70 mb-4">
              Sign in to track your progress and save your solutions
            </p>
            <Link to="/auth">
              <Button className="bg-codewars-blue text-codewars-navy">
                Sign In / Register
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChallengesList;
