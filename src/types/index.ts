export type Culture = 'soja' | 'milho' | 'cafe' | 'cana'

export type Field = {
  id: string
  name: string
  culture: Culture
  areaHectares: number
  status: 'plantio' | 'crescimento' | 'colheita'
}

// --- Domínio AgroTech (Supabase) ---

export type CategoriaInsumo = 'Sementes' | 'Adubos' | 'Diesel' | 'Defensivos' | 'Outros'

export type Lote = {
  id: string
  cultura: string
  variedade: string | null
  areaHectares: number
  /** Data ISO (yyyy-mm-dd) */
  dataPlantio: string
  custoTotal: number
  createdAt: string
}

export type NovoLoteInput = {
  cultura: string
  variedade?: string | null
  areaHectares: number
  dataPlantio: string
}

export type ItemEstoque = {
  id: string
  nome: string
  categoria: CategoriaInsumo
  quantidade: number
  unidade: string
  precoUnitario: number
  createdAt: string
}

export type NovoItemEstoqueInput = {
  nome: string
  categoria: CategoriaInsumo
  quantidade: number
  unidade: string
  precoUnitario: number
}

export type TipoMovimentacao = 'insumo' | 'mao_de_obra' | 'diesel' | 'compra_avulsa' | 'nota'

export type Movimentacao = {
  id: string
  loteId: string
  itemEstoqueId: string | null
  tipo: TipoMovimentacao
  descricao: string | null
  quantidade: number | null
  valor: number
  /** Data ISO (yyyy-mm-dd) */
  data: string
  agendado: boolean
  createdAt: string
}

export type NovaMovimentacaoInput = {
  loteId: string
  itemEstoqueId?: string | null
  tipo: TipoMovimentacao
  descricao?: string | null
  quantidade?: number | null
  valor: number
  data: string
  agendado?: boolean
}

export type Venda = {
  id: string
  loteId: string | null
  quantidade: number
  valorTotal: number
  data: string
  createdAt: string
}

export type NovaVendaInput = {
  loteId: string | null
  quantidade: number
  valorTotal: number
  data: string
}

export type LancamentoFinanceiro = {
  id: string
  descricao: string
  categoria: string | null
  valor: number
  loteId: string | null
  data: string
  createdAt: string
}

export type NovoLancamentoFinanceiroInput = {
  descricao: string
  categoria?: string | null
  valor: number
  loteId?: string | null
  data: string
}
