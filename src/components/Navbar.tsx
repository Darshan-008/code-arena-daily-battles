
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const Navbar = () => {
  const { user, signOut } = useAuth();

  return (
    <header className="bg-codewars-dark border-b border-codewars-blue/30">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          <Link to="/" className="flex items-center space-x-2">
            <div className="bg-codewars-blue rounded-md p-1">
              <span className="text-codewars-navy font-bold">CW</span>
            </div>
            <span className="text-codewars-blue font-bold">CampusCodeWars</span>
          </Link>
          <nav>
            <ul className="flex items-center space-x-8">
              <li>
                <Link to="/challenges" className="text-codewars-light hover:text-codewars-blue transition-colors">
                  Challenges
                </Link>
              </li>
              <li>
                <Link to="/leaderboard" className="text-codewars-light hover:text-codewars-blue transition-colors">
                  Leaderboard
                </Link>
              </li>
              <li>
                {user ? (
                  <Button 
                    variant="outline" 
                    className="border-codewars-blue text-codewars-blue hover:bg-codewars-blue/10"
                    onClick={signOut}
                  >
                    Sign Out
                  </Button>
                ) : (
                  <Link to="/auth">
                    <Button 
                      variant="outline" 
                      className="border-codewars-blue text-codewars-blue hover:bg-codewars-blue/10"
                    >
                      Login
                    </Button>
                  </Link>
                )}
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
