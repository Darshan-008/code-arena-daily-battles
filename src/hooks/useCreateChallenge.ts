
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Challenge } from "@/hooks/useChallenges";

type CreateChallengeInput = {
  title: string;
  description: string;
  difficulty: "Easy" | "Medium" | "Hard";
  solution_template: string;
  tags: string[];
  test_cases: any;
  is_ai_generated?: boolean;
};

export function useCreateChallenge() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const createChallengeMutation = useMutation({
    mutationFn: async (challenge: CreateChallengeInput) => {
      const { data, error } = await supabase
        .from("challenges")
        .insert({
          title: challenge.title,
          description: challenge.description,
          difficulty: challenge.difficulty,
          solution_template: challenge.solution_template,
          tags: challenge.tags,
          test_cases: challenge.test_cases,
          is_ai_generated: challenge.is_ai_generated || false,
        })
        .select()
        .single();

      if (error) {
        console.error("Error creating challenge:", error);
        throw new Error(error.message);
      }
      
      return data as Challenge;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["challenges"] });
    },
    onError: (error: Error) => {
      toast({
        description: `Failed to create challenge: ${error.message}`,
      });
    },
  });

  // Add a function to generate a challenge using AI
  const generateChallengeWithAI = async (instructions: string): Promise<Partial<CreateChallengeInput>> => {
    try {
      const response = await fetch('/api/generate-challenge', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ instructions }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate challenge with AI');
      }

      const data = await response.json();
      return {
        title: data.title,
        description: data.description,
        difficulty: data.difficulty,
        solution_template: data.solution_template,
        tags: data.tags,
        test_cases: data.test_cases,
        is_ai_generated: true,
      };
    } catch (error: any) {
      toast({
        description: `Failed to generate challenge with AI: ${error.message}`,
      });
      throw error;
    }
  };

  return {
    createChallenge: createChallengeMutation.mutateAsync,
    generateChallengeWithAI,
    isCreating: createChallengeMutation.isPending,
  };
}
