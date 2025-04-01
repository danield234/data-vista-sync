
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { User } from '@/types/user';
import { sshService, getDemoData } from '@/services/sshService';
import { useToast } from "@/components/ui/use-toast";

interface DataContextType {
  users: User[];
  isLoading: boolean;
  error: string | null;
  syncData: () => Promise<void>;
  clearCache: () => void;
  loadDemoData: () => void;
  isDemoMode: boolean;
  lastSynced: Date | null;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [lastSynced, setLastSynced] = useState<Date | null>(null);
  const { toast } = useToast();

  // Check for cached data on component mount
  useEffect(() => {
    const cachedData = localStorage.getItem('cachedUsers');
    const cachedTimestamp = localStorage.getItem('lastSynced');
    
    if (cachedData) {
      try {
        setUsers(JSON.parse(cachedData));
        if (cachedTimestamp) {
          setLastSynced(new Date(cachedTimestamp));
        }
      } catch (e) {
        console.error('Error parsing cached data:', e);
        localStorage.removeItem('cachedUsers');
        localStorage.removeItem('lastSynced');
      }
    }
  }, []);

  const syncData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    setIsDemoMode(false);
    
    try {
      // Connect via SSH and fetch data
      console.log("Starting SSH connection process...");
      await sshService.connect();
      
      console.log("SSH connected, fetching users...");
      const data = await sshService.fetchUsers();
      
      // Store in state and cache
      setUsers(data);
      setLastSynced(new Date());
      
      localStorage.setItem('cachedUsers', JSON.stringify(data));
      localStorage.setItem('lastSynced', new Date().toISOString());
      
      toast({
        title: "Data synchronized",
        description: `Successfully fetched ${data.length} users from database.`,
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      console.error("Sync error:", errorMessage);
      setError(errorMessage);
      toast({
        title: "Synchronization failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      // Always disconnect SSH when done
      if (sshService.isConnected) {
        try {
          await sshService.disconnect();
        } catch (e) {
          console.error("Error during SSH disconnection:", e);
        }
      }
    }
  }, [toast]);

  const clearCache = useCallback(() => {
    setUsers([]);
    setLastSynced(null);
    setIsDemoMode(false);
    localStorage.removeItem('cachedUsers');
    localStorage.removeItem('lastSynced');
    toast({
      title: "Cache cleared",
      description: "All cached data has been removed.",
    });
  }, [toast]);

  const loadDemoData = useCallback(() => {
    setUsers(getDemoData());
    setIsDemoMode(true);
    setLastSynced(new Date());
    toast({
      title: "Demo data loaded",
      description: "Sample data has been loaded for demonstration.",
    });
  }, [toast]);

  return (
    <DataContext.Provider value={{
      users,
      isLoading,
      error,
      syncData,
      clearCache,
      loadDemoData,
      isDemoMode,
      lastSynced
    }}>
      {children}
    </DataContext.Provider>
  );
};
