import { createFileRoute } from "@tanstack/react-router";
import { EnquiryDetailPage } from "@/pages/EnquiryDetailPage";

export const Route = createFileRoute("/dashboard/enquiries/$id")({
  component: EnquiryDetailPage,
});
