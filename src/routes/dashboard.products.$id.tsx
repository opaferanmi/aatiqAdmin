import { createFileRoute } from "@tanstack/react-router";
import { EditProductPage } from "@/pages/EditProductPage";

export const Route = createFileRoute("/dashboard/products/$id")({
  component: EditProductPage,
});
