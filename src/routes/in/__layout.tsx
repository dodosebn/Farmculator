import { Outlet, createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/in/__layout')({
  component: DashboardLayout,
})

function DashboardLayout() {
  return (
    <div className="dashboard-root">
      <main>
        <Outlet />
      </main>
    </div>
  )
}


