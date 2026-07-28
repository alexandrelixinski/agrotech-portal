import type { Culture, Field } from '@/types'

export const CULTURE_LABELS: Record<Culture, string> = {
  soja: 'Soja',
  milho: 'Milho',
  cafe: 'Café',
  cana: 'Cana-de-açúcar',
}

export const STATUS_LABELS: Record<Field['status'], string> = {
  plantio: 'Plantio',
  crescimento: 'Crescimento',
  colheita: 'Colheita',
}

export function pluralize(count: number, singular: string, plural: string): string {
  return `${count} ${count === 1 ? singular : plural}`
}
