import { createFileRoute } from "@tanstack/react-router";
import { EnquiriesPage } from "@/pages/EnquiriesPage";

export const Route = createFileRoute("/dashboard/enquiries/")({
  component: EnquiriesPage,
});
