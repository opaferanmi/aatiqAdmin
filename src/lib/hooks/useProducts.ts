import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { productsApi, type ProductListParams } from "@/lib/api/products";
import type { Product } from "@/types";
import apiClient from "../api/client";

export function useProducts(params: ProductListParams = {}) {
  return useQuery({
    queryKey: ["admin-products", params],
    queryFn: () => productsApi.list(params),
  });
}

export function useProduct(id: string | undefined) {
  return useQuery({
    queryKey: ["admin-product", id],
    queryFn: () => productsApi.get(id!),
    enabled: !!id,
  });
}
export function useToggleFeatured() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, isFeatured }: { id: string; isFeatured: boolean }) =>
      apiClient.put(`/admin/products/${id}`, { isFeatured }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-products"] }),
  });
}

export function useCreateProduct() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: Partial<Product>) => productsApi.create(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-products"] }),
  });
}

export function useUpdateProduct(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: Partial<Product>) => productsApi.update(id, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-products"] });
      qc.invalidateQueries({ queryKey: ["admin-product", id] });
    },
  });
}

export function useDeleteProduct() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => productsApi.remove(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-products"] }),
  });
}
