import apiClient from "./client";
import type { Admin } from "@/types";

export interface LoginResponse {
  admin: Admin;
  accessToken: string;
  refreshToken: string;
}

export const authApi = {
  login: async (email: string, password: string) => {
    const { data } = await apiClient.post<{ success: boolean; data: LoginResponse }>(
      "/admin/auth/login",
      { email, password },
    );
    return data.data;
  },
  logout: async () => {
    try {
      await apiClient.post("/admin/auth/logout");
    } catch {
      /* ignore */
    }
  },
};
