import { create } from 'zustand';

interface AuthState {
  session: string | null;
  isLoading: boolean;
  signIn: () => void;
  signUp: () => void;
  signOut: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  session: null,
  isLoading: false,
  signIn: () => {
    set({ isLoading: true });
    // Simulate API call
    setTimeout(() => {
      set({ session: 'dummy-session-token', isLoading: false });
    }, 1000);
  },
  signUp: () => {
    set({ isLoading: true });
    // Simulate API call
    setTimeout(() => {
      set({ session: 'dummy-session-token', isLoading: false });
    }, 1000);
  },
  signOut: () => {
    set({ session: null });
  },
}));
