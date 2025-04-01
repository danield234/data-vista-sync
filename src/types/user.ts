
export interface User {
  id: number;
  name: string;
  age: number;
  email: string;
  iq_score: number;
  paid: boolean;
  certificate: string;
  created_at: string;
}

export interface DbUser {
  id: number;
  email: string;
}
