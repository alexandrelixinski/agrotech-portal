# Como estender o projeto

## Arquitetura em uma frase

O React (rodando no navegador) fala **direto** com o Supabase — não existe um backend próprio no meio. O caminho de qualquer dado é sempre:

```
tabela no Postgres → service (src/services/*.ts) → hook (src/hooks/use*.ts) → componente/página
```

Se algum dia isso mudar (por exemplo, adicionar lógica de negócio que não pode rodar no cliente), é o `service` que muda — hooks, componentes e páginas continuam iguais, já que só conhecem a "forma" dos dados, não de onde vêm.

## Estrutura de pastas

```
src/
├── components/
│   ├── layout/      # Header, Footer, AppLayout (usados em todas as páginas)
│   ├── ui/          # Button, Card — componentes genéricos reutilizáveis
│   ├── roca/        # Componentes só da tela /roca
│   ├── galpao/      # Componentes só da tela /galpao
│   └── financas/    # Componentes só da tela /financas
├── hooks/           # Um hook por entidade (useLotes, useEstoque, ...)
├── lib/             # Constantes, formatação, labels, regras puras (alertas.ts)
├── pages/           # Uma página por rota
├── routes/          # Definição de rotas (paths.ts) e do router (router.tsx)
├── services/        # Toda a comunicação com o Supabase
├── styles/          # CSS global e design tokens (sem biblioteca de UI)
├── types/           # Tipos TypeScript compartilhados
└── main.tsx         # Entry point
```

O alias `@/` aponta para `src/` (configurado em `vite.config.ts` e `tsconfig.app.json`) — sempre importe com `@/algo`, nunca com caminho relativo tipo `../../lib/algo`.

## Convenção de nomes: banco vs. TypeScript

- No Postgres: `snake_case` (ex.: `area_hectares`, `custo_total`).
- No TypeScript: `camelCase` (ex.: `areaHectares`, `custoTotal`).

A tradução acontece na própria query, usando o recurso de alias do PostgREST — repare no padrão em qualquer `service`:

```ts
const SELECT_LOTE =
  'id, cultura, variedade, areaHectares:area_hectares, dataPlantio:data_plantio, custoTotal:custo_total, createdAt:created_at'
```

Isso só funciona pra **leitura** (`select`). Ao **escrever** (`insert`/`update`), o objeto enviado precisa usar os nomes reais das colunas (`snake_case`) — veja como cada `create*`/`update*` em `src/services/` converte antes de mandar pro Supabase.

## Receita: adicionar um campo numa entidade existente

Exemplo: adicionar um campo `observacao` em `itens_estoque`.

1. **Migration**: criar `supabase/migrations/<timestamp>_add_observacao_itens_estoque.sql` com:
   ```sql
   alter table itens_estoque add column observacao text;
   ```
   Aplicar colando no SQL Editor do dashboard Supabase (ver [SUPABASE.md](./SUPABASE.md#aplicar-o-schema)). **Nunca edite uma migration já aplicada** — sempre crie uma nova.
2. **Tipo**: adicionar `observacao: string | null` em `ItemEstoque` (e no `NovoItemEstoqueInput`, se for algo que se define na criação) em `src/types/index.ts`.
3. **Service**: incluir `observacao` no `SELECT_ITEM` de `src/services/estoque.ts`, e nos payloads de `insert`/`update` correspondentes.
4. Pronto — qualquer componente que já usa `useEstoque()` passa a receber o campo automaticamente.

## Receita: adicionar uma entidade nova (tabela nova)

1. Migration criando a tabela (com RLS habilitado + policy permissiva, seguindo o padrão das outras — ver o arquivo de schema inicial como referência).
2. Tipo em `src/types/index.ts` (a entidade + um `Novo<Entidade>Input` pro que é preciso pra criar uma).
3. Service em `src/services/<entidade>.ts` com `list`, `create`, e `update`/`delete` conforme a necessidade — copie a estrutura de um service existente (ex.: `src/services/vendas.ts`, que é o mais simples).
4. Hook em `src/hooks/use<Entidade>.ts` — copie `src/hooks/useVendas.ts` como modelo (todos seguem o mesmo formato: `{ dados, loading, error, refetch }`).
5. Componentes em `src/components/<modulo>/`.

## Receita: adicionar uma tela nova

1. Página em `src/pages/<Nome>Page.tsx`.
2. Registrar o caminho em `src/routes/paths.ts` (adicionar em `ROUTES`).
3. Registrar a rota em `src/routes/router.tsx` (importar a página, adicionar em `children`).
4. Adicionar o link no menu em `src/components/layout/Header.tsx` (array `NAV_ITEMS`).

## Estilo e design

Não tem biblioteca de componentes (nada de Material UI, Tailwind, shadcn, etc.) — é CSS puro em [`src/styles/global.css`](../src/styles/global.css), com tokens de cor/espaçamento em `:root` e um bloco `@media (prefers-color-scheme: dark)` cobrindo o modo escuro automaticamente. Antes de inventar uma cor nova, veja se já existe uma variável (`--color-*`) que serve.

Componentes genéricos reutilizáveis (botão, card) ficam em `src/components/ui/` — se perceber que está repetindo o mesmo HTML/CSS em duas telas diferentes, é sinal de que deveria virar um componente ali.

### Gráficos

O único gráfico do projeto (a barra de distribuição de valor em `/galpao`) é HTML/CSS puro — não tem nenhuma biblioteca de gráficos instalada. As cores categóricas (`--series-1` a `--series-5` no `global.css`) foram escolhidas e validadas (contraste, daltonismo) com o script de uma skill de visualização de dados — se for adicionar outro gráfico com múltiplas categorias, reaproveite essas mesmas variáveis em vez de inventar cores novas, e pense se um gráfico é mesmo necessário antes de adicionar uma lib nova.

## Antes de commitar

```bash
nvm use
npm run typecheck
npm run lint
```

Não existem testes automatizados no projeto ainda. Para validar uma mudança de tela, o jeito é rodar `npm run dev` e testar manualmente no navegador.

## Deploy

Automático: todo push pra branch conectada na Vercel gera um deploy novo. Detalhes em [README.md](../README.md#deploy-na-vercel).
