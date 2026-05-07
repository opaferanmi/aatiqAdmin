import { createFileRoute } from "@tanstack/react-router";
import { PageSEOPage } from "@/pages/PageSEOPage";

export const Route = createFileRoute("/dashboard/seo/pages")({
  component: PageSEOPage,
});
