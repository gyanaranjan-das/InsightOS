import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  avatarUrl?: string;
  mfaEnabled?: boolean;
}

export interface Organization {
  id: string;
  name: string;
  slug: string;
  plan: string;
}

interface AuthState {
  user: User | null;
  org: Organization | null;
  isAuthenticated: boolean;
  setAuth: (user: User, org: Organization | null, accessToken: string, refreshToken: string) => void;
  updateUser: (user: Partial<User>) => void;
  updateOrg: (org: Partial<Organization>) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      org: null,
      isAuthenticated: false,

      setAuth: (user, org, accessToken, refreshToken) => {
        localStorage.setItem('insightos_access_token', accessToken);
        localStorage.setItem('insightos_refresh_token', refreshToken);
        set({ user, org, isAuthenticated: true });
      },

      updateUser: (updates) => {
        set((state) => ({
          user: state.user ? { ...state.user, ...updates } : null,
        }));
      },

      updateOrg: (updates) => {
        set((state) => ({
          org: state.org ? { ...state.org, ...updates } : null,
        }));
      },

      logout: () => {
        localStorage.removeItem('insightos_access_token');
        localStorage.removeItem('insightos_refresh_token');
        set({ user: null, org: null, isAuthenticated: false });
      },
    }),
    {
      name: 'insightos-auth-storage',
    }
  )
);
