import apiClient from "./client";
import type { ApiObject, HomepageContent, StaticPage } from "@/types";

export const contentApi = {
  getHomepage: async () => {
    const { data } =
      await apiClient.get<ApiObject<{ content: HomepageContent }>>("/admin/content/homepage");
    return data.data.content;
  },
  updateHomepage: async (payload: HomepageContent) => {
    const { data } = await apiClient.put<ApiObject<{ content: HomepageContent }>>(
      "/admin/content/homepage",
      payload,
    );
    return data.data.content;
  },
  getPage: async (slug: string) => {
    const { data } = await apiClient.get<ApiObject<{ page: StaticPage }>>(
      `/admin/content/pages/${slug}`,
    );
    return data.data.page;
  },
  updatePage: async (slug: string, payload: Partial<StaticPage>) => {
    const { data } = await apiClient.put<ApiObject<{ page: StaticPage }>>(
      `/admin/content/pages/${slug}`,
      payload,
    );
    return data.data.page;
  },
  createPage: async (payload: StaticPage) => {
    const { data } = await apiClient.post<ApiObject<{ page: StaticPage }>>(
      "/admin/content/pages",
      payload,
    );
    return data.data.page;
  },
};
