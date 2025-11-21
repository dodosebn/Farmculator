import Dashboard from "@/components/account/dashboard";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/Account")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div>
      <Dashboard />
    </div>
  );
}
