import { createFileRoute } from "@tanstack/react-router";
import { HomepageEditorPage } from "@/pages/HomepageEditorPage";

export const Route = createFileRoute("/dashboard/content/homepage")({
  component: HomepageEditorPage,
});
