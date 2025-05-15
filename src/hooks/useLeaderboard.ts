
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export type LeaderboardEntry = {
  id: string;
  rank: number;
  username: string;
  avatarUrl: string;
  solvedChallenges: number;
  points: number;
  streak: number;
};

export function useLeaderboard() {
  const { toast } = useToast();

  // In a real app, this would be a database query that tallies user submissions
  // This is a mock implementation for frontend demo
  const { data: leaderboard = [], isLoading, error } = useQuery({
    queryKey: ["leaderboard"],
    queryFn: async () => {
      // In a real implementation, this would be a join between
      // profiles and submissions tables with aggregation
      
      const { data: profiles, error } = await supabase
        .from("profiles")
        .select("*");
        
      if (error) {
        toast({
          title: "Error fetching leaderboard",
          description: error.message,
        });
        throw error;
      }

      // Generate mock leaderboard data
      // In a production app, this would come from the database
      return profiles.map((profile, index) => ({
        id: profile.id,
        rank: index + 1,
        username: profile.username || "Anonymous",
        avatarUrl: profile.avatar_url || `https://api.dicebear.com/7.x/micah/svg?seed=${profile.username}`,
        solvedChallenges: Math.floor(Math.random() * 50),
        points: Math.floor(Math.random() * 3000) + 1000,
        streak: Math.floor(Math.random() * 20)
      })).sort((a, b) => b.points - a.points)
      .map((entry, index) => ({...entry, rank: index + 1}));
    },
  });

  return {
    leaderboard,
    isLoading,
    error
  };
}
