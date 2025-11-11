import Headers from '@/components/in/headers'
import Interacto from '@/components/in/interacto'
import TrackSales from '@/components/in/trackSales'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/in/Dashboard')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>
    <Headers />
    <Interacto />
    <TrackSales />
  </div>
}
