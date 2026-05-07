import { createFileRoute } from "@tanstack/react-router";
import { ContentPage } from "@/pages/ContentPage";

export const Route = createFileRoute("/dashboard/content/")({
  component: ContentPage,
});
