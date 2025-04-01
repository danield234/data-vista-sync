
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
    port: 3306
  }
};

export class SshDatabaseService {
  private _isConnected: boolean = false;
  
  get isConnected(): boolean {
    return this._isConnected;
  }

  async connect(): Promise<boolean> {
    console.log("Attempting SSH connection to:", sshConfig.host);
    
    try {
      // In a real app, we would establish SSH connection here
      // This is a simulation for the client-side demo
      
      // Simulate connection delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Randomly fail sometimes to simulate connection issues
      if (Math.random() < 0.2) {
        throw new Error("SSH connection failed");
      }
      
      this._isConnected = true;
      console.log("SSH Connection successful");
      return true;
    } catch (error) {
      this._isConnected = false;
      console.error("SSH connection error:", error);
      throw new Error("Could not establish SSH connection to the server");
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
      throw new Error("No active SSH connection");
    }
    
    console.log("Fetching users via SSH tunnel...");
    
    try {
      // Simulate database query delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Randomly fail sometimes to simulate database issues
      if (Math.random() < 0.1) {
        throw new Error("Database query failed");
      }
      
      // This would be the actual database query in a real app
      // In this simulation, we're just returning empty data
      // The actual data will come from the server
      return [];
    } catch (error) {
      console.error("Database query error:", error);
      throw new Error("Failed to fetch users from database");
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
