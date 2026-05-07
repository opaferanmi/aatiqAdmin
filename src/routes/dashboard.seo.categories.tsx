import { createFileRoute } from "@tanstack/react-router";
import { CategorySEOPage } from "@/pages/CategorySEOPage";

export const Route = createFileRoute("/dashboard/seo/categories")({
  component: CategorySEOPage,
});
