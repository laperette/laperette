export interface AccountFromDB {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  created_at: Date;
  updated_at: Date;
  account_id: string;
  password: string;
  is_member: boolean;
  is_admin: boolean;
}

export interface NewAccountProperties {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface AccountForClient {
  accountId: AccountFromDB["account_id"];
  firstName: AccountFromDB["first_name"];
  lastName: AccountFromDB["last_name"];
  email: AccountFromDB["email"];
  isMember: AccountFromDB["is_member"];
  isAdmin: AccountFromDB["is_admin"];
}
