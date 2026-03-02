import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { isTokenValid } from '../utils/jwt';

interface AuthState {
  token: string | null;
  login: (token: string) => void;
  logout: () => void;
  isAuthenticated: () => boolean;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      token: null,

      login: (token: string) => set({ token }),

      logout: () => set({ token: null }),

      isAuthenticated: () => {
        const token = get().token;
        if (!token) return false;
        if (!isTokenValid(token)) {
          set({ token: null });
          return false;
        }
        return true;
      },
    }),
    {
      name: 'caldos-admin-auth',
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
