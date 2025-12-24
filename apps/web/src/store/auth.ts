import { create } from 'zustand';
import { JWTPayload } from '@ghl-task/types';

interface AuthStore {
  user: JWTPayload | null;
  token: string | null;
  isLoading: boolean;
  setUser: (user: JWTPayload | null) => void;
  setToken: (token: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  token: null,
  isLoading: true,
  setUser: (user) => set({ user }),
  setToken: (token) => {
    set({ token });
    if (typeof window !== 'undefined') {
      localStorage.setItem('access_token', token);
    }
  },
  logout: () => {
    set({ user: null, token: null });
    if (typeof window !== 'undefined') {
      localStorage.removeItem('access_token');
    }
  },
}));
