import { createFileRoute } from "@tanstack/react-router";
import { CreateProductPage } from "@/pages/CreateProductPage";

export const Route = createFileRoute("/dashboard/products/create")({
  component: CreateProductPage,
});
