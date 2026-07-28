export const ROUTES = {
  home: '/',
  dashboard: '/dashboard',
  about: '/sobre',
} as const

export type RoutePath = (typeof ROUTES)[keyof typeof ROUTES]
