import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ageRangesApi } from "@/lib/api/ageRanges";
import type { AgeRange } from "@/types";

export function useAgeRanges() {
  return useQuery({
    queryKey: ["admin-age-ranges"],
    queryFn: () => ageRangesApi.list(),
  });
}

export function useCreateAgeRange() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: Partial<AgeRange>) => ageRangesApi.create(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-age-ranges"] }),
  });
}

export function useUpdateAgeRange(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: Partial<AgeRange>) => ageRangesApi.update(id, payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-age-ranges"] }),
  });
}

export function useDeleteAgeRange() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => ageRangesApi.remove(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-age-ranges"] }),
  });
}
