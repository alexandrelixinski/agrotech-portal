export const APP_NAME = 'AgroTech Portal'
export const APP_VERSION = '0.1.0'

/**
 * URL base da API. Configure em `.env.local` (dev) e nas
 * Environment Variables do projeto na Vercel (produção).
 */
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? ''
