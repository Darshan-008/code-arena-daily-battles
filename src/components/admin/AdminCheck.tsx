
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";

// List of admin user IDs - in a real app, this would be managed in a separate admin table
const ADMIN_USER_IDS: string[] = [
  // Add known admin user IDs here - this is a temporary solution
];

interface AdminCheckProps {
  children: React.ReactNode;
}

const AdminCheck = ({ children }: AdminCheckProps) => {
  const navigate = useNavigate();
  const { user, isLoading } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isCheckingAdmin, setIsCheckingAdmin] = useState(true);

  // Check if user is admin
  useEffect(() => {
    const checkIfAdmin = async () => {
      if (!user) return;

      try {
        // For now, we'll consider the first user who logs in as an admin
        // This is a temporary solution - in production, you would check against a proper admin list
        
        // Option 1: Check if user's email is from a specific domain (e.g., company email)
        const isCompanyEmail = user.email?.endsWith('@youradmindomain.com');
        
        // Option 2: Check if user's ID is in our hardcoded admin list
        const isAdminById = ADMIN_USER_IDS.includes(user.id);
        
        // Option 3: For testing purposes, make the current user an admin
        // IMPORTANT: Remove this in production!
        const isTestAdmin = true; // For development only
        
        setIsAdmin(isCompanyEmail || isAdminById || isTestAdmin);
      } catch (error) {
        console.error('Error checking admin status:', error);
        setIsAdmin(false);
      } finally {
        setIsCheckingAdmin(false);
      }
    };
    
    checkIfAdmin();
  }, [user]);

  // Redirect non-authenticated or non-admin users
  useEffect(() => {
    // Redirect non-authenticated users
    if (!isLoading && !user) {
      navigate("/auth");
      toast({
        description: "You must be logged in to access the admin page",
      });
      return;
    }
    
    // Redirect non-admin users once we've checked their status
    if (!isLoading && !isCheckingAdmin && !isAdmin) {
      navigate("/");
      toast({
        description: "You don't have permission to access the admin page",
      });
    }
  }, [user, isLoading, isAdmin, isCheckingAdmin, navigate]);

  if (isLoading || isCheckingAdmin) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  if (!isAdmin) {
    return null; // The useEffect will handle redirection
  }

  return <>{children}</>;
};

export default AdminCheck;
