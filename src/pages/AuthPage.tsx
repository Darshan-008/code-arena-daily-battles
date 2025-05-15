
import { useState } from "react";
import { Navigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { Link } from "react-router-dom";
import { Code } from "lucide-react";

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  
  const { user, signIn, signUp } = useAuth();

  if (user) {
    return <Navigate to="/" />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      if (isLogin) {
        await signIn(email, password);
      } else {
        if (!username.trim()) {
          throw new Error("Username is required");
        }
        await signUp(email, password, username);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-codewars-navy to-codewars-dark flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-codewars-navy border-codewars-blue">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4">
            <div className="bg-codewars-blue rounded-md p-2 inline-block">
              <Code className="h-8 w-8 text-codewars-navy" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-codewars-light">
            {isLogin ? "Welcome Back" : "Create Account"}
          </CardTitle>
          <CardDescription className="text-codewars-light opacity-80">
            {isLogin 
              ? "Enter your credentials to access your account" 
              : "Sign up to start solving coding challenges"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div className="space-y-2">
                <Label htmlFor="username" className="text-codewars-light">Username</Label>
                <Input 
                  id="username" 
                  type="text" 
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter your username"
                  className="bg-codewars-dark border-codewars-blue/50 text-codewars-light" 
                  required
                  disabled={isLoading}
                />
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-codewars-light">Email</Label>
              <Input 
                id="email" 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="bg-codewars-dark border-codewars-blue/50 text-codewars-light" 
                required
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-codewars-light">Password</Label>
              <Input 
                id="password" 
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password" 
                className="bg-codewars-dark border-codewars-blue/50 text-codewars-light" 
                required
                disabled={isLoading}
                minLength={6}
              />
            </div>
            {error && (
              <div className="bg-red-500/20 text-red-300 p-2 rounded-md text-sm">
                {error}
              </div>
            )}
          </form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <Button 
            className="w-full bg-codewars-blue text-codewars-navy hover:bg-opacity-80"
            disabled={isLoading}
            onClick={handleSubmit}
          >
            {isLoading ? "Processing..." : isLogin ? "Sign In" : "Create Account"}
          </Button>
          <div className="text-center text-codewars-light">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="text-codewars-blue hover:underline"
              disabled={isLoading}
            >
              {isLogin ? "Sign Up" : "Sign In"}
            </button>
          </div>
          <Link to="/" className="text-center text-codewars-light opacity-70 text-sm">
            Return to Home
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
};

export default AuthPage;
