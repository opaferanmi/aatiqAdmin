import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import apiClient from "../api/client";
import { ConsignmentStatus, IConsignment } from "@/types";

interface ConsignmentsFilter {
  status?: ConsignmentStatus;
  page?: number;
  limit?: number;
}

export function useConsignments(filters: ConsignmentsFilter = {}) {
  return useQuery({
    queryKey: ["consignments", filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filters.status) params.append("status", filters.status);
      if (filters.page) params.append("page", String(filters.page));
      if (filters.limit) params.append("limit", String(filters.limit));

      const response = await apiClient.get(`/admin/consignments?${params.toString()}`);
      return response.data;
    },
  });
}

export function useConsignment(id: string) {
  return useQuery({
    queryKey: ["consignments", id],
    queryFn: async () => {
      if (!id) return null;
      const response = await apiClient.get(`/admin/consignments/${id}`);
      return response.data?.data.consignment as IConsignment;
    },
    enabled: !!id,
  });
}

export function useUpdateConsignmentStatus(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { status: ConsignmentStatus }) => {
      const response = await apiClient.put(`/admin/consignments/${id}`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["consignments", id] });
      queryClient.invalidateQueries({ queryKey: ["consignments"] });
    },
  });
}

export function useDeleteConsignment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await apiClient.delete(`/consignments/${id}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["consignments"] });
    },
  });
}
