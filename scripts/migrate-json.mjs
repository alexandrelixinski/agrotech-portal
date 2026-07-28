// Migração única dos dados do protótipo AgroTech (JSONs locais) para o Supabase.
//
// Uso:
//   node --env-file=.env.local scripts/migrate-json.mjs [caminho-para-pasta-AgroTech]
//
// Por padrão lê os JSONs de ../AgroTech (pasta irmã do agrotech-portal).
// Idempotência: NÃO verifica duplicados — rode uma única vez contra um banco vazio.

import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'node:fs'
import { join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = fileURLToPath(new URL('.', import.meta.url))

const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.error(
    'Defina VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY (rode com: node --env-file=.env.local scripts/migrate-json.mjs)',
  )
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseAnonKey)

const agroTechDir = resolve(__dirname, '..', process.argv[2] ?? '../AgroTech')

function lerJson(nome) {
  try {
    return JSON.parse(readFileSync(join(agroTechDir, nome), 'utf-8'))
  } catch {
    console.warn(`Aviso: não encontrei ${nome} em ${agroTechDir}, seguindo com lista vazia.`)
    return []
  }
}

/** Converte "dd/mm/yyyy" ou "dd/mm" (sem ano) para "yyyy-mm-dd". */
function paraIso(dataBr, anoFallback) {
  if (!dataBr) return null
  const partes = dataBr.split('/')
  const [dia, mes, ano] = partes
  const anoFinal = ano ?? String(anoFallback ?? new Date().getFullYear())
  return `${anoFinal}-${mes.padStart(2, '0')}-${dia.padStart(2, '0')}`
}

