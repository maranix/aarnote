import { AuthService } from '@/services/authService';
import type { AuthError } from '@/types/auth';
import { create } from 'zustand';

interface AuthState {
  session: string | null;
  isLoading: boolean;
  error: AuthError | null;
  signIn: (username: string, password: string) => Promise<boolean>;
  signUp: (username: string, password: string) => Promise<boolean>;
  signOut: () => void;
  clearError: () => void;
  initializeSession: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  session: null,
  isLoading: false,
  error: null,

  initializeSession: () => {
    const currentUser = AuthService.getCurrentUser();
    if (currentUser) {
      set({ session: currentUser });
    }
  },

  signIn: async (username: string, password: string) => {
    set({ isLoading: true, error: null });

    const result = await AuthService.signIn(username, password);

    if ('message' in result) {
      // Error case
      set({ error: result, isLoading: false });
      return false;
    }

    // Success case
    set({ session: result.username, isLoading: false, error: null });
    return true;
  },

  signUp: async (username: string, password: string) => {
    set({ isLoading: true, error: null });

    const result = await AuthService.signUp(username, password);

    if ('message' in result) {
      // Error case
      set({ error: result, isLoading: false });
      return false;
    }

    // Success case
    set({ session: result.username, isLoading: false, error: null });
    return true;
  },

  signOut: () => {
    AuthService.signOut();
    set({ session: null, error: null });
  },

  clearError: () => {
    set({ error: null });
  },
}));
