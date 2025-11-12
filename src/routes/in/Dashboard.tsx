import Interacto from '@/components/in/interacto'
import SaleRecorder from '@/components/in/saleRecorder'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/in/Dashboard')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>
    <Interacto />
    <SaleRecorder />
  </div>
}
