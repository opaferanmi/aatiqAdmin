import { createFileRoute } from "@tanstack/react-router";
import { StaticPagesPage } from "@/pages/StaticPagesPage";

export const Route = createFileRoute("/dashboard/content/pages/")({
  component: StaticPagesPage,
});
