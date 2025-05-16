
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export type Challenge = {
  id: string;
  title: string;
  difficulty: "Easy" | "Medium" | "Hard";
  tags: string[];
  description: string;
  solution_template?: string;
  test_cases?: string;
  created_at: string;
  is_ai_generated?: boolean;
};

export function useChallenges() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch all challenges
  const { data: challenges = [], isLoading, error } = useQuery({
    queryKey: ["challenges"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("challenges")
        .select("*")
        .order("created_at", { ascending: false });
      
      if (error) {
        console.error("Error fetching challenges:", error);
        toast({
          description: error.message,
        });
        throw error;
      }
      
      return data as Challenge[];
    },
  });

  // Fetch a single challenge by ID
  const getChallenge = async (id: string) => {
    const { data, error } = await supabase
      .from("challenges")
      .select("*")
      .eq("id", id)
      .single();
    
    if (error) {
      console.error(`Error fetching challenge ${id}:`, error);
      toast({
        description: error.message,
      });
      throw error;
    }
    
    return data as Challenge;
  };

  return {
    challenges,
    getChallenge,
    isLoading,
    error
  };
}
