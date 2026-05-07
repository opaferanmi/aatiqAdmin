import apiClient from "./client";
import type { AgeRange, ApiObject } from "@/types";

export const ageRangesApi = {
  list: async () => {
    const { data } = await apiClient.get<ApiObject<{ ageRanges: AgeRange[] }>>("/admin/age-ranges");
    return data.data.ageRanges;
  },
  create: async (payload: Partial<AgeRange>) => {
    const { data } = await apiClient.post<ApiObject<{ ageRange: AgeRange }>>(
      "/admin/age-ranges",
      payload,
    );
    return data.data.ageRange;
  },
  update: async (id: string, payload: Partial<AgeRange>) => {
    const { data } = await apiClient.put<ApiObject<{ ageRange: AgeRange }>>(
      `/admin/age-ranges/${id}`,
      payload,
    );
    return data.data.ageRange;
  },
  remove: async (id: string) => {
    await apiClient.delete(`/admin/age-ranges/${id}`);
  },
};
