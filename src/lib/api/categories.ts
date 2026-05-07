import apiClient from "./client";
import type { ApiObject, Category, Subcategory } from "@/types";

export const categoriesApi = {
  list: async () => {
    const { data } =
      await apiClient.get<ApiObject<{ categories: Category[] }>>("/admin/categories");
    return data.data.categories;
  },
  get: async (id: string) => {
    const { data } = await apiClient.get<ApiObject<{ category: Category }>>(
      `/admin/categories/${id}`,
    );
    return data.data.category;
  },
  create: async (payload: Partial<Category>) => {
    const { data } = await apiClient.post<ApiObject<{ category: Category }>>(
      "/admin/categories",
      payload,
    );
    return data.data.category;
  },
  update: async (id: string, payload: Partial<Category>) => {
    const { data } = await apiClient.put<ApiObject<{ category: Category }>>(
      `/admin/categories/${id}`,
      payload,
    );
    return data.data.category;
  },
  remove: async (id: string) => {
    await apiClient.delete(`/admin/categories/${id}`);
  },
  createSubcategory: async (categoryId: string, payload: Partial<Subcategory>) => {
    const { data } = await apiClient.post<ApiObject<{ subcategory: Subcategory }>>(
      `/admin/categories/${categoryId}/subcategories`,
      payload,
    );
    return data.data.subcategory;
  },
  updateSubcategory: async (categoryId: string, subId: string, payload: Partial<Subcategory>) => {
    const { data } = await apiClient.put<ApiObject<{ subcategory: Subcategory }>>(
      `/admin/categories/${categoryId}/subcategories/${subId}`,
      payload,
    );
    return data.data.subcategory;
  },
  removeSubcategory: async (categoryId: string, subId: string) => {
    await apiClient.delete(`/admin/categories/${categoryId}/subcategories/${subId}`);
  },
};
