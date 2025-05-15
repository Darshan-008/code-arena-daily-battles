
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, Code, Database, Settings } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const Index = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-b from-codewars-navy to-codewars-dark">
      <div className="container py-8 px-4 mx-auto">
        {/* Hero Section */}
        <section className="flex flex-col items-center justify-center py-12 text-center">
          <h1 className="text-5xl font-bold mb-4 text-codewars-blue">
            CampusCodeWars
          </h1>
          <p className="text-2xl mb-8 text-codewars-light max-w-2xl">
            Daily coding challenges for college students. Compete, learn, and climb the leaderboard.
          </p>
          <div className="flex gap-4 flex-wrap justify-center">
            {!user ? (
              <Link to="/auth">
                <Button 
                  size="lg" 
                  className="bg-codewars-blue text-codewars-navy hover:bg-opacity-80"
                >
                  Register Now
                </Button>
              </Link>
            ) : (
              <Link to="/challenges">
                <Button 
                  size="lg" 
                  className="bg-codewars-blue text-codewars-navy hover:bg-opacity-80"
                >
                  Start Coding
                </Button>
              </Link>
            )}
            <Link to="/challenges">
              <Button 
                variant="outline" 
                size="lg" 
                className="text-codewars-light border-codewars-light hover:bg-codewars-light hover:text-codewars-navy"
              >
                View Challenges <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16">
          <h2 className="text-3xl font-bold mb-12 text-center text-codewars-light">
            Platform Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="bg-codewars-navy border-codewars-blue">
              <CardHeader>
                <Code className="h-8 w-8 mb-2 text-codewars-blue" />
                <CardTitle className="text-codewars-light">Daily Challenges</CardTitle>
                <CardDescription className="text-codewars-light opacity-80">
                  New algorithmic problems released automatically every day
                </CardDescription>
              </CardHeader>
              <CardContent className="text-codewars-light opacity-70">
                Solve problems of varying difficulty across different programming domains
              </CardContent>
            </Card>
            <Card className="bg-codewars-navy border-codewars-blue">
              <CardHeader>
                <Database className="h-8 w-8 mb-2 text-codewars-blue" />
                <CardTitle className="text-codewars-light">Weekly Contests</CardTitle>
                <CardDescription className="text-codewars-light opacity-80">
                  Compete in timed competitions against your peers
                </CardDescription>
              </CardHeader>
              <CardContent className="text-codewars-light opacity-70">
                Weekly leaderboards track your progress and ranking among other students
              </CardContent>
            </Card>
            <Card className="bg-codewars-navy border-codewars-blue">
              <CardHeader>
                <Settings className="h-8 w-8 mb-2 text-codewars-blue" />
                <CardTitle className="text-codewars-light">Real-time Evaluation</CardTitle>
                <CardDescription className="text-codewars-light opacity-80">
                  Get immediate feedback on your solutions
                </CardDescription>
              </CardHeader>
              <CardContent className="text-codewars-light opacity-70">
                Automated code testing evaluates your solutions in real-time
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Tech Stack Section */}
        <section className="py-8 mb-12">
          <h2 className="text-2xl font-bold mb-6 text-center text-codewars-light">
            Built with Modern Stack
          </h2>
          <div className="flex justify-center gap-8 flex-wrap">
            <div className="flex flex-col items-center">
              <div className="bg-white rounded-full p-3 mb-2">
                <img 
                  src="https://raw.githubusercontent.com/supabase/supabase/master/packages/common/assets/images/supabase-logo-icon.png" 
                  alt="Supabase" 
                  className="h-12 w-12"
                />
              </div>
              <span className="text-codewars-light">Supabase</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="bg-white rounded-full p-3 mb-2">
                <img 
                  src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/React-icon.svg/512px-React-icon.svg.png" 
                  alt="React.js" 
                  className="h-12 w-12"
                />
              </div>
              <span className="text-codewars-light">React.js</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="bg-white rounded-full p-3 mb-2">
                <img 
                  src="https://upload.wikimedia.org/wikipedia/commons/thumb/4/4c/Typescript_logo_2020.svg/512px-Typescript_logo_2020.svg.png" 
                  alt="TypeScript" 
                  className="h-12 w-12"
                />
              </div>
              <span className="text-codewars-light">TypeScript</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="bg-white rounded-full p-3 mb-2">
                <img 
                  src="https://upload.wikimedia.org/wikipedia/commons/thumb/d/d5/Tailwind_CSS_Logo.svg/512px-Tailwind_CSS_Logo.svg.png" 
                  alt="Tailwind CSS" 
                  className="h-12 w-12"
                />
              </div>
              <span className="text-codewars-light">Tailwind CSS</span>
            </div>
          </div>
        </section>

        <footer className="text-center text-codewars-light opacity-70 py-6">
          <p>CampusCodeWars - Built with Supabase and React 2025</p>
        </footer>
      </div>
    </div>
  );
};

export default Index;
