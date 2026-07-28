import { createBrowserRouter } from 'react-router-dom'

import { AppLayout } from '@/components/layout/AppLayout'
import { AboutPage } from '@/pages/AboutPage'
import { FinancasPage } from '@/pages/FinancasPage'
import { GalpaoPage } from '@/pages/GalpaoPage'
import { HomePage } from '@/pages/HomePage'
import { NotFoundPage } from '@/pages/NotFoundPage'
import { RocaPage } from '@/pages/RocaPage'
import { ROUTES } from '@/routes/paths'

export const router = createBrowserRouter([
  {
    path: ROUTES.home,
    element: <AppLayout />,
    errorElement: <NotFoundPage />,
    children: [
      { index: true, element: <HomePage /> },
      { path: ROUTES.roca, element: <RocaPage /> },
      { path: ROUTES.galpao, element: <GalpaoPage /> },
      { path: ROUTES.financas, element: <FinancasPage /> },
      { path: ROUTES.about, element: <AboutPage /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
])
