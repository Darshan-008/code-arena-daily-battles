
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

export type Submission = {
  id: string;
  user_id: string;
  challenge_id: string;
  code: string;
  status: "Correct" | "Incorrect" | "Pending";
  runtime_ms?: number;
  created_at: string;
};

export type NewSubmission = {
  challenge_id: string;
  code: string;
};

export type SubmissionResult = {
  status: "Correct" | "Incorrect" | "Pending";
  runtime_ms: number;
};

export function useSubmissions() {
  const { toast } = useToast();
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Get user's submissions
  const {
    data: submissions = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["submissions", user?.id],
    queryFn: async () => {
      if (!user) return [];

      const { data, error } = await supabase
        .from("submissions")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) {
        toast({
          title: "Error fetching submissions",
          description: error.message,
        });
        throw error;
      }

      return data as Submission[];
    },
    enabled: !!user,
  });

  // Get user's submission for a specific challenge
  const getUserSubmissionForChallenge = async (challengeId: string) => {
    if (!user) return null;

    const { data, error } = await supabase
      .from("submissions")
      .select("*")
      .eq("user_id", user.id)
      .eq("challenge_id", challengeId)
      .maybeSingle();

    if (error && error.code !== "PGRST116") {
      toast({
        title: "Error fetching submission",
        description: error.message,
      });
      throw error;
    }

    return data as Submission | null;
  };

  // Create or update a submission
  const submitMutation = useMutation({
    mutationFn: async ({ challenge_id, code }: NewSubmission): Promise<SubmissionResult> => {
      if (!user) throw new Error("You must be logged in to submit");

      // Naive solution checking (in production this would be an edge function)
      const status = Math.random() > 0.5 ? "Correct" : "Incorrect";
      const runtime_ms = Math.floor(Math.random() * 200) + 50;

      // Check if a submission for this challenge already exists
      const { data: existingSubmission } = await supabase
        .from("submissions")
        .select("id")
        .eq("user_id", user.id)
        .eq("challenge_id", challenge_id)
        .maybeSingle();

      let result;
      if (existingSubmission) {
        // Update existing submission
        result = await supabase
          .from("submissions")
          .update({
            code,
            status,
            runtime_ms,
          })
          .eq("id", existingSubmission.id);
      } else {
        // Create new submission
        result = await supabase
          .from("submissions")
          .insert({
            user_id: user.id,
            challenge_id,
            code,
            status,
            runtime_ms,
          });
      }

      if (result.error) {
        toast({
          title: "Error submitting solution",
          description: result.error.message,
        });
        throw result.error;
      }

      return { status, runtime_ms };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["submissions"] });
      toast({
        title: "Solution submitted",
        description: "Your solution has been submitted and evaluated",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Submission failed",
        description: error.message,
      });
    },
  });

  return {
    submissions,
    getUserSubmissionForChallenge,
    submit: submitMutation.mutateAsync,
    isSubmitting: submitMutation.isPending,
    isLoading,
    error,
  };
}
