export interface User {
  username: string;
  passwordHash: string;
  createdAt: number;
}

export interface AuthError {
  message: string;
  field?: 'username' | 'password';
}
