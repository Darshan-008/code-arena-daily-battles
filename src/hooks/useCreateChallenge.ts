
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

  return {
    createChallenge: createChallengeMutation.mutateAsync,
    isCreating: createChallengeMutation.isPending,
  };
}
