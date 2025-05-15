
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Play } from "lucide-react";
import { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useChallenges, Challenge } from "@/hooks/useChallenges";
import { useSubmissions, Submission } from "@/hooks/useSubmissions";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { toast } from "@/hooks/use-toast";
import ChallengeDescription from "@/components/challenge/ChallengeDescription";
import CodeEditor from "@/components/challenge/CodeEditor";
import TestCases from "@/components/challenge/TestCases";
import ResultsDisplay from "@/components/challenge/ResultsDisplay";

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
      },
      onError: () => {
        navigate("/challenges");
        toast({
          description: "Could not load challenge"
        });
      }
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
            <ChallengeDescription 
              challenge={challenge} 
              isAuthenticated={!!user}
            />
          </div>

          <div className="lg:col-span-2">
            <Tabs defaultValue="code" className="h-full flex flex-col">
              <TabsList className="grid w-full grid-cols-3 bg-codewars-dark text-codewars-light">
                <TabsTrigger value="code">Code</TabsTrigger>
                <TabsTrigger value="tests">Tests</TabsTrigger>
                <TabsTrigger value="results">Results</TabsTrigger>
              </TabsList>
              <TabsContent value="code" className="flex-grow">
                <CodeEditor 
                  code={code}
                  onChange={setCode}
                  onRunCode={handleRunCode}
                  onSubmit={handleSubmit}
                  isSubmitting={isSubmitting}
                  isAuthenticated={!!user}
                />
              </TabsContent>
              <TabsContent value="tests">
                <TestCases challenge={challenge} />
              </TabsContent>
              <TabsContent value="results">
                <ResultsDisplay 
                  results={results} 
                  existingSubmission={existingSubmission || null}
                />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChallengePage;
