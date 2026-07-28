import { supabase } from '@/lib/supabaseClient'
import type { Movimentacao, NovaMovimentacaoInput } from '@/types'

const SELECT_MOVIMENTACAO =
  'id, loteId:lote_id, itemEstoqueId:item_estoque_id, tipo, descricao, quantidade, valor, data, agendado, createdAt:created_at'

export async function listMovimentacoesPorLote(loteId: string): Promise<Movimentacao[]> {
  const { data, error } = await supabase
    .from('movimentacoes')
    .select(SELECT_MOVIMENTACAO)
    .eq('lote_id', loteId)
    .order('data', { ascending: false })

  if (error) throw new Error(error.message)
  return data ?? []
}

export async function createMovimentacao(input: NovaMovimentacaoInput): Promise<Movimentacao> {
  const { data, error } = await supabase
    .from('movimentacoes')
    .insert({
      lote_id: input.loteId,
      item_estoque_id: input.itemEstoqueId ?? null,
      tipo: input.tipo,
      descricao: input.descricao ?? null,
      quantidade: input.quantidade ?? null,
      valor: input.valor,
      data: input.data,
      agendado: input.agendado ?? false,
    })
    .select(SELECT_MOVIMENTACAO)
    .single()

  if (error) throw new Error(error.message)
  return data
}

export async function deleteMovimentacao(id: string): Promise<void> {
  const { error } = await supabase.from('movimentacoes').delete().eq('id', id)
  if (error) throw new Error(error.message)
}
