
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
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { Link } from "react-router-dom";

type LeaderboardEntry = {
  id: string;
  rank: number;
  username: string;
  avatarUrl: string;
  solvedChallenges: number;
  points: number;
  streak: number;
};

// Mock data for frontend development (will be replaced with MongoDB data)
const mockLeaderboard: LeaderboardEntry[] = [
  {
    id: "u1",
    rank: 1,
    username: "codeMaster99",
    avatarUrl: "https://api.dicebear.com/7.x/micah/svg?seed=codeMaster",
    solvedChallenges: 42,
    points: 2840,
    streak: 15
  },
  {
    id: "u2",
    rank: 2,
    username: "algorithmQueen",
    avatarUrl: "https://api.dicebear.com/7.x/micah/svg?seed=algorithmQueen",
    solvedChallenges: 39,
    points: 2720,
    streak: 12
  },
  {
    id: "u3",
    rank: 3,
    username: "pythonWizard",
    avatarUrl: "https://api.dicebear.com/7.x/micah/svg?seed=pythonWizard",
    solvedChallenges: 37,
    points: 2590,
    streak: 7
  },
  {
    id: "u4",
    rank: 4,
    username: "javaJedi",
    avatarUrl: "https://api.dicebear.com/7.x/micah/svg?seed=javaJedi",
    solvedChallenges: 34,
    points: 2310,
    streak: 5
  },
  {
    id: "u5",
    rank: 5,
    username: "reactRanger",
    avatarUrl: "https://api.dicebear.com/7.x/micah/svg?seed=reactRanger",
    solvedChallenges: 32,
    points: 2150,
    streak: 9
  },
  {
    id: "u6",
    rank: 6,
    username: "cssNinja",
    avatarUrl: "https://api.dicebear.com/7.x/micah/svg?seed=cssNinja",
    solvedChallenges: 29,
    points: 1980,
    streak: 3
  },
  {
    id: "u7",
    rank: 7,
    username: "dataStructureGuru",
    avatarUrl: "https://api.dicebear.com/7.x/micah/svg?seed=dataStructureGuru",
    solvedChallenges: 27,
    points: 1850,
    streak: 6
  },
  {
    id: "u8",
    rank: 8,
    username: "webDevMaster",
    avatarUrl: "https://api.dicebear.com/7.x/micah/svg?seed=webDevMaster",
    solvedChallenges: 25,
    points: 1720,
    streak: 4
  },
  {
    id: "u9",
    rank: 9,
    username: "backendBoss",
    avatarUrl: "https://api.dicebear.com/7.x/micah/svg?seed=backendBoss",
    solvedChallenges: 24,
    points: 1650,
    streak: 2
  },
  {
    id: "u10",
    rank: 10,
    username: "fullStackDev",
    avatarUrl: "https://api.dicebear.com/7.x/micah/svg?seed=fullStackDev",
    solvedChallenges: 22,
    points: 1540,
    streak: 1
  }
];

const LeaderboardPage = () => {
  const { toast } = useToast();
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>(mockLeaderboard);
  const [timeframe, setTimeframe] = useState<"daily" | "weekly" | "allTime">("allTime");

  const handleRefresh = () => {
    toast({
      title: "Backend Required",
      description: "MongoDB connection required to fetch real-time leaderboard data.",
    });
  };

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
            <Button 
              onClick={handleRefresh}
              className="bg-codewars-blue text-codewars-navy hover:bg-opacity-80"
            >
              Refresh Data
            </Button>
          </div>
        </Card>

        <Card className="bg-codewars-navy border-codewars-blue overflow-hidden">
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
        </Card>

        <div className="py-8 text-center text-codewars-light">
          <p className="opacity-70">
            Note: This is a frontend demo. Backend implementation with MongoDB and Express.js is required for real-time leaderboard updates.
          </p>
        </div>
      </div>
    </div>
  );
};

export default LeaderboardPage;
