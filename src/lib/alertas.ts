import { diasDesde } from '@/lib/format'
import type { Lote } from '@/types'

export type Alerta = {
  mensagem: string
  nivel: 'info' | 'warning'
}

/**
 * Regras de manejo por cultura. Só existe a regra de milho — é a única que
 * o protótipo original (assistente_agro.py) definia. Não invente limiares
 * agronômicos para outras culturas sem validar com quem entende do assunto.
 */
export function getAlertasLote(lote: Lote): Alerta[] {
  const dias = diasDesde(lote.dataPlantio)
  const alertas: Alerta[] = []

  if (lote.cultura.trim().toLowerCase() === 'milho') {
    if (dias >= 15 && dias <= 22) {
      alertas.push({ mensagem: 'Janela ideal para ADUBAÇÃO DE COBERTURA!', nivel: 'warning' })
    } else if (dias > 110) {
      alertas.push({ mensagem: 'Ponto de colheita se aproximando.', nivel: 'info' })
    }
  }

  return alertas
}
