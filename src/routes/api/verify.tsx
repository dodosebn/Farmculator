import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/api/verify')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/api/verify"!</div>
}
