
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

// List of admin user IDs - in a real app, this would be managed in a separate admin table
const ADMIN_USER_IDS: string[] = [
  // Add known admin user IDs here
];

// List of admin email domains - emails with these domains will be granted admin access
const ADMIN_EMAIL_DOMAINS: string[] = [
  "youradmindomain.com",
  // Add other admin domains here
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
        // Option 1: Check if user's email is from a specific domain (e.g., company email)
        const isCompanyEmail = user.email && ADMIN_EMAIL_DOMAINS.some(domain => 
          user.email?.toLowerCase().endsWith(`@${domain.toLowerCase()}`)
        );
        
        // Option 2: Check if user's ID is in our hardcoded admin list
        const isAdminById = ADMIN_USER_IDS.includes(user.id);
        
        // Option 3: In the future, you would check against a database table of admins
        // For now, we'll use a fallback for development only
        const isDevelopmentAdmin = process.env.NODE_ENV === 'development';
        
        // Check for admin role in Supabase (if you have an admin role column in profiles)
        let hasAdminRole = false;
        
        try {
          const { data } = await supabase
            .from("profiles")
            .select("role")
            .eq("id", user.id)
            .single();
          
          hasAdminRole = data?.role === "admin";
        } catch (error) {
          // If the role column doesn't exist, this will fail silently
          console.log("Note: No role column found in profiles table");
        }
        
        setIsAdmin(isCompanyEmail || isAdminById || isDevelopmentAdmin || hasAdminRole);
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
