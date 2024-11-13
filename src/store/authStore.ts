import { create } from 'zustand';
import { User } from '../types';

interface AuthState {
  user: User | null;
  login: (username: string, password: string) => boolean;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  login: (username, password) => {
    if (username === 'admin' && password === 'admin') {
      set({
        user: {
          id: '1',
          username: 'admin',
          role: 'admin',
          name: 'Administrator'
        }
      });
      return true;
    }
    return false;
  },
  logout: () => set({ user: null })
}));