import { supabase } from '@/lib/supabaseClient'
import type { NovaVendaInput, Venda } from '@/types'

const SELECT_VENDA = 'id, loteId:lote_id, quantidade, valorTotal:valor_total, data, createdAt:created_at'

export async function listVendas(): Promise<Venda[]> {
  const { data, error } = await supabase
    .from('vendas')
    .select(SELECT_VENDA)
    .order('data', { ascending: false })

  if (error) throw new Error(error.message)
  return data ?? []
}

export async function createVenda(input: NovaVendaInput): Promise<Venda> {
  const { data, error } = await supabase
    .from('vendas')
    .insert({
      lote_id: input.loteId,
      quantidade: input.quantidade,
      valor_total: input.valorTotal,
      data: input.data,
    })
    .select(SELECT_VENDA)
    .single()

  if (error) throw new Error(error.message)
  return data
}
