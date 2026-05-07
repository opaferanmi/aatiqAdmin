import { useEffect, useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useAuthStore } from "@/lib/store/authStore";
import { LoadingSpinner } from "@/components/ui-extras/LoadingSpinner";

export const Route = createFileRoute("/")({
  component: IndexRoute,
  ssr: false,
});

function IndexRoute() {
  const navigate = useNavigate();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setReady(true);
    navigate({ to: isAuthenticated ? "/dashboard" : "/login", replace: true });
  }, [isAuthenticated, navigate]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <LoadingSpinner />
      <span className="sr-only">{ready ? "Redirecting" : "Loading"}</span>
    </div>
  );
}
