import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { seoApi } from "@/lib/api/seo";
import type { EntitySEO, GlobalSEO, PageSEO } from "@/types";

export function useGlobalSeo() {
  return useQuery({ queryKey: ["admin-seo-global"], queryFn: seoApi.getGlobal });
}
export function useUpdateGlobalSeo() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (p: Partial<GlobalSEO>) => seoApi.updateGlobal(p),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-seo-global"] }),
  });
}

export function usePageSeoList() {
  return useQuery({ queryKey: ["admin-seo-pages"], queryFn: seoApi.listPages });
}
export function useCreatePageSeo() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (p: Partial<PageSEO>) => seoApi.createPage(p),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-seo-pages"] }),
  });
}
export function useUpdatePageSeo(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (p: Partial<PageSEO>) => seoApi.updatePage(id, p),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-seo-pages"] }),
  });
}

export function useProductSeo(productId: string | undefined) {
  return useQuery({
    queryKey: ["admin-seo-product", productId],
    queryFn: () => seoApi.getProductSeo(productId!),
    enabled: !!productId,
  });
}
export function useUpdateProductSeo(productId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (p: Partial<EntitySEO>) => seoApi.updateProductSeo(productId, p),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-seo-product", productId] }),
  });
}

export function useCategorySeo(categoryId: string | undefined) {
  return useQuery({
    queryKey: ["admin-seo-category", categoryId],
    queryFn: () => seoApi.getCategorySeo(categoryId!),
    enabled: !!categoryId,
  });
}
export function useUpdateCategorySeo(categoryId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (p: Partial<EntitySEO>) => seoApi.updateCategorySeo(categoryId, p),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-seo-category", categoryId] }),
  });
}

export function useGenerateSitemap() {
  return useMutation({ mutationFn: () => seoApi.generateSitemap() });
}

export function useRedirects() {
  return useQuery({ queryKey: ["admin-redirects"], queryFn: seoApi.listRedirects });
}
export function useCreateRedirect() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (p: { fromUrl: string; toUrl: string; type: "301" | "302" }) =>
      seoApi.createRedirect(p),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-redirects"] }),
  });
}
export function useDeleteRedirect() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => seoApi.removeRedirect(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-redirects"] }),
  });
}
