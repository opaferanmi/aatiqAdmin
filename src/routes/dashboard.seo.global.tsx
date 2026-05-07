import { createFileRoute } from "@tanstack/react-router";
import { GlobalSEOPage } from "@/pages/GlobalSEOPage";

export const Route = createFileRoute("/dashboard/seo/global")({
  component: GlobalSEOPage,
});
