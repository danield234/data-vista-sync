
import { useEffect } from "react";
import { useData } from "@/context/DataContext";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Header from "./Header";
import UserDataTable from "./UserDataTable";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { RefreshCw, Trash2, Play } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Dashboard = () => {
  const { user } = useAuth();
  const { users, isLoading, error, syncData, clearCache, loadDemoData, isDemoMode, lastSynced } = useData();

  // When dashboard first loads, check if we have data
  useEffect(() => {
    if (users.length === 0 && !isLoading && !error) {
      // If no data, do nothing - user will need to sync or load demo data
    }
  }, [users.length, isLoading, error]);

  const formatLastSynced = () => {
    if (!lastSynced) return "Never";
    
    const now = new Date();
    const diff = now.getTime() - lastSynced.getTime();
    
    // Less than a minute
    if (diff < 60000) {
      return "Just now";
    }
    
    // Less than an hour
    if (diff < 3600000) {
      const minutes = Math.floor(diff / 60000);
      return `${minutes} minute${minutes !== 1 ? 's' : ''} ago`;
    }
    
    // Less than a day
    if (diff < 86400000) {
      const hours = Math.floor(diff / 3600000);
      return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
    }
    
    // Just return the date
    return lastSynced.toLocaleDateString() + ' ' + lastSynced.toLocaleTimeString();
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-6 max-w-7xl">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              Welcome, {user?.name || 'User'}
            </h1>
            <p className="text-muted-foreground mt-1">
              {isDemoMode ? 'Demo Mode - Showing Sample Data' : 'Manage and view your user data'}
            </p>
          </div>
          
          <div className="flex flex-wrap gap-2 mt-4 md:mt-0">
            <Button 
              variant="outline"
              onClick={clearCache}
              disabled={isLoading}
              className="flex items-center gap-1"
            >
              <Trash2 className="h-4 w-4" />
              <span>Clear Cache</span>
            </Button>
            
            <Button 
              variant="outline"
              onClick={loadDemoData}
              disabled={isLoading}
              className="flex items-center gap-1"
            >
              <Play className="h-4 w-4" />
              <span>Demo Data</span>
            </Button>
            
            <Button 
              onClick={syncData}
              disabled={isLoading}
              className="flex items-center gap-1"
            >
              <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
              <span>{isLoading ? 'Syncing...' : 'Sync Data'}</span>
            </Button>
          </div>
        </div>
        
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        {isDemoMode && (
          <Alert className="mb-6 bg-amber-50 text-amber-800 border-amber-200">
            <AlertTitle>Demo Mode Active</AlertTitle>
            <AlertDescription>
              You're viewing sample data. Use the "Sync Data" button to fetch real data from your database.
            </AlertDescription>
          </Alert>
        )}
        
        <div className="grid gap-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>User Data</CardTitle>
              <CardDescription>
                {users.length > 0 
                  ? `Showing ${users.length} users • Last synced: ${formatLastSynced()}`
                  : 'No data available'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="table" className="w-full">
                <TabsList>
                  <TabsTrigger value="table">Table</TabsTrigger>
                  <TabsTrigger value="analytics" disabled>Analytics</TabsTrigger>
                </TabsList>
                <TabsContent value="table">
                  {isLoading ? (
                    <div className="flex justify-center items-center py-12">
                      <div className="flex flex-col items-center">
                        <RefreshCw className="h-8 w-8 animate-spin text-blue-500" />
                        <p className="mt-4 text-muted-foreground">Loading data...</p>
                      </div>
                    </div>
                  ) : users.length > 0 ? (
                    <UserDataTable data={users} />
                  ) : (
                    <div className="flex justify-center items-center py-12 text-center">
                      <div className="max-w-md">
                        <h3 className="font-semibold text-lg mb-2">No data available</h3>
                        <p className="text-muted-foreground mb-4">
                          Use the "Sync Data" button to fetch data from your database 
                          or "Demo Data" to load sample data.
                        </p>
                      </div>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </main>
      
      <footer className="py-4 px-6 border-t border-gray-200 dark:border-gray-800">
        <div className="container mx-auto max-w-7xl">
          <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
            Data Vista Sync © {new Date().getFullYear()} - SSH Database Integration
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Dashboard;
