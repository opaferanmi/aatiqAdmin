import apiClient from "./client";
import type { ApiList, ApiObject, Product } from "@/types";

export interface ProductListParams {
  page?: number;
  limit?: number;
  type?: string;
  category?: string;
  search?: string;
}

export const productsApi = {
  list: async (params: ProductListParams = {}) => {
    const { data } = await apiClient.get<ApiList<Product>>("/admin/products", { params });
    return data;
  },
  get: async (id: string) => {
    const { data } = await apiClient.get<ApiObject<{ product: Product }>>(`/admin/products/${id}`);
    return data.data.product;
  },
  create: async (payload: Partial<Product>) => {
    const { data } = await apiClient.post<ApiObject<{ product: Product }>>(
      "/admin/products",
      payload,
    );
    return data.data.product;
  },
  update: async (id: string, payload: Partial<Product>) => {
    const { data } = await apiClient.put<ApiObject<{ product: Product }>>(
      `/admin/products/${id}`,
      payload,
    );
    return data.data.product;
  },
  remove: async (id: string) => {
    await apiClient.delete(`/admin/products/${id}`);
  },
};
