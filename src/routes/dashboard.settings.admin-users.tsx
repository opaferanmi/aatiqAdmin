import { createFileRoute } from "@tanstack/react-router";
import { AdminUsersPage } from "@/pages/AdminUsersPage";

export const Route = createFileRoute("/dashboard/settings/admin-users")({
  component: AdminUsersPage,
});
