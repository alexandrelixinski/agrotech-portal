"use client"

import { useMemo, useState } from 'react'
import { LoteCard } from '@/components/roca/LoteCard'
import { NovoLoteForm } from '@/components/roca/NovoLoteForm'
import { useEstoque } from '@/hooks/useEstoque'
import { useLotes } from '@/hooks/useLotes'

const NEON_GREEN = "#00FF66"
const FILTERS = ['Todos', 'Soja', 'Milho', 'Algodão'] as const
type Filtro = typeof FILTERS[number]

export function RocaPage() {
  const { lotes, loading, error, refetch: refetchLotes } = useLotes()
  const { itens: itensEstoque, refetch: refetchEstoque } = useEstoque()

  const [activeFilter, setActiveFilter] = useState<Filtro>('Todos')

  const totalLotes = lotes.length

  // TODO: quando existir um campo de status/colheita no tipo Lote,
  // trocar por: lotes.filter(l => l.status !== 'colhido').length
  const plantiosAtivos = totalLotes

  const areaTotalHa = useMemo(
    () => lotes.reduce((soma, l) => soma + (l.areaHectares || 0), 0),
    [lotes]
  )

  const lotesFiltrados = useMemo(() => {
    if (activeFilter === 'Todos') return lotes
    return lotes.filter(
      (l) => l.cultura?.toLowerCase() === activeFilter.toLowerCase()
    )
  }, [lotes, activeFilter])

  return (
    <div className="min-h-screen bg-[#040C08] text-white p-4 font-sans max-w-md mx-auto pb-24">

      {/* 1. CABEÇALHO INTEGRADO */}
      <header className="flex justify-between items-start mb-6">
        <div>
