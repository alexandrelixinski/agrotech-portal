import { LoteCard } from '@/components/roca/LoteCard'
import { NovoLoteForm } from '@/components/roca/NovoLoteForm'
import { useEstoque } from '@/hooks/useEstoque'
import { useLotes } from '@/hooks/useLotes'

export function RocaPage() {
  const { lotes, loading, error, refetch: refetchLotes } = useLotes()
  const { itens: itensEstoque, refetch: refetchEstoque } = useEstoque()

  const neonGreen = "#00FF66"
  const filters = ['Todos', 'Soja', 'Milho', 'Algodão']
  const activeFilter = 'Todos'

  const totalLotes = lotes?.length || 0
  const plantiosAtivos = lotes?.filter(l => l.status !== 'colhido').length || 0

  return (
    <div className="min-h-screen bg-[#040C08] text-white p-4 font-sans max-w-md mx-auto pb-24">
      
      {/* 1. CABEÇALHO INTEGRADO */}
      <header className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight" style={{ color: neonGreen }}>
            Lavoura
          </h1>
          <p className="text-gray-400 text-sm mt-1">
            Gestão de plantio, lotes e aplicações
          </p>
        </div>
        
        <div 
          className="px-3 py-1 rounded-full text-xs border bg-[#121614] font-medium whitespace-nowrap"
          style={{ borderColor: `${neonGreen}b3`, color: neonGreen }}
        >
          Safra 25/26
        </div>
      </header>

      {/* 2. MINI-CARDS GRID */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <div className="bg-[#121614] p-3 rounded-lg border border-white/5 flex flex-col justify-center min-h-[75px]">
          <span className="text-2xl font-bold" style={{ color: neonGreen }}>{totalLotes}</span>
          <span className="text-gray-400 text-xs mt-0.5">Total de Lotes</span>
        </div>

        <div className="bg-[#121614] p-3 rounded-lg border border-white/5 flex flex-col justify-center min-h-[75px]">
          <span className="text-2xl font-bold" style={{ color: neonGreen }}>847 ha</span>
          <span className="text-gray-400 text-xs mt-0.5">Área Plantada</span>
        </div>

        <div className="bg-[#121614] p-3 rounded-lg border border-white/5 flex flex-col justify-center min-h-[75px]">
          <span className="text-2xl font-bold" style={{ color: neonGreen }}>{plantiosAtivos}</span>
          <span className="text-gray-400 text-xs mt-0.5">Plantios Ativos</span>
        </div>

        <div className="bg-[#121614] p-3 rounded-lg border border-white/5 flex flex-col justify-center min-h-[75px]">
          <span className="text-2xl font-bold" style={{ color: neonGreen }}>5</span>
          <span className="text-gray-400 text-xs mt-0.5">Aplicações Agendadas</span>
        </div>
      </div>

      {/* 3. BOTÕES DE FILTRO OVALADOS */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none mb-6">
        {filters.map((filter) => {
          const isActive = filter === activeFilter
          return (
            <button
              key={filter}
              className="px-4 py-1.5 rounded-full text-sm font-medium transition-colors whitespace-nowrap"
              style={{
                backgroundColor: isActive ? neonGreen : '#1B1F1C',
                color: isActive ? '#000000' : '#9CA3AF'
              }}
            >
              {filter}
            </button>
          );
        })}
      </div>

      {/* FORMULÁRIO */}
      <div className="mb-6">
        <NovoLoteForm onCreated={refetchLotes} />
      </div>

      {/* RENDERIZAÇÃO DOS SEUS COMPONENTES EXISTENTES */}
      {loading ? <p className="text-gray-400 text-sm animate-pulse">Carregando lotes…</p> : null}
      {error ? <p className="p-3 bg-red-900/40 text-red-400 rounded-lg text-sm border border-red-500/30 mb-4" role="alert">{error}</p> : null}

      {!loading && !error ? (
        lotes.length === 0 ? (
          <p className="text-gray-400 text-sm text-center py-6 bg-[#121614] rounded-lg border border-white/5">
            Nenhum lote cadastrado. Use o formulário acima para começar!
          </p>
        ) : (
          <div className="space-y-4">
            {lotes.map((lote) => (
              <LoteCard
                key={lote.id}
                lote={lote}
                itensEstoque={itensEstoque}
                onLoteRemovido={refetchLotes}
                onLoteAlterado={refetchLotes}
                onEstoqueAlterado={refetchEstoque}
              />
            ))}
          </div>
        )
      ) : null}

    </div>
  )
}
