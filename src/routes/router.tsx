import { createBrowserRouter } from 'react-router-dom'

import { AppLayout } from '@/components/layout/AppLayout'
import { AboutPage } from '@/pages/AboutPage'
import { DashboardPage } from '@/pages/DashboardPage'
import { HomePage } from '@/pages/HomePage'
import { NotFoundPage } from '@/pages/NotFoundPage'
import { ROUTES } from '@/routes/paths'

export const router = createBrowserRouter([
  {
    path: ROUTES.home,
    element: <AppLayout />,
    errorElement: <NotFoundPage />,
    children: [
      { index: true, element: <HomePage /> },
      { path: ROUTES.dashboard, element: <DashboardPage /> },
      { path: ROUTES.about, element: <AboutPage /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
])
