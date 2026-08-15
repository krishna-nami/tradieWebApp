import { setAccesstoken } from "@/lib/api";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export type UserRole = "CUSTOMER" | "TRADIE";
export interface AuthUser {
  id: string;
  email: string;
  role: UserRole;
  isVerified: boolean;
  profile: {
    firstName: string;
    lastName: string;
    phone: string | null;
    avatarUrl: string;
  };
}
interface AuthState {
  user: AuthUser | null;
  isAuthenticated: boolean;
  hasHydrated: boolean;

  login: (user: AuthUser, accessToken: string) => void;
  logout: () => void;
  setUser: (user: AuthUser) => void;
  setHasHydrated: (state: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      hasHydrated: false,

      login: (user, accessToken) => {
        setAccesstoken(accessToken);
        set({ user, isAuthenticated: true });
      },

      logout: () => {
        setAccesstoken(null);
        set({ user: null, isAuthenticated: false });
      },
      setUser: (user) => set({ user }),
      setHasHydrated: (state) => set({ hasHydrated: state }),
    }),
    {
      name: "tradiehub-auth",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    },
  ),
);
