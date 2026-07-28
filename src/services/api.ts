import { API_BASE_URL } from '@/lib/constants'

type RequestOptions = RequestInit & {
  /** Caminho relativo, ex.: `/fields` */
  path: string
}

/**
 * Cliente HTTP mínimo. Substitua/estenda conforme a API real do portal.
 */
export async function apiRequest<T>({ path, ...init }: RequestOptions): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...init.headers,
    },
    ...init,
  })

  if (!response.ok) {
    throw new Error(`Falha na requisição ${path}: ${response.status}`)
  }

  return (await response.json()) as T
}
