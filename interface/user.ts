export enum UserRole {
  BUYER = 'buyer',
  SELLER = 'seller',
}

export interface IUserSearchParam {
  id?: string;
  username?: string;
}

export interface IUserInput {
  id?: string;
  username: string;
  password: string;
  role: UserRole;
  deposit: number;
  totalSpent: number;
}
