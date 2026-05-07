import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { categoriesApi } from "@/lib/api/categories";
import type { Category, Subcategory } from "@/types";

export function useCategories() {
  return useQuery({
    queryKey: ["admin-categories"],
    queryFn: () => categoriesApi.list(),
  });
}

export function useCategory(id: string | undefined) {
  return useQuery({
    queryKey: ["admin-category", id],
    queryFn: () => categoriesApi.get(id!),
    enabled: !!id,
  });
}

export function useCreateCategory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: Partial<Category>) => categoriesApi.create(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-categories"] }),
  });
}

export function useUpdateCategory(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: Partial<Category>) => categoriesApi.update(id, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-categories"] });
      qc.invalidateQueries({ queryKey: ["admin-category", id] });
    },
  });
}

export function useDeleteCategory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => categoriesApi.remove(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-categories"] }),
  });
}

export function useCreateSubcategory(categoryId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: Partial<Subcategory>) =>
      categoriesApi.createSubcategory(categoryId, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-categories"] });
      qc.invalidateQueries({ queryKey: ["admin-category", categoryId] });
    },
  });
}

export function useUpdateSubcategory(categoryId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ subId, payload }: { subId: string; payload: Partial<Subcategory> }) =>
      categoriesApi.updateSubcategory(categoryId, subId, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-categories"] });
      qc.invalidateQueries({ queryKey: ["admin-category", categoryId] });
    },
  });
}

export function useDeleteSubcategory(categoryId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (subId: string) => categoriesApi.removeSubcategory(categoryId, subId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-categories"] });
      qc.invalidateQueries({ queryKey: ["admin-category", categoryId] });
    },
  });
}
