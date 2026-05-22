import { ConsignmentDetailPage } from "@/pages/Consignmentdetailpage";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/dashboard/consignments/$id")({
  component: ConsignmentDetailPage,
});
