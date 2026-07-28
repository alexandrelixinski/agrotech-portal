# AgroTech Portal

Sistema de gestão agrícola: safras ("Minha Roça"), estoque de insumos ("Meu Galpão") e finanças. É a portagem de um protótipo em Python/Streamlit para uma aplicação web em **React + TypeScript + Vite**, com dados persistidos no **Supabase** e deploy contínuo na **Vercel**.

## Documentação

| Guia | Conteúdo |
| --- | --- |
| [docs/SETUP.md](docs/SETUP.md) | Configurar o ambiente do zero, passo a passo para **Windows e macOS** |
| [docs/SUPABASE.md](docs/SUPABASE.md) | Criar o projeto no Supabase, aplicar o schema, pegar as credenciais, entender as tabelas |
| [docs/BUSINESS_RULES.md](docs/BUSINESS_RULES.md) | O que cada tela faz de fato: fórmulas, efeitos de cada ação, limitações conhecidas |
| [docs/DEVELOPMENT.md](docs/DEVELOPMENT.md) | Arquitetura e o passo a passo pra adicionar telas/campos/entidades novas |

**Se é a primeira vez configurando o projeto**, comece por [docs/SUPABASE.md](docs/SUPABASE.md) (criar o banco) e depois [docs/SETUP.md](docs/SETUP.md) (rodar localmente).

## Stack

- React 19 + TypeScript
- Vite (bundler e dev server)
- React Router (rotas)
- Supabase (Postgres + API REST automática, sem backend próprio — ver [docs/SUPABASE.md](docs/SUPABASE.md))
- oxlint (lint)
- Deploy na Vercel

## Início rápido

```bash
nvm use              # usa a versão de Node fixada em .nvmrc
npm install
cp .env.example .env.local   # preencha as credenciais do Supabase — ver docs/SUPABASE.md
npm run dev
```

A aplicação sobe em `http://localhost:5173`. Guia completo (incluindo Windows) em [docs/SETUP.md](docs/SETUP.md).

## Scripts

| Comando             | Descrição                                 |
| -------------------- | ----------------------------------------- |
| `npm run dev`        | Servidor de desenvolvimento com HMR       |
| `npm run build`      | Type-check + build de produção em `dist/` |
| `npm run preview`    | Serve localmente o build de produção      |
| `npm run lint`       | Análise estática com oxlint               |
| `npm run typecheck`  | Verificação de tipos sem gerar artefatos  |

## Estrutura de pastas

```
src/
├── components/
│   ├── layout/      # Header, Footer, AppLayout
│   ├── ui/          # Componentes reutilizáveis (Button, Card)
│   ├── roca/        # Componentes da tela /roca
│   ├── galpao/      # Componentes da tela /galpao
│   └── financas/    # Componentes da tela /financas
├── hooks/           # Um hook por entidade (useLotes, useEstoque, ...)
├── lib/             # Constantes, formatação, labels, regras (alertas.ts)
├── pages/           # Uma página por rota
├── routes/          # Definição de rotas e paths
├── services/        # Toda a comunicação com o Supabase
├── styles/          # CSS global e design tokens
├── types/           # Tipos compartilhados e tipagem de env
└── main.tsx         # Entry point

supabase/migrations/ # Schema do banco, versionado (fonte de verdade)
scripts/              # Scripts avulsos (ex.: migração dos dados do protótipo antigo)
docs/                 # Documentação detalhada (ver tabela acima)
```

O alias `@/` aponta para `src/` (configurado em `vite.config.ts` e `tsconfig.app.json`). Mais detalhes de arquitetura e convenções em [docs/DEVELOPMENT.md](docs/DEVELOPMENT.md).

## Rotas

| Path         | Página          |
| ------------ | --------------- |
| `/`          | `HomePage`      |
| `/roca`      | `RocaPage`      |
| `/galpao`    | `GalpaoPage`    |
| `/financas`  | `FinancasPage`  |
| `/sobre`     | `AboutPage`     |
| `*`          | `NotFoundPage`  |

## Variáveis de ambiente

Apenas variáveis com prefixo `VITE_` são expostas ao browser. Veja `.env.example`.

| Variável                 | Descrição                                                                |
| ------------------------ | ------------------------------------------------------------------------- |
| `VITE_SUPABASE_URL`      | URL do projeto Supabase — ver [docs/SUPABASE.md](docs/SUPABASE.md#pegar-as-credenciais) |
| `VITE_SUPABASE_ANON_KEY` | Chave pública (Publishable key) do projeto Supabase — mesma referência acima |
| `VITE_API_BASE_URL`      | Reservada para uma eventual API própria; não é usada hoje (o projeto fala direto com o Supabase) |

Em produção, cadastre as variáveis em **Project Settings → Environment Variables** na Vercel.

## Deploy na Vercel

1. Acesse [vercel.com/new](https://vercel.com/new) e importe este repositório.
2. A Vercel detecta o framework Vite automaticamente; o `vercel.json` já define:
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Rewrite de todas as rotas para `/index.html` (necessário para o React Router)
3. Em **Project Settings → Environment Variables**, cadastre `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY` (os mesmos valores do `.env.local` — ver [docs/SUPABASE.md](docs/SUPABASE.md)).
4. Clique em **Deploy**.

Cada push na branch de produção gera um novo deploy; branches e PRs geram Preview Deployments. Como o Supabase é um serviço à parte (não faz parte deste repositório), ele não precisa de nenhuma configuração adicional na Vercel além das variáveis de ambiente — o schema já foi aplicado direto no projeto Supabase (ver [docs/SUPABASE.md](docs/SUPABASE.md#aplicar-o-schema)).

Alternativa via CLI:

```bash
npm i -g vercel
vercel        # preview
vercel --prod # produção
```
