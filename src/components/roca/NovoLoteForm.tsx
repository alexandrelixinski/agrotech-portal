import { useEffect, useState } from 'react'

import { Button } from '@/components/ui/Button'
import { createLote } from '@/services/lotes'
import { hojeIso } from '@/lib/format'
import type { NovoLoteInput } from '@/types'

type NovoLoteFormProps = {
  onCreated: () => void
  culturaPadrao?: string
}

export function NovoLoteForm({ onCreated, culturaPadrao }: NovoLoteFormProps) {
  const [cultura, setCultura] = useState(culturaPadrao ?? 'Soja')
  const [variedade, setVariedade] = useState('')
  const [areaHectares, setAreaHectares] = useState('')
  const [dataPlantio, setDataPlantio] = useState(hojeIso())
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [mensagem, setMensagem] = useState<string | null>(null)

  useEffect(() => {
    if (culturaPadrao) {
      setCultura(culturaPadrao)
    }
  }, [culturaPadrao])

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)
    setMensagem(null)

    if (!cultura.trim() || !areaHectares.trim()) {
      setError('Informe a cultura e a área em hectares.')
      return
    }

    const novoLote: NovoLoteInput = {
      cultura: cultura.trim(),
      variedade: variedade.trim() || undefined,
      areaHectares: Number(areaHectares.replace(',', '.')) || 0,
      dataPlantio,
    }

    setSubmitting(true)
    try {
      await createLote(novoLote)
      setMensagem('Lote cadastrado com sucesso!')
      setVariedade('')
      setAreaHectares('')
      setDataPlantio(hojeIso())
      onCreated()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao cadastrar lote.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <article className="card">
      <h2 className="card__title">Novo lote</h2>
      <p className="card__description">Adicione um lote e acompanhe sua produção de maneira organizada.</p>

      <form className="form-grid" onSubmit={handleSubmit}>
        <div className="form-row">
          <div className="field">
            <label htmlFor="cultura">Cultura</label>
            <input
              id="cultura"
              type="text"
              value={cultura}
              onChange={(event) => setCultura(event.target.value)}
              placeholder="Ex: milho, soja, fumo"
            />
            <span className="field__hint">Digite a cultura e o lote aparecerá na lista.</span>
          </div>

          <div className="field">
            <label htmlFor="variedade">Variedade</label>
            <input
              id="variedade"
              value={variedade}
              onChange={(event) => setVariedade(event.target.value)}
              placeholder="Opcional"
            />
          </div>
        </div>

        <div className="form-row">
          <div className="field">
            <label htmlFor="area-hectares">Área (ha)</label>
            <input
              id="area-hectares"
              type="number"
              min="0"
              step="0.01"
              value={areaHectares}
              onChange={(event) => setAreaHectares(event.target.value)}
              placeholder="0.00"
            />
          </div>

          <div className="field">
            <label htmlFor="data-plantio">Data de plantio</label>
            <input
              id="data-plantio"
              type="date"
              value={dataPlantio}
              onChange={(event) => setDataPlantio(event.target.value)}
            />
          </div>
        </div>

        {mensagem ? <p className="alert alert--info">{mensagem}</p> : null}
        {error ? (
          <p className="alert alert--error" role="alert">
            {error}
          </p>
        ) : null}

        <Button type="submit" disabled={submitting || !cultura.trim() || !areaHectares.trim()}>
          {submitting ? 'Cadastrando…' : 'Cadastrar lote'}
        </Button>
      </form>
    </article>
  )
}
