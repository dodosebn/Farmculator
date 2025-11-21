import FarmAdvisor from "@/components/in/farmAdivisor";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/in/farm-advisor")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="py-8">
      <FarmAdvisor />
    </div>
  );
}
