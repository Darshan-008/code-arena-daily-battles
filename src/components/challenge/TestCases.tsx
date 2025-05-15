
import { Card, CardContent } from "@/components/ui/card";
import { Challenge } from "@/hooks/useChallenges";

interface TestCasesProps {
  challenge: Challenge;
}

const TestCases: React.FC<TestCasesProps> = ({ challenge }) => {
  return (
    <Card className="bg-codewars-navy border-codewars-blue h-full">
      <CardContent className="p-6">
        <div className="bg-codewars-dark p-4 rounded-md text-codewars-light font-mono text-sm">
          <p className="mb-2">// Test cases for {challenge.title}</p>
          <p className="mb-2">// Run your code to test against these cases</p>
          <p className="mb-2">&nbsp;</p>
          {challenge.test_cases && typeof challenge.test_cases === 'string' && (
            Array.isArray(JSON.parse(challenge.test_cases)) ? (
              JSON.parse(challenge.test_cases).map((test: any, index: number) => (
                <div key={index} className="mb-4">
                  <p>// Test {index + 1}:</p>
                  <p>// Input: {JSON.stringify(test.input)}</p>
                  <p>// Expected: {JSON.stringify(test.expected)}</p>
                </div>
              ))
            ) : (
              <p>No test cases available</p>
            )
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default TestCases;
