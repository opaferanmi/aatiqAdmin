import { createFileRoute } from "@tanstack/react-router";
import { ProductSEOPage } from "@/pages/ProductSEOPage";

export const Route = createFileRoute("/dashboard/seo/products")({
  component: ProductSEOPage,
});
