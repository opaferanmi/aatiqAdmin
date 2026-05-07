import apiClient from "./client";
import type { Admin, ApiObject, SiteSettings } from "@/types";

export const settingsApi = {
  getSite: async () => {
    const { data } =
      await apiClient.get<ApiObject<{ settings: SiteSettings }>>("/admin/settings/site");
    return data.data.settings;
  },
  updateSite: async (payload: Partial<SiteSettings>) => {
    const { data } = await apiClient.put<ApiObject<{ settings: SiteSettings }>>(
      "/admin/settings/site",
      payload,
    );
    return data.data.settings;
  },
  listAdminUsers: async () => {
    const { data } = await apiClient.get<ApiObject<{ users: Admin[] }>>(
      "/admin/settings/admin-users",
    );
    return data.data.users;
  },
  createAdminUser: async (payload: Partial<Admin> & { password: string }) => {
    const { data } = await apiClient.post<ApiObject<{ user: Admin }>>(
      "/admin/settings/admin-users",
      payload,
    );
    return data.data.user;
  },
  updateAdminUser: async (id: string, payload: Partial<Admin> & { password?: string }) => {
    const { data } = await apiClient.put<ApiObject<{ user: Admin }>>(
      `/admin/settings/admin-users/${id}`,
      payload,
    );
    return data.data.user;
  },
  removeAdminUser: async (id: string) => {
    await apiClient.delete(`/admin/settings/admin-users/${id}`);
  },
};
