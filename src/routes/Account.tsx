import AuthUI from '@/components/authUI'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/Account')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>
    <AuthUI />
  </div>
}
