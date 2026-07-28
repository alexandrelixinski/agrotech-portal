import { useCallback, useEffect, useState } from 'react'

import { listLotes } from '@/services/lotes'
import type { Lote } from '@/types'

type UseLotesResult = {
  lotes: Lote[]
  loading: boolean
  error: string | null
  refetch: () => void
}

export function useLotes(): UseLotesResult {
  const [lotes, setLotes] = useState<Lote[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [version, setVersion] = useState(0)

  useEffect(() => {
    let active = true
    setLoading(true)

    listLotes()
      .then((data) => {
        if (active) setLotes(data)
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

  return { lotes, loading, error, refetch }
}
