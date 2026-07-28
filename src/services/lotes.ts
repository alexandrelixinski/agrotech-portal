import { supabase } from '@/lib/supabaseClient'
import type { Lote, NovoLoteInput } from '@/types'

const SELECT_LOTE =
  'id, cultura, variedade, areaHectares:area_hectares, dataPlantio:data_plantio, custoTotal:custo_total, createdAt:created_at'

export async function listLotes(): Promise<Lote[]> {
  const { data, error } = await supabase
    .from('lotes')
    .select(SELECT_LOTE)
    .order('created_at', { ascending: false })

  if (error) throw new Error(error.message)
  return data ?? []
}

export async function createLote(input: NovoLoteInput): Promise<Lote> {
  const { data, error } = await supabase
    .from('lotes')
    .insert({
      cultura: input.cultura,
      variedade: input.variedade ?? null,
      area_hectares: input.areaHectares,
      data_plantio: input.dataPlantio,
    })
    .select(SELECT_LOTE)
    .single()

  if (error) throw new Error(error.message)
  return data
}

export async function updateLoteCustoTotal(id: string, custoTotal: number): Promise<void> {
  const { error } = await supabase.from('lotes').update({ custo_total: custoTotal }).eq('id', id)
  if (error) throw new Error(error.message)
}

export async function deleteLote(id: string): Promise<void> {
  const { error } = await supabase.from('lotes').delete().eq('id', id)
  if (error) throw new Error(error.message)
}
