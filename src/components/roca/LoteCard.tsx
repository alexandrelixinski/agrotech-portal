import { useState } from 'react'

import { Button } from '@/components/ui/Button'
import { Diario } from '@/components/roca/Diario'
import { OperacaoForm } from '@/components/roca/OperacaoForm'
import { getAlertasLote } from '@/lib/alertas'
import { diasDesde, formatCurrency, formatDateBR } from '@/lib/format'
import { deleteLote } from '@/services/lotes'
import type { ItemEstoque, Lote } from '@/types'

type LoteCardProps = {
  lote: Lote
  itensEstoque: ItemEstoque[]
  onLoteRemovido: () => void
  onLoteAlterado: () => void
  onEstoqueAlterado: () => void
}

export function LoteCard({ lote, itensEstoque, onLoteRemovido, onLoteAlterado, onEstoqueAlterado }: LoteCardProps) {
  const [mostrarOperacao, setMostrarOperacao] = useState(false)
  const [mostrarDiario, setMostrarDiario] = useState(false)
  const [removendo, setRemovendo] = useState(false)
  const alertas = getAlertasLote(lote)

  async function handleRemover() {
    if (!window.confirm(`Excluir o lote "${lote.cultura}"? Isso não pode ser desfeito.`)) return
    setRemovendo(true)
    try {
      await deleteLote(lote.id)
      onLoteRemovido()
    } finally {
      setRemovendo(false)
    }
  }

  return (
    <article className="card lote-card">
      <button
        type="button"
        className="lote-card__close"
        onClick={handleRemover}
        disabled={removendo}
        aria-label="Excluir lote"
      >
        ×
      </button>
      <div className="lote-card__header">
        <div>
          <h3 className="card__title">🌱 {lote.cultura}</h3>
          <p className="lote-card__meta">
            {lote.variedade ? `🧬 ${lote.variedade} | ` : ''}📐 {lote.areaHectares} ha
          </p>
          <p className="lote-card__meta">
            📅 Plantio: {formatDateBR(lote.dataPlantio)} — {diasDesde(lote.dataPlantio)} dias
          </p>
          <p className="lote-card__meta">💰 Custo total: {formatCurrency(lote.custoTotal)}</p>
        </div>
      </div>

      <div className="lote-card__schedule">
        <span className="lote-card__schedule-title">Próx. / Agendados</span>
        {alertas.length > 0 ? (
          alertas.map((alerta, idx) => (
            <div className="lote-card__schedule-item" key={idx}>
              <span>{alerta.nivel === 'warning' ? '⚠️' : '🔔'}</span>
              <span>{alerta.mensagem}</span>
            </div>
          ))
        ) : (
          <p className="lote-card__schedule-empty">Nenhuma aplicação agendada no momento.</p>
        )}
      </div>

      <div className="lote-card__actions">
        <Button variant="ghost" onClick={() => setMostrarOperacao((v) => !v)}>
          {mostrarOperacao ? 'Fechar operação' : '📋 Registrar Operação'}
        </Button>
        <Button variant="ghost" onClick={() => setMostrarDiario((v) => !v)}>
          {mostrarDiario ? 'Fechar diário' : '📝 Diário'}
        </Button>
      </div>

      {mostrarOperacao ? (
        <div className="lote-card__section">
          <OperacaoForm
            lote={lote}
            itensEstoque={itensEstoque}
            onRegistrado={onLoteAlterado}
            onEstoqueAlterado={onEstoqueAlterado}
          />
        </div>
      ) : null}

      {mostrarDiario ? (
        <div className="lote-card__section">
          <Diario
            lote={lote}
            itensEstoque={itensEstoque}
            onLoteAlterado={onLoteAlterado}
            onEstoqueAlterado={onEstoqueAlterado}
          />
        </div>
      ) : null}
    </article>
  )
}
