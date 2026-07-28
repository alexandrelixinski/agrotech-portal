import { useCallback, useEffect, useState } from 'react'

import { listVendas } from '@/services/vendas'
import type { Venda } from '@/types'

type UseVendasResult = {
  vendas: Venda[]
  loading: boolean
  error: string | null
  refetch: () => void
}

export function useVendas(): UseVendasResult {
  const [vendas, setVendas] = useState<Venda[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [version, setVersion] = useState(0)

  useEffect(() => {
    let active = true
    setLoading(true)

    listVendas()
      .then((data) => {
        if (active) setVendas(data)
      })
      .catch((err: unknown) => {
        if (active) setError(err instanceof Error ? err.message : 'Erro inesperado')
      })
      .finally(() => {
        if (active) setLoading(false)
      })

    return () => {
      active = false
    }
  }, [version])

  const refetch = useCallback(() => setVersion((v) => v + 1), [])

  return { vendas, loading, error, refetch }
}
