import { createFileRoute } from "@tanstack/react-router";
import { ConsignmentsPage } from "@/pages/Consignmentspage";

export const Route = createFileRoute("/dashboard/consignments/")({
  component: ConsignmentsPage,
});
