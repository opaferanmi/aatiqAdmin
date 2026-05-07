import { createFileRoute } from "@tanstack/react-router";
import { EditCategoryPage } from "@/pages/EditCategoryPage";

export const Route = createFileRoute("/dashboard/categories/$id")({
  component: EditCategoryPage,
});
