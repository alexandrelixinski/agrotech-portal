export type Culture = 'soja' | 'milho' | 'cafe' | 'cana'

export type Field = {
  id: string
  name: string
  culture: Culture
  areaHectares: number
  status: 'plantio' | 'crescimento' | 'colheita'
}
