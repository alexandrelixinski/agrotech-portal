import { Card } from '@/components/ui/Card'
import { useFields } from '@/hooks/useFields'
import { CULTURE_LABELS, STATUS_LABELS, pluralize } from '@/lib/labels'

export function DashboardPage() {
  const { fields, loading, error } = useFields()

  const totalArea = fields.reduce((sum, field) => sum + field.areaHectares, 0)
  const harvesting = fields.filter((field) => field.status === 'colheita').length

  return (
    <section className="stack">
      <header className="page-header">
        <h1>Dashboard</h1>
        <p>Visão geral dos talhões cadastrados.</p>
      </header>

      {loading ? <p>Carregando talhões…</p> : null}
      {error ? <p role="alert">{error}</p> : null}

      {!loading && !error ? (
        <>
          <div className="grid">
            <Card
              title="Talhões"
              description={pluralize(fields.length, 'cadastrado', 'cadastrados')}
            />
            <Card title="Área total" description={`${totalArea} ha`} />
            <Card
              title="Em colheita"
              description={pluralize(harvesting, 'talhão', 'talhões')}
            />
          </div>

          <div className="table-wrapper">
            <table className="table">
              <thead>
                <tr>
                  <th>Talhão</th>
                  <th>Cultura</th>
                  <th>Área (ha)</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {fields.map((field) => (
                  <tr key={field.id}>
                    <td>{field.name}</td>
                    <td>{CULTURE_LABELS[field.culture]}</td>
                    <td>{field.areaHectares}</td>
                    <td>{STATUS_LABELS[field.status]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      ) : null}
    </section>
  )
}
