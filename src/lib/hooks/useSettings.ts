import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { settingsApi } from "@/lib/api/settings";
import type { Admin, SiteSettings } from "@/types";

export function useSiteSettings() {
  return useQuery({ queryKey: ["admin-settings"], queryFn: settingsApi.getSite });
}
export function useUpdateSiteSettings() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (p: Partial<SiteSettings>) => settingsApi.updateSite(p),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-settings"] }),
  });
}

export function useAdminUsers() {
  return useQuery({ queryKey: ["admin-users"], queryFn: settingsApi.listAdminUsers });
}
export function useCreateAdminUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (p: Partial<Admin> & { password: string }) => settingsApi.createAdminUser(p),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-users"] }),
  });
}
export function useUpdateAdminUser(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (p: Partial<Admin> & { password?: string }) => settingsApi.updateAdminUser(id, p),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-users"] }),
  });
}
export function useDeleteAdminUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => settingsApi.removeAdminUser(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-users"] }),
  });
}
