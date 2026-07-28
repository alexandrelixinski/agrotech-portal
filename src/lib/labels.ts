import type { CategoriaInsumo, TipoMovimentacao } from '@/types'

export const TIPO_MOVIMENTACAO_LABELS: Record<TipoMovimentacao, string> = {
  insumo: 'Insumo (Galpão)',
  mao_de_obra: 'Mão de Obra',
  diesel: 'Diesel / Máquina',
  compra_avulsa: 'Compra Direta',
  nota: 'Outros',
}

export const CATEGORIA_INSUMO_LABELS: Record<CategoriaInsumo, string> = {
  Sementes: 'Sementes',
  Adubos: 'Adubos',
  Diesel: 'Diesel',
  Defensivos: 'Defensivos',
  Outros: 'Outros',
}

/** Ordem fixa (identidade categórica) — nunca reordenar, só assim a paleta continua CVD-safe. */
export const CATEGORIA_ORDEM: CategoriaInsumo[] = ['Sementes', 'Adubos', 'Diesel', 'Defensivos', 'Outros']

export const CATEGORIA_COLOR_VAR: Record<CategoriaInsumo, string> = {
  Sementes: 'var(--series-1)',
  Adubos: 'var(--series-2)',
  Diesel: 'var(--series-3)',
  Defensivos: 'var(--series-4)',
  Outros: 'var(--series-5)',
}
