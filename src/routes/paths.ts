export const ROUTES = {
  home: '/',
  roca: '/roca',
  galpao: '/galpao',
  financas: '/financas',
  about: '/sobre',
} as const

export type RoutePath = (typeof ROUTES)[keyof typeof ROUTES]
