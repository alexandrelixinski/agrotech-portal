# AgroTech Portal

Projeto inicial em **React + TypeScript + Vite**, estruturado e pronto para deploy na **Vercel**.

## Stack

- React 19
- TypeScript
- Vite
- React Router (rotas)
- oxlint (lint)

## Requisitos

- Node.js 20+ (recomendado 22)
- npm 10+

## Como rodar localmente

```bash
npm install
cp .env.example .env.local   # opcional, ajuste as variáveis
npm run dev
```

A aplicação sobe em `http://localhost:5173`.

## Scripts

| Comando             | Descrição                                 |
| ------------------- | ----------------------------------------- |
| `npm run dev`       | Servidor de desenvolvimento com HMR       |
| `npm run build`     | Type-check + build de produção em `dist/` |
| `npm run preview`   | Serve localmente o build de produção      |
| `npm run lint`      | Análise estática com oxlint               |
| `npm run typecheck` | Verificação de tipos sem gerar artefatos  |

## Estrutura de pastas

```
src/
├── components/
│   ├── layout/      # Header, Footer, AppLayout
│   └── ui/          # Componentes reutilizáveis (Button, Card)
├── hooks/           # Hooks customizados
├── lib/             # Constantes e utilitários
├── pages/           # Uma página por rota
├── routes/          # Definição de rotas e paths
├── services/        # Cliente HTTP e chamadas de API
├── styles/          # CSS global e design tokens
├── types/           # Tipos compartilhados e tipagem de env
└── main.tsx         # Entry point
```

O alias `@/` aponta para `src/` (configurado em `vite.config.ts` e `tsconfig.app.json`).

## Rotas

| Path         | Página          |
| ------------ | --------------- |
| `/`          | `HomePage`      |
| `/dashboard` | `DashboardPage` |
| `/sobre`     | `AboutPage`     |
| `*`          | `NotFoundPage`  |

## Variáveis de ambiente

Apenas variáveis com prefixo `VITE_` são expostas ao browser. Veja `.env.example`.

| Variável            | Descrição                 |
| ------------------- | ------------------------- |
| `VITE_API_BASE_URL` | URL base da API do portal |

Em produção, cadastre as variáveis em **Project Settings → Environment Variables** na Vercel.

## Deploy na Vercel

1. Acesse [vercel.com/new](https://vercel.com/new) e importe este repositório.
2. A Vercel detecta o framework Vite automaticamente; o `vercel.json` já define:
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Rewrite de todas as rotas para `/index.html` (necessário para o React Router)
3. Configure as variáveis de ambiente, se houver.
4. Clique em **Deploy**.

Cada push na branch de produção gera um novo deploy; branches e PRs geram Preview Deployments.

Alternativa via CLI:

```bash
npm i -g vercel
vercel        # preview
vercel --prod # produção
```
