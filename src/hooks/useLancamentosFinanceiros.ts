import { useCallback, useEffect, useState } from 'react'

import { listLancamentosFinanceiros } from '@/services/financas'
import type { LancamentoFinanceiro } from '@/types'

type UseLancamentosFinanceirosResult = {
  lancamentos: LancamentoFinanceiro[]
  loading: boolean
  error: string | null
  refetch: () => void
}

export function useLancamentosFinanceiros(): UseLancamentosFinanceirosResult {
  const [lancamentos, setLancamentos] = useState<LancamentoFinanceiro[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [version, setVersion] = useState(0)

  useEffect(() => {
    let active = true
    setLoading(true)

    listLancamentosFinanceiros()
      .then((data) => {
        if (active) setLancamentos(data)
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

  return { lancamentos, loading, error, refetch }
}
