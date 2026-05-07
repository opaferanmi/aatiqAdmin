import apiClient from "./client";
import type { ApiList, ApiObject, Enquiry, EnquiryStatus } from "@/types";

export interface EnquiryListParams {
  status?: EnquiryStatus;
  page?: number;
  limit?: number;
}

export const enquiriesApi = {
  list: async (params: EnquiryListParams = {}) => {
    const { data } = await apiClient.get<ApiList<Enquiry>>("/admin/enquiries", { params });
    return data;
  },
  get: async (id: string) => {
    const { data } = await apiClient.get<ApiObject<{ enquiry: Enquiry }>>(`/admin/enquiries/${id}`);
    return data.data.enquiry;
  },
  updateStatus: async (id: string, status: EnquiryStatus, adminNotes?: string) => {
    const { data } = await apiClient.put<ApiObject<{ enquiry: Enquiry }>>(
      `/admin/enquiries/${id}/status`,
      { status, adminNotes },
    );
    return data.data.enquiry;
  },
  remove: async (id: string) => {
    await apiClient.delete(`/admin/enquiries/${id}`);
  },
  exportUrl: (format: "csv" | "excel" = "csv") =>
    `${import.meta.env.VITE_API_URL ?? "http://localhost:5000"}/api/v1/admin/enquiries/export?format=${format}`,
  exportDownload: async (format: "csv" | "excel" = "csv") => {
    const res = await apiClient.get(`/admin/enquiries/export`, {
      params: { format },
      responseType: "blob",
    });
    return res.data as Blob;
  },
};
