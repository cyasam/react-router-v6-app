export type UserRole = 'admin' | 'user' | 'guest';

export interface User {
  id: string;
  email: string;
  password: string;
  name: string;
  role: UserRole;
  createdAt: number;
}

export interface UserWithoutPassword {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  createdAt: number;
}
