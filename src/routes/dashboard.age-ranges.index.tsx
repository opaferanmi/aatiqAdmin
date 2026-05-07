import { createFileRoute } from "@tanstack/react-router";
import { AgeRangesPage } from "@/pages/AgeRangesPage";

export const Route = createFileRoute("/dashboard/age-ranges/")({
  component: AgeRangesPage,
});
