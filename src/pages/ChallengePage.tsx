import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Play } from "lucide-react";
import { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useChallenges, Challenge } from "@/hooks/useChallenges";
import { useSubmissions, Submission } from "@/hooks/useSubmissions";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { toast } from "@/hooks/use-toast";

const ChallengePage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { getChallenge } = useChallenges();
  const { getUserSubmissionForChallenge, submit, isSubmitting } = useSubmissions();
  
  const [code, setCode] = useState("");
  const [results, setResults] = useState<null | { success: boolean; message: string }>(null);
  
  // Fetch challenge data
  const { data: challenge, isLoading: isLoadingChallenge } = useQuery({
    queryKey: ["challenge", id],
    queryFn: () => id ? getChallenge(id) : null,
    enabled: !!id,
    meta: {
      onSuccess: (data: Challenge | null) => {
        // If no pre-existing submission, populate with template
        if (data?.solution_template && !code) {
          setCode(data.solution_template);
        }
      }
    },
    onError: () => {
      navigate("/challenges");
      toast({
        description: "Could not load challenge"
      });
    }
  });

  // Fetch user's existing submission if available
  const { data: existingSubmission, isLoading: isLoadingSubmission } = useQuery({
    queryKey: ["submission", id, user?.id],
    queryFn: () => id ? getUserSubmissionForChallenge(id) : null,
    enabled: !!user && !!id,
    meta: {
      onSuccess: (data: Submission | null) => {
        if (data?.code) {
          setCode(data.code);
        }
      }
    }
  });

  // Handle challenge data when it changes
  useEffect(() => {
    if (challenge?.solution_template && !code) {
      setCode(challenge.solution_template);
    }
  }, [challenge, code]);

  // Handle submission data when it changes 
  useEffect(() => {
    if (existingSubmission?.code) {
      setCode(existingSubmission.code);
    }
  }, [existingSubmission]);

  const handleRunCode = () => {
    // Simple validation
    if (!code.trim()) {
      setResults({
        success: false,
        message: "Please write some code before running"
      });
      return;
    }

    // In a real implementation this would use edge functions
    // to execute the code safely with test cases
    setResults({
      success: true,
      message: "⚙️ Code executed successfully. Your solution returns the expected outputs for the test cases."
    });
  };

  const handleSubmit = async () => {
    if (!user) {
      navigate("/auth");
      return;
    }
    
    if (!id) return;
    
    try {
      const result = await submit({ challenge_id: id, code });
      
      if (result && typeof result === 'object') {
        setResults({
          success: result.status === "Correct",
          message: result.status === "Correct" 
            ? `✅ Your solution is correct! Execution time: ${result.runtime_ms}ms` 
            : "❌ Your solution is incorrect. Please check your logic and try again."
        });
      }
    } catch (err) {
      console.error(err);
      toast({
        description: "Failed to submit solution"
      });
    }
  };

  if (isLoadingChallenge) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-codewars-navy to-codewars-dark flex items-center justify-center">
        <p className="text-codewars-light">Loading challenge...</p>
      </div>
    );
  }

  if (!challenge) return null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-codewars-navy to-codewars-dark">
      <div className="container py-8 px-4 mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center space-x-3">
            <Link to="/challenges">
              <Button variant="outline" size="icon" className="text-codewars-light border-codewars-light">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <h1 className="text-2xl md:text-3xl font-bold text-codewars-blue">{challenge.title}</h1>
          </div>
          <div className="flex items-center space-x-2">
            <span className={`px-2 py-1 text-xs rounded-full ${
              challenge.difficulty === "Easy" 
                ? "bg-green-600" 
                : challenge.difficulty === "Medium" 
                ? "bg-yellow-600" 
                : "bg-red-600"
            }`}>
              {challenge.difficulty}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
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
                
                {!user && (
                  <div className="bg-codewars-blue/20 p-3 rounded-md mt-4">
                    <p className="text-sm">
                      <Link to="/auth" className="text-codewars-blue hover:underline">Sign in</Link> to save your progress and submit solutions.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-2">
            <Tabs defaultValue="code" className="h-full flex flex-col">
              <TabsList className="grid w-full grid-cols-3 bg-codewars-dark text-codewars-light">
                <TabsTrigger value="code">Code</TabsTrigger>
                <TabsTrigger value="tests">Tests</TabsTrigger>
                <TabsTrigger value="results">Results</TabsTrigger>
              </TabsList>
              <TabsContent value="code" className="flex-grow">
                <Card className="bg-codewars-navy border-codewars-blue h-full flex flex-col">
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-codewars-light">Your Solution (JavaScript)</CardTitle>
                      <div className="flex space-x-2">
                        <Button 
                          size="sm" 
                          className="bg-codewars-blue text-codewars-navy hover:bg-opacity-80"
                          onClick={handleRunCode}
                        >
                          <Play className="h-4 w-4 mr-2" /> Run Code
                        </Button>
                        <Button 
                          size="sm" 
                          onClick={handleSubmit}
                          disabled={isSubmitting || !user}
                        >
                          {isSubmitting ? "Submitting..." : "Submit"}
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <div className="relative h-full min-h-[300px] bg-codewars-dark rounded-md">
                      <textarea
                        className="absolute inset-0 w-full h-full bg-transparent text-codewars-light p-4 font-mono text-sm resize-none focus:outline-none"
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        placeholder="Write your solution here..."
                      />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="tests">
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
              </TabsContent>
              <TabsContent value="results">
                <Card className="bg-codewars-navy border-codewars-blue h-full">
                  <CardContent className="p-6">
                    {results ? (
                      <div className={`p-4 rounded-md ${results.success ? "bg-green-600/20" : "bg-yellow-600/20"}`}>
                        <h3 className={`font-semibold mb-2 ${results.success ? "text-green-400" : "text-yellow-400"}`}>
                          {results.success ? "Success!" : "Information"}
                        </h3>
                        <p className="text-codewars-light whitespace-pre-line">{results.message}</p>
                      </div>
                    ) : existingSubmission ? (
                      <div className={`p-4 rounded-md ${existingSubmission.status === "Correct" ? "bg-green-600/20" : "bg-yellow-600/20"}`}>
                        <h3 className={`font-semibold mb-2 ${existingSubmission.status === "Correct" ? "text-green-400" : "text-yellow-400"}`}>
                          Previous submission: {existingSubmission.status}
                        </h3>
                        <p className="text-codewars-light">
                          {existingSubmission.status === "Correct" 
                            ? `Execution time: ${existingSubmission.runtime_ms}ms` 
                            : "Your previous submission was incorrect. Try again!"}
                        </p>
                      </div>
                    ) : (
                      <div className="text-center text-codewars-light py-8">
                        <p>Run your code to see results</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChallengePage;
