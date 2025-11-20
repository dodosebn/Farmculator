import HeadLine from "@/components/in/customs/headLine";
import Interacto from "@/components/in/interacto";
import SaleRecorder from "@/components/in/saleRecorder";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/in/Dashboard")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="overflow-y-scroll h-screen pt-5">
            <HeadLine />
      <Interacto />
      <SaleRecorder />
    </div>
  );
}
