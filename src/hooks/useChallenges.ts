
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

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
  const { user } = useAuth();

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

  // Delete a challenge by ID
  const deleteChallenge = useMutation({
    mutationFn: async (id: string) => {
      // First check if the current user is an admin by checking their role
      if (!user) {
        throw new Error("You must be logged in to delete challenges");
      }
      
      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();
      
      if (profileError) {
        throw new Error("Unable to verify admin status");
      }
      
      if (profileData.role !== "admin") {
        throw new Error("Only admins can delete challenges");
      }
      
      // If user is admin, proceed with deletion
      const { error } = await supabase
        .from("challenges")
        .delete()
        .eq("id", id);
      
      if (error) {
        console.error(`Error deleting challenge ${id}:`, error);
        throw error;
      }
      
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["challenges"] });
      toast({
        description: "Challenge deleted successfully"
      });
    },
    onError: (error: Error) => {
      toast({
        description: `Failed to delete challenge: ${error.message}`,
      });
    }
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
    deleteChallenge: deleteChallenge.mutateAsync,
    isLoading,
    error
  };
}
