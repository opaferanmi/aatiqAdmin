import { createFileRoute, Navigate } from "@tanstack/react-router";
import { LoginPage } from "@/pages/LoginPage";
import { useAuthStore } from "@/lib/store/authStore";

export const Route = createFileRoute("/login")({
  component: LoginRoute,
});

function LoginRoute() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  if (isAuthenticated) return <Navigate to="/dashboard" />;
  return <LoginPage />;
}
