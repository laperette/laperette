export interface Session {
  id: number;
  session_id: string;
  account_id: string;
  expires_at: Date;
  created_at: Date;
  updated_at: Date;
}
