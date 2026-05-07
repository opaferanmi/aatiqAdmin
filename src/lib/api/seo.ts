import apiClient from "./client";
import type { ApiObject, EntitySEO, GlobalSEO, PageSEO, Redirect } from "@/types";

export const seoApi = {
  getGlobal: async () => {
    const { data } = await apiClient.get<ApiObject<{ settings: GlobalSEO }>>("/admin/seo/global");
    return data.data.settings;
  },
  updateGlobal: async (payload: Partial<GlobalSEO>) => {
    const { data } = await apiClient.put<ApiObject<{ settings: GlobalSEO }>>(
      "/admin/seo/global",
      payload,
    );
    return data.data.settings;
  },
  listPages: async () => {
    const { data } = await apiClient.get<ApiObject<{ pages: PageSEO[] }>>("/admin/seo/pages");
    return data.data.pages;
  },
  createPage: async (payload: Partial<PageSEO>) => {
    const { data } = await apiClient.post<ApiObject<{ page: PageSEO }>>(
      "/admin/seo/pages",
      payload,
    );
    return data.data.page;
  },
  updatePage: async (id: string, payload: Partial<PageSEO>) => {
    const { data } = await apiClient.put<ApiObject<{ page: PageSEO }>>(
      `/admin/seo/pages/${id}`,
      payload,
    );
    return data.data.page;
  },
  getProductSeo: async (productId: string) => {
    const { data } = await apiClient.get<ApiObject<{ seo: EntitySEO }>>(
      `/admin/seo/products/${productId}`,
    );
    return data.data.seo;
  },
  updateProductSeo: async (productId: string, payload: Partial<EntitySEO>) => {
    const { data } = await apiClient.put<ApiObject<{ seo: EntitySEO }>>(
      `/admin/seo/products/${productId}`,
      payload,
    );
    return data.data.seo;
  },
  getCategorySeo: async (categoryId: string) => {
    const { data } = await apiClient.get<ApiObject<{ seo: EntitySEO }>>(
      `/admin/seo/categories/${categoryId}`,
    );
    return data.data.seo;
  },
  updateCategorySeo: async (categoryId: string, payload: Partial<EntitySEO>) => {
    const { data } = await apiClient.put<ApiObject<{ seo: EntitySEO }>>(
      `/admin/seo/categories/${categoryId}`,
      payload,
    );
    return data.data.seo;
  },
  generateSitemap: async () => {
    const { data } = await apiClient.post<ApiObject<{ message: string; sitemapUrl: string }>>(
      "/admin/seo/generate-sitemap",
    );
    return data.data;
  },
  listRedirects: async () => {
    const { data } =
      await apiClient.get<ApiObject<{ redirects: Redirect[] }>>("/admin/seo/redirects");
    return data.data.redirects;
  },
  createRedirect: async (payload: { fromUrl: string; toUrl: string; type: "301" | "302" }) => {
    const { data } = await apiClient.post<ApiObject<{ redirect: Redirect }>>(
      "/admin/seo/redirects",
      payload,
    );
    return data.data.redirect;
  },
  removeRedirect: async (id: string) => {
    await apiClient.delete(`/admin/seo/redirects/${id}`);
  },
};
