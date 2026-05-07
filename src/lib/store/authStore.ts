import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Admin } from "@/types";

interface AuthState {
  admin: Admin | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  hasHydrated: boolean; // ← add
  setHasHydrated: (val: boolean) => void; // ← add
  setAuth: (data: { admin: Admin; accessToken: string; refreshToken: string }) => void;
  setTokens: (tokens: { accessToken: string; refreshToken: string }) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      admin: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      hasHydrated: false, // ← add
      setHasHydrated: (val) => set({ hasHydrated: val }), // ← add
      setAuth: ({ admin, accessToken, refreshToken }) =>
        set({ admin, accessToken, refreshToken, isAuthenticated: true }),
      setTokens: ({ accessToken, refreshToken }) => set({ accessToken, refreshToken }),
      logout: () =>
        set({ admin: null, accessToken: null, refreshToken: null, isAuthenticated: false }),
    }),
    {
      name: "antiques-admin-auth",
      onRehydrateStorage: () => (state) => {
        // ← add
        state?.setHasHydrated(true);
      },
    },
  ),
);
