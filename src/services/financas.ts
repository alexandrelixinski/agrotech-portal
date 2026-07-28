import { supabase } from '@/lib/supabaseClient'
import type { LancamentoFinanceiro, NovoLancamentoFinanceiroInput } from '@/types'

const SELECT_LANCAMENTO =
  'id, descricao, categoria, valor, loteId:lote_id, data, createdAt:created_at'

export async function listLancamentosFinanceiros(): Promise<LancamentoFinanceiro[]> {
  const { data, error } = await supabase
    .from('lancamentos_financeiros')
    .select(SELECT_LANCAMENTO)
    .order('data', { ascending: false })

  if (error) throw new Error(error.message)
  return data ?? []
}

export async function createLancamentoFinanceiro(
  input: NovoLancamentoFinanceiroInput,
): Promise<LancamentoFinanceiro> {
  const { data, error } = await supabase
    .from('lancamentos_financeiros')
    .insert({
      descricao: input.descricao,
      categoria: input.categoria ?? null,
      valor: input.valor,
      lote_id: input.loteId ?? null,
      data: input.data,
    })
    .select(SELECT_LANCAMENTO)
    .single()

  if (error) throw new Error(error.message)
  return data
}
