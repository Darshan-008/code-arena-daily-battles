
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Challenge } from "@/hooks/useChallenges";

interface ChallengeDescriptionProps {
  challenge: Challenge;
  isAuthenticated: boolean;
}

const ChallengeDescription: React.FC<ChallengeDescriptionProps> = ({
  challenge,
  isAuthenticated,
}) => {
  return (
    <Card className="bg-codewars-navy border-codewars-blue h-full">
      <CardHeader>
        <CardTitle className="text-codewars-light">Problem Description</CardTitle>
      </CardHeader>
      <CardContent className="text-codewars-light">
        <p className="mb-4">{challenge.description}</p>
        
        <div className="mb-4">
          <h3 className="font-semibold mb-2">Tags:</h3>
          <div className="flex flex-wrap gap-2">
            {challenge.tags.map(tag => (
              <span key={tag} className="bg-codewars-dark px-2 py-1 text-sm rounded">
                {tag}
              </span>
            ))}
          </div>
        </div>
        
        {!isAuthenticated && (
          <div className="bg-codewars-blue/20 p-3 rounded-md mt-4">
            <p className="text-sm">
              <Link to="/auth" className="text-codewars-blue hover:underline">Sign in</Link> to save your progress and submit solutions.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ChallengeDescription;
