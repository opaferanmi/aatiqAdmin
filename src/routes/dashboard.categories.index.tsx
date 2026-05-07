import { createFileRoute } from "@tanstack/react-router";
import { CategoriesPage } from "@/pages/CategoriesPage";

export const Route = createFileRoute("/dashboard/categories/")({
  component: CategoriesPage,
});
