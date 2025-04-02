import React, { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from "@/components/ui/use-toast";

interface AuthContextType {
  user: { email: string; name: string } | null;
  login: (email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Initialize with a default user so authentication is automatic
  const [user, setUser] = useState<{ email: string; name: string } | null>({ 
    email: 'admin@example.com', 
    name: 'Administrator' 
  });
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Keep the login/logout methods for future use
  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const userData = { email, name: 'Administrator' };
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
      toast({
        title: "Authentication successful",
        description: "Welcome to Data Vista Sync!",
      });
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const loginWithGoogle = async () => {
    setIsLoading(true);
    try {
      // Simulate Google login - in real app would use OAuth
      const userData = { email: 'google@example.com', name: 'Google User' };
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
      toast({
        title: "Google authentication successful",
        description: "Welcome to Data Vista Sync!",
      });
    } catch (error) {
      console.error('Google login failed:', error);
      throw error; 
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    });
  };

  return (
    <AuthContext.Provider value={{ user, login, loginWithGoogle, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};
