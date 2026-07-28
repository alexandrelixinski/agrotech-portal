export function AboutPage() {
  return (
    <section className="stack">
      <header className="page-header">
        <h1>Sobre o projeto</h1>
        <p>Base técnica utilizada neste portal.</p>
      </header>

      <ul className="list">
        <li>React 19 + TypeScript</li>
        <li>Vite como bundler e dev server</li>
        <li>React Router para navegação</li>
        <li>oxlint para análise estática</li>
        <li>Deploy contínuo na Vercel</li>
      </ul>
    </section>
  )
}
