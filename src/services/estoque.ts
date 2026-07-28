import { supabase } from '@/lib/supabaseClient'
import type { ItemEstoque, NovoItemEstoqueInput } from '@/types'

const SELECT_ITEM =
  'id, nome, categoria, quantidade, unidade, precoUnitario:preco_unitario, createdAt:created_at'

export async function listItensEstoque(): Promise<ItemEstoque[]> {
  const { data, error } = await supabase
    .from('itens_estoque')
    .select(SELECT_ITEM)
    .order('nome', { ascending: true })

  if (error) throw new Error(error.message)
  return data ?? []
}

export async function createItemEstoque(input: NovoItemEstoqueInput): Promise<ItemEstoque> {
  const { data, error } = await supabase
    .from('itens_estoque')
    .insert({
      nome: input.nome,
      categoria: input.categoria,
      quantidade: input.quantidade,
      unidade: input.unidade,
      preco_unitario: input.precoUnitario,
    })
    .select(SELECT_ITEM)
    .single()

  if (error) throw new Error(error.message)
  return data
}

export async function updateQuantidadeItemEstoque(id: string, quantidade: number): Promise<void> {
  const { error } = await supabase.from('itens_estoque').update({ quantidade }).eq('id', id)
  if (error) throw new Error(error.message)
}

export async function deleteItemEstoque(id: string): Promise<void> {
  const { error } = await supabase.from('itens_estoque').delete().eq('id', id)
  if (error) throw new Error(error.message)
}
