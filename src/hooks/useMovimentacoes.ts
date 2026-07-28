import { useCallback, useEffect, useState } from 'react'

import { listMovimentacoesPorLote } from '@/services/movimentacoes'
import type { Movimentacao } from '@/types'

type UseMovimentacoesResult = {
  movimentacoes: Movimentacao[]
  loading: boolean
  error: string | null
  refetch: () => void
}

export function useMovimentacoes(loteId: string): UseMovimentacoesResult {
  const [movimentacoes, setMovimentacoes] = useState<Movimentacao[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [version, setVersion] = useState(0)

  useEffect(() => {
    let active = true
    setLoading(true)

    listMovimentacoesPorLote(loteId)
      .then((data) => {
        if (active) setMovimentacoes(data)
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
  }, [loteId, version])

  const refetch = useCallback(() => setVersion((v) => v + 1), [])

  return { movimentacoes, loading, error, refetch }
}
