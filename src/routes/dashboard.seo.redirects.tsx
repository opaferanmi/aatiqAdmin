import { createFileRoute } from "@tanstack/react-router";
import { RedirectsPage } from "@/pages/RedirectsPage";

export const Route = createFileRoute("/dashboard/seo/redirects")({
  component: RedirectsPage,
});
