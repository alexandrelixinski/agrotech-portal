import type { Field } from '@/types'

/**
 * Dados de exemplo — troque por `apiRequest<Field[]>({ path: '/fields' })`
 * quando o backend estiver disponível.
 */
const MOCK_FIELDS: Field[] = [
  { id: '1', name: 'Talhão Norte', culture: 'soja', areaHectares: 120, status: 'crescimento' },
  { id: '2', name: 'Talhão Sul', culture: 'milho', areaHectares: 85, status: 'plantio' },
  { id: '3', name: 'Talhão Leste', culture: 'cafe', areaHectares: 42, status: 'colheita' },
]

export async function listFields(): Promise<Field[]> {
  return Promise.resolve(MOCK_FIELDS)
}