/** Parseia uma linha de `diario` do formato antigo em campos estruturados. */
function parseDiarioEntry(nota, anoFallback) {
  const agendado = nota.includes('⏳') || nota.includes('AGENDADO')
  const limpo = nota.replace(/^⏳\s*/, '').replace('[AGENDADO] ', '')

  const matchData = limpo.match(/^(\d{2}\/\d{2}(?:\/\d{4})?):\s*(.*)$/)
  if (!matchData) {
    return { tipo: 'nota', descricao: nota, valor: 0, data: null, agendado, itemNome: null, itemQtd: null, naoReconhecido: true }
  }
  const [, dataStr, resto] = matchData
  const data = paraIso(dataStr, anoFallback)

  const valorMatch = resto.match(/R\$\s*([\d.]+)/)
  const valor = valorMatch ? Number.parseFloat(valorMatch[1]) : 0

  if (resto.startsWith('[PEÃO]')) {
    return { tipo: 'mao_de_obra', descricao: resto.replace('[PEÃO] ', '').replace(/\s*-\s*R\$.*$/, ''), valor, data, agendado, itemNome: null, itemQtd: null }
  }
  if (resto.startsWith('[DIESEL]')) {
    return { tipo: 'diesel', descricao: resto.replace('[DIESEL] ', '').replace(/\s*-\s*R\$.*$/, ''), valor, data, agendado, itemNome: null, itemQtd: null }
  }
  if (resto.startsWith('[COMPRA]')) {
    const m = resto.match(/^\[COMPRA\]\s+(.+?)\s+->\s+([\d.]+)\s+\S+\./)
    return {
      tipo: 'compra_avulsa',
      descricao: resto.replace('[COMPRA] ', '').replace(/\s*\(R\$.*$/, ''),
      valor,
      data,
      agendado,
      itemNome: m ? m[1] : null,
      itemQtd: m ? Number.parseFloat(m[2]) : null,
    }
  }
  if (resto.startsWith('Aplicado')) {
    const m = resto.match(/^Aplicado\s+([\d.]+)\s+\S+\s+de\s+(.+?)\./)
    return {
      tipo: 'insumo',
      descricao: resto.replace(/\s*\(R\$.*$/, ''),
      valor,
      data,
      agendado,
      itemNome: m ? m[2] : null,
      itemQtd: m ? Number.parseFloat(m[1]) : null,
    }
  }
  return { tipo: 'nota', descricao: resto, valor: 0, data, agendado, itemNome: null, itemQtd: null }
}

/** Acha o lote correspondente a um texto livre de "lote" (financas/vendas), com match exato e depois por substring. */
function encontrarLoteId(nomeLivre, loteIdByCultura) {
  if (!nomeLivre) return null
  if (loteIdByCultura.has(nomeLivre)) return loteIdByCultura.get(nomeLivre)
  const alvo = nomeLivre.toLowerCase()
  for (const [cultura, id] of loteIdByCultura) {
    if (alvo.includes(cultura.toLowerCase()) || cultura.toLowerCase().includes(alvo)) return id
  }
  return null
}

async function main() {
  const avisos = []
  const resumo = { lotes: 0, itensEstoque: 0, movimentacoes: 0, vendas: 0, lancamentos: 0 }

  console.log(`Lendo JSONs de: ${agroTechDir}`)

  // 1. Itens de estoque
  const estoqueJson = lerJson('meu_estoque.json')
  const itemIdByNome = new Map()
  for (const it of estoqueJson) {
    const { data, error } = await supabase
      .from('itens_estoque')
      .insert({
        nome: it.nome,
        categoria: it.categoria ?? 'Outros',
        quantidade: it.qtd ?? 0,
        unidade: it.unidade ?? 'un',
        preco_unitario: it.preco ?? 0,
      })
      .select('id, nome')
      .single()
    if (error) {
      avisos.push(`Item de estoque "${it.nome}" falhou: ${error.message}`)
      continue
    }
    itemIdByNome.set(data.nome.toLowerCase(), data.id)
    resumo.itensEstoque++
  }

  // 2. Lotes + diário -> movimentações
  const plantiosJson = lerJson('meu_plantio.json')
  const loteIdByCultura = new Map()
  for (const p of plantiosJson) {
    const dataPlantioIso = paraIso(p.data_plantio)
    const anoLote = dataPlantioIso ? Number.parseInt(dataPlantioIso.slice(0, 4), 10) : undefined

    const { data: lote, error } = await supabase
      .from('lotes')
      .insert({
        cultura: p.cultura,
        variedade: p.variedade || null,
        area_hectares: p.area ?? 0,
        data_plantio: dataPlantioIso,
        custo_total: p.custo_total ?? 0,
      })
      .select('id, cultura')
      .single()
    if (error) {
      avisos.push(`Lote "${p.cultura}" falhou: ${error.message}`)
      continue
    }
    loteIdByCultura.set(lote.cultura, lote.id)
    resumo.lotes++

    for (const nota of p.diario ?? []) {
      const mov = parseDiarioEntry(nota, anoLote)
      if (mov.naoReconhecido) {
        avisos.push(`Diário não reconhecido no lote "${p.cultura}": "${nota}" — importado como nota.`)
      }
      const itemEstoqueId = mov.itemNome ? (itemIdByNome.get(mov.itemNome.toLowerCase()) ?? null) : null
      if (mov.itemNome && !itemEstoqueId) {
        avisos.push(`Movimentação "${nota}" referencia item "${mov.itemNome}" que não foi encontrado no estoque migrado.`)
      }
      const { error: movError } = await supabase.from('movimentacoes').insert({
        lote_id: lote.id,
        item_estoque_id: itemEstoqueId,
        tipo: mov.tipo,
        descricao: mov.descricao,
        quantidade: mov.itemQtd,
        valor: mov.valor,
        data: mov.data ?? dataPlantioIso,
        agendado: mov.agendado,
      })
      if (movError) {
        avisos.push(`Movimentação "${nota}" falhou ao inserir: ${movError.message}`)
        continue
      }
      resumo.movimentacoes++
    }
  }

  // 3. Vendas
  const vendasJson = lerJson('vendas.json')
  for (const v of vendasJson) {
    const loteId = encontrarLoteId(v.lote, loteIdByCultura)
    if (!loteId) avisos.push(`Venda "${v.lote}" não encontrou lote correspondente — importada sem vínculo.`)
    const { error } = await supabase.from('vendas').insert({
      lote_id: loteId,
      quantidade: v.qtd ?? 0,
      valor_total: v.valor_total ?? 0,
      data: paraIso(v.data),
    })
    if (error) {
      avisos.push(`Venda "${v.lote}" falhou: ${error.message}`)
      continue
    }
    resumo.vendas++
  }

  // 4. Lançamentos financeiros extras
  const financasJson = lerJson('minhas_financas.json')
  for (const f of financasJson) {
    const loteId = encontrarLoteId(f.lote, loteIdByCultura)
    if (f.lote && f.lote !== 'Geral' && !loteId) {
      avisos.push(`Lançamento "${f.desc}" referencia lote "${f.lote}" que não existe — importado sem vínculo.`)
    }
    const { error } = await supabase.from('lancamentos_financeiros').insert({
      descricao: f.desc ?? '(sem descrição)',
      categoria: f.cat ?? null,
      valor: f.val ?? 0,
      lote_id: loteId,
      data: paraIso(f.data),
    })
    if (error) {
      avisos.push(`Lançamento "${f.desc}" falhou: ${error.message}`)
      continue
    }
    resumo.lancamentos++
  }

  console.log('\n--- Migração concluída ---')
  console.log(resumo)
  if (avisos.length) {
    console.log(`\n${avisos.length} aviso(s) — revise manualmente:`)
    for (const a of avisos) console.log(` - ${a}`)
  }
}

main().catch((err) => {
  console.error('Falha na migração:', err)
  process.exit(1)
})
