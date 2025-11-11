import { HeadContent, Outlet, Scripts, createRootRoute, useMatches } from '@tanstack/react-router'

import appCss from '../styles.css?url'
import NavBar from '@/components/home/nav/navBar'

export const Route = createRootRoute({
  head: () => ({
    meta: [
      {
        charSet: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      {
        title: "Dodo's Farm",
      },
    ],
    links: [
      {
        rel: 'stylesheet',
        href: appCss,
      },
    ],
  }),

  component: RootDocument,
})

function RootDocument() {
  const matches = useMatches()
  
  const hideNav = matches.some(match => 
    match.pathname.startsWith('/in')
  )

  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {!hideNav && <NavBar />}
        <Outlet />
        <Scripts />
      </body>
    </html>
  )
}