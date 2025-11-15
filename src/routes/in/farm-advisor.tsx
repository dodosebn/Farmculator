import FarmAdvisor from '@/components/in/farmAdivisor'
import Interacto from '@/components/in/interacto'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/in/farm-advisor')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div className='py-8'>
        <Interacto />
    <FarmAdvisor />
  </div>
}
