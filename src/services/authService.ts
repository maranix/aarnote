import { storage, STORAGE_KEYS } from '@/services/storage';
import type { AuthError, User } from '@/types/auth';
import { hashPassword, verifyPassword } from '@/utils/crypto';

export class AuthService {
  private static getUsers(): User[] {
    const usersJson = storage.getString(STORAGE_KEYS.USERS);
    return usersJson ? JSON.parse(usersJson) : [];
  }

  private static saveUsers(users: User[]): void {
    storage.set(STORAGE_KEYS.USERS, JSON.stringify(users));
  }

  static async signUp(username: string, password: string): Promise<User | AuthError> {
    // Validation
    if (!username || username.trim().length === 0) {
      return { message: 'Username is required', field: 'username' };
    }

    if (username.length < 3) {
      return { message: 'Username must be at least 3 characters', field: 'username' };
    }

    if (!password || password.length === 0) {
      return { message: 'Password is required', field: 'password' };
    }

    if (password.length < 6) {
      return { message: 'Password must be at least 6 characters', field: 'password' };
    }

    // Check if username already exists
    const users = this.getUsers();
    const existingUser = users.find((u) => u.username === username.trim());

    if (existingUser) {
      return { message: 'Username already exists', field: 'username' };
    }

    // Create new user
    const passwordHash = await hashPassword(password);
    const newUser: User = {
      username: username.trim(),
      passwordHash,
      createdAt: Date.now(),
    };

    users.push(newUser);
    this.saveUsers(users);

    // Set current user
    storage.set(STORAGE_KEYS.CURRENT_USER, username.trim());

    return newUser;
  }

  static async signIn(username: string, password: string): Promise<User | AuthError> {
    // Validation
    if (!username || username.trim().length === 0) {
      return { message: 'Username is required', field: 'username' };
    }

    if (!password || password.length === 0) {
      return { message: 'Password is required', field: 'password' };
    }

    // Find user
    const users = this.getUsers();
    const user = users.find((u) => u.username === username.trim());

    if (!user) {
      return { message: 'Invalid username or password', field: 'username' };
    }

    // Verify password
    const isValid = await verifyPassword(password, user.passwordHash);

    if (!isValid) {
      return { message: 'Invalid username or password', field: 'password' };
    }

    // Set current user
    storage.set(STORAGE_KEYS.CURRENT_USER, username.trim());

    return user;
  }

  static signOut(): void {
    storage.remove(STORAGE_KEYS.CURRENT_USER);
  }

  static getCurrentUser(): string | null {
    return storage.getString(STORAGE_KEYS.CURRENT_USER) ?? null;
  }

  static isUsernameTaken(username: string): boolean {
    const users = this.getUsers();
    return users.some((u) => u.username === username.trim());
  }
}
