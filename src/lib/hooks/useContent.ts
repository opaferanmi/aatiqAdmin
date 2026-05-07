import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { contentApi } from "@/lib/api/content";
import type { HomepageContent, StaticPage } from "@/types";

export function useHomepage() {
  return useQuery({ queryKey: ["admin-homepage"], queryFn: contentApi.getHomepage });
}
export function useUpdateHomepage() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (p: HomepageContent) => contentApi.updateHomepage(p),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-homepage"] }),
  });
}

export function useStaticPage(slug: string | undefined) {
  return useQuery({
    queryKey: ["admin-page-content", slug],
    queryFn: () => contentApi.getPage(slug!),
    enabled: !!slug,
  });
}

export function useUpdateStaticPage(slug: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (p: Partial<StaticPage>) => contentApi.updatePage(slug, p),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-page-content", slug] }),
  });
}

export function useCreateStaticPage() {
  return useMutation({ mutationFn: (p: StaticPage) => contentApi.createPage(p) });
}
