import type { ApiList, ApiObject } from "@/types";
import apiClient from "./client";

export interface Consignment {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address?: string;
  description: string;
  images: Array<{
    url: string;
    publicId: string;
    uploadedAt: string;
  }>;
  itemTitle?: string;
  category?: string;
  estimatedDate?: string;
  condition?: string;
  estimatedValue?: number;
  status: "new" | "reviewed" | "offered" | "accepted" | "declined";
  createdAt: string;
  updatedAt: string;
}

export interface ConsignmentListParams {
  status?: string;
  page?: number;
  limit?: number;
}

export const consignmentsApi = {
  list: async (params: ConsignmentListParams = {}) => {
    const { data } = await apiClient.get<ApiList<Consignment>>("/admin/consignments", { params });

    return data;
  },

  get: async (id: string) => {
    const { data } = await apiClient.get<ApiObject<{ consignment: Consignment }>>(
      `/admin/consignments/${id}`,
    );

    return data.data.consignment;
  },

  updateStatus: async (id: string, status: string) => {
    const { data } = await apiClient.put<ApiObject<{ consignment: Consignment }>>(
      `/admin/consignments/${id}`,
      { status },
    );

    return data.data.consignment;
  },

  remove: async (id: string) => {
    await apiClient.delete(`/admin/consignments/${id}`);
  },

  exportUrl: (format: "csv" = "csv") =>
    `${
      import.meta.env.VITE_API_URL ?? "http://localhost:5000"
    }/api/v1/admin/consignments/export/${format}`,

  exportDownload: async (format: "csv" = "csv") => {
    const res = await apiClient.get(`/admin/consignments/export/${format}`, {
      responseType: "blob",
    });

    return res.data as Blob;
  },
};
