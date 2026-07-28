import { useEffect, useState } from 'react'

import { listFields } from '@/services/fields'
import type { Field } from '@/types'

type UseFieldsResult = {
  fields: Field[]
  loading: boolean
  error: string | null
}

export function useFields(): UseFieldsResult {
  const [fields, setFields] = useState<Field[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let active = true

    listFields()
      .then((data) => {
        if (active) setFields(data)
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
  }, [])

  return { fields, loading, error }
}
