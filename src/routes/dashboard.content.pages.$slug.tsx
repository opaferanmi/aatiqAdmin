import { createFileRoute } from "@tanstack/react-router";
import { EditPagePage } from "@/pages/EditPagePage";

export const Route = createFileRoute("/dashboard/content/pages/$slug")({
  component: EditPagePage,
});
