
import { User } from "@/types/user";

// This is a client-side simulation of SSH connection
// In a real app, this would be handled by a backend service
export interface SshConfig {
  host: string;
  port: number;
  username: string;
  password: string;
  database: {
    name: string;
    user: string;
    password: string;
    port: number;
    host?: string; // Added host property for the database
  }
}

// SSH configuration from .env (will be populated by user)
const sshConfig: SshConfig = {
  host: "thisismeserver",
  port: 22,
  username: "iamthenewuser",
  password: "thisisjustatempapasword1",
  database: {
    name: "new_iq_database",
    user: "metheuserofthedatabase",
    password: "secretbig123",
    port: 3306,
    host: "localhost" // Default to localhost, can be changed if needed
  }
};

export class SshDatabaseService {
  private _isConnected: boolean = false;
  private _lastError: string | null = null;
  
  get isConnected(): boolean {
    return this._isConnected;
  }

  get lastError(): string | null {
    return this._lastError;
  }

  async connect(): Promise<boolean> {
    console.log("Attempting SSH connection to:", sshConfig.host);
    this._lastError = null;
    
    try {
      // In a real app, we would establish SSH connection here
      // This is a simulation for the client-side demo
      
      // Check if host is valid before attempting connection
      if (!sshConfig.host || sshConfig.host.trim() === "") {
        throw new Error("Invalid SSH host configuration");
      }
      
      // Simulate connection delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Simulate different connection scenarios for better testing
      const rand = Math.random();
      if (rand < 0.2) {
        throw new Error("SSH connection failed: Connection refused. Please check if the server is running and accessible.");
      } else if (rand < 0.3) {
        throw new Error("SSH authentication failed: Invalid username or password");
      }
      
      this._isConnected = true;
      console.log("SSH Connection successful");
      return true;
    } catch (error) {
      this._isConnected = false;
      this._lastError = error instanceof Error ? error.message : 'Unknown SSH connection error';
      console.error("SSH connection error:", this._lastError);
      throw new Error(`SSH connection error: ${this._lastError}`);
    }
  }

  async disconnect(): Promise<void> {
    // Simulate disconnection
    await new Promise(resolve => setTimeout(resolve, 500));
    this._isConnected = false;
    console.log("SSH Connection closed");
  }

  async fetchUsers(): Promise<User[]> {
    if (!this._isConnected) {
      throw new Error("No active SSH connection. Please connect to SSH first.");
    }
    
    console.log("Fetching users via SSH tunnel...");
    console.log(`Database config: ${sshConfig.database.host}:${sshConfig.database.port}/${sshConfig.database.name}`);
    
    try {
      // Simulate database query delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Enhanced error simulation with more specific error messages
      const rand = Math.random();
      if (rand < 0.1) {
        throw new Error("Database authentication failed. Please check your database credentials.");
      } else if (rand < 0.2) {
        throw new Error("Database connection timed out. The database server might be down or unreachable.");
      } else if (rand < 0.3) {
        throw new Error(`Access denied for user '${sshConfig.database.user}' to database '${sshConfig.database.name}'`);
      } else if (rand < 0.4) {
        throw new Error(`Database '${sshConfig.database.name}' does not exist.`);
      }
      
      // This would be the actual database query in a real app
      // For demo purposes, let's return an empty array and 
      // check if we need to throw an error for empty results
      const users: User[] = [];
      
      // Uncomment the following line to test with real data
      // The line below would normally be replaced with real database results
      // users = [{ id: 1, name: "Test User", age: 30, email: "test@example.com", iq_score: 100, paid: true, certificate: "TEST1234", created_at: new Date().toISOString() }];
      
      if (users.length === 0) {
        // This is not a connection error but a data issue
        console.warn("Query returned zero users");
        throw new Error("Database query returned 0 users. The table might be empty.");
      }
      
      return users;
    } catch (error) {
      this._lastError = error instanceof Error ? error.message : 'Unknown database error';
      console.error("Database query error:", this._lastError);
      throw new Error(`Database query error: ${this._lastError}`);
    }
  }
}

// Create singleton instance
export const sshService = new SshDatabaseService();

// Demo data for the "Demo Data" button
export const getDemoData = (): User[] => {
  return [
    {
      id: 1,
      name: "John Doe",
      age: 28,
      email: "john.doe@example.com",
      iq_score: 120,
      paid: true,
      certificate: "ABC12345",
      created_at: "2023-05-15T10:30:00Z"
    },
    {
      id: 2,
      name: "Jane Smith",
      age: 32,
      email: "jane.smith@example.com",
      iq_score: 135,
      paid: true,
      certificate: "DEF67890",
      created_at: "2023-06-22T14:45:00Z"
    },
    {
      id: 3,
      name: "Michael Johnson",
      age: 45,
      email: "michael.j@example.com",
      iq_score: 118,
      paid: false,
      certificate: "GHI13579",
      created_at: "2023-04-10T09:15:00Z"
    },
    {
      id: 4,
      name: "Emily Wilson",
      age: 24,
      email: "emily.w@example.com",
      iq_score: 142,
      paid: true,
      certificate: "JKL24680",
      created_at: "2023-07-05T11:20:00Z"
    },
    {
      id: 5,
      name: "David Brown",
      age: 39,
      email: "david.b@example.com",
      iq_score: 125,
      paid: false,
      certificate: "MNO13579",
      created_at: "2023-03-18T16:05:00Z"
    }
  ];
};
