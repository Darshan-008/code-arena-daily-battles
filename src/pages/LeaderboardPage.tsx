
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useLeaderboard } from "@/hooks/useLeaderboard";

const LeaderboardPage = () => {
  const { leaderboard, isLoading } = useLeaderboard();
  const [timeframe, setTimeframe] = useState<"daily" | "weekly" | "allTime">("allTime");

  return (
    <div className="min-h-screen bg-gradient-to-b from-codewars-navy to-codewars-dark">
      <div className="container py-8 px-4 mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-codewars-blue">Leaderboard</h1>
          <Link to="/">
            <Button variant="outline" className="text-codewars-light border-codewars-light">
              Back to Home
            </Button>
          </Link>
        </div>

        <Card className="bg-codewars-navy border-codewars-blue mb-6 p-4">
          <div className="flex justify-between items-center">
            <div className="flex space-x-2">
              {[
                { key: "daily", label: "Daily" },
                { key: "weekly", label: "Weekly" },
                { key: "allTime", label: "All Time" }
              ].map((option) => (
                <Button
                  key={option.key}
                  variant={timeframe === option.key ? "default" : "outline"}
                  onClick={() => setTimeframe(option.key as any)}
                  className={
                    timeframe === option.key
                      ? "bg-codewars-blue text-codewars-navy"
                      : "text-codewars-light border-codewars-light"
                  }
                >
                  {option.label}
                </Button>
              ))}
            </div>
          </div>
        </Card>

        <Card className="bg-codewars-navy border-codewars-blue overflow-hidden">
          {isLoading ? (
            <div className="text-center py-12">
              <p className="text-codewars-light">Loading leaderboard data...</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="border-codewars-blue hover:bg-transparent">
                  <TableHead className="text-codewars-light">Rank</TableHead>
                  <TableHead className="text-codewars-light">User</TableHead>
                  <TableHead className="text-codewars-light text-right">Solved</TableHead>
                  <TableHead className="text-codewars-light text-right">Points</TableHead>
                  <TableHead className="text-codewars-light text-right">Streak</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {leaderboard.map((entry) => (
                  <TableRow key={entry.id} className="border-codewars-blue hover:bg-codewars-dark/50">
                    <TableCell className="text-codewars-light font-medium">
                      {entry.rank <= 3 ? (
                        <span className={`text-xl ${
                          entry.rank === 1 
                            ? "text-yellow-400" 
                            : entry.rank === 2 
                            ? "text-gray-300" 
                            : "text-amber-600"
                        }`}>
                          {entry.rank === 1 ? "🥇" : entry.rank === 2 ? "🥈" : "🥉"}
                        </span>
                      ) : (
                        `#${entry.rank}`
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <div className="h-10 w-10 rounded-full overflow-hidden">
                          <img src={entry.avatarUrl} alt={entry.username} />
                        </div>
                        <span className="text-codewars-light">{entry.username}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-codewars-light text-right">{entry.solvedChallenges}</TableCell>
                    <TableCell className="text-codewars-blue font-bold text-right">{entry.points}</TableCell>
                    <TableCell className="text-codewars-light text-right">
                      <span className="inline-flex items-center">
                        {entry.streak} day{entry.streak !== 1 ? "s" : ""} 🔥
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </Card>

        <div className="py-8 text-center text-codewars-light">
          <p className="opacity-70">
            Complete challenges to climb the leaderboard!
          </p>
        </div>
      </div>
    </div>
  );
};

export default LeaderboardPage;
