import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { enquiriesApi, type EnquiryListParams } from "@/lib/api/enquiries";
import type { EnquiryStatus } from "@/types";

export function useEnquiries(params: EnquiryListParams = {}) {
  return useQuery({
    queryKey: ["admin-enquiries", params],
    queryFn: () => enquiriesApi.list(params),
  });
}

export function useEnquiry(id: string | undefined) {
  return useQuery({
    queryKey: ["admin-enquiry", id],
    queryFn: () => enquiriesApi.get(id!),
    enabled: !!id,
  });
}

export function useUpdateEnquiryStatus(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: { status: EnquiryStatus; adminNotes?: string }) =>
      enquiriesApi.updateStatus(id, payload.status, payload.adminNotes),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-enquiries"] });
      qc.invalidateQueries({ queryKey: ["admin-enquiry", id] });
    },
  });
}

export function useDeleteEnquiry() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => enquiriesApi.remove(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-enquiries"] }),
  });
}
