const currencyFormatter = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
})

export function formatCurrency(value: number): string {
  return currencyFormatter.format(value)
}

/** Recebe uma data ISO (yyyy-mm-dd) e devolve dd/mm/yyyy. */
export function formatDateBR(isoDate: string): string {
  const [ano, mes, dia] = isoDate.split('-')
  return `${dia}/${mes}/${ano}`
}

/** Dias corridos entre uma data ISO (yyyy-mm-dd) e hoje. */
export function diasDesde(isoDate: string): number {
  const inicio = new Date(`${isoDate}T00:00:00`)
  const hoje = new Date()
  hoje.setHours(0, 0, 0, 0)
  return Math.floor((hoje.getTime() - inicio.getTime()) / (1000 * 60 * 60 * 24))
}

/** Data local (yyyy-mm-dd) para usar em `<input type="date">` sem deslocamento de fuso. */
export function hojeIso(): string {
  const hoje = new Date()
  const offset = hoje.getTimezoneOffset()
  return new Date(hoje.getTime() - offset * 60 * 1000).toISOString().slice(0, 10)
}
