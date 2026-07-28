import { useState } from 'react'

import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { hojeIso } from '@/lib/format'
import { createLote } from '@/services/lotes'

type NovoLoteFormProps = {
  onCreated: () => void
}

export function NovoLoteForm({ onCreated }: NovoLoteFormProps) {
  const [cultura, setCultura] = useState('')
  const [variedade, setVariedade] = useState('')
  const [areaHectares, setAreaHectares] = useState('')
  const [dataPlantio, setDataPlantio] = useState(hojeIso())
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    if (!cultura.trim()) return

    setSubmitting(true)
    setError(null)
    try {
      await createLote({
        cultura: cultura.trim(),
        variedade: variedade.trim() || null,
        areaHectares: Number(areaHectares) || 0,
        dataPlantio,
      })
      setCultura('')
      setVariedade('')
      setAreaHectares('')
      setDataPlantio(hojeIso())
      onCreated()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao cadastrar lote')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Card title="🌱 Novo Lote">
      <form className="form-grid" onSubmit={handleSubmit}>
        <div className="form-row">
          <div className="field">
            <label htmlFor="cultura">Cultura</label>
            <input
              id="cultura"
              value={cultura}
              onChange={(e) => setCultura(e.target.value)}
              placeholder="Ex: Milho"
              required
            />
          </div>
          <div className="field">
            <label htmlFor="variedade">Variedade</label>
            <input
              id="variedade"
              value={variedade}
              onChange={(e) => setVariedade(e.target.value)}
              placeholder="Ex: AOB-962"
            />
          </div>
        </div>

        <div className="form-row">
          <div className="field">
            <label htmlFor="area">Hectares</label>
            <input
              id="area"
              type="number"
              min="0"
              step="0.01"
              value={areaHectares}
              onChange={(e) => setAreaHectares(e.target.value)}
            />
          </div>
          <div className="field">
            <label htmlFor="data-plantio">Data Plantio</label>
            <input
              id="data-plantio"
              type="date"
              value={dataPlantio}
              onChange={(e) => setDataPlantio(e.target.value)}
            />
          </div>
        </div>

        {error ? <p className="alert alert--error" role="alert">{error}</p> : null}

        <Button type="submit" disabled={submitting || !cultura.trim()}>
          {submitting ? 'Cadastrando…' : 'Cadastrar Lote'}
        </Button>
      </form>
    </Card>
  )
}
