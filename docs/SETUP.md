# Configuração do ambiente local (Windows e macOS)

Este guia parte do zero: uma máquina sem nada instalado até o projeto rodando em `http://localhost:5173`.

Se for a primeira vez configurando o banco, faça o [Supabase](./SUPABASE.md) primeiro — o projeto não funciona sem as credenciais de lá (`VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY`).

## Pré-requisitos

| Ferramenta | Versão | Por quê |
| --- | --- | --- |
| Node.js | **22.x** | O projeto fixa isso em `.nvmrc`. Versões abaixo de 20 já não instalam alguns pacotes corretamente (ver [Problemas comuns](#problemas-comuns)). |
| Git | qualquer recente | Clonar o repositório |
| Conta no Supabase | — | Ver [SUPABASE.md](./SUPABASE.md) |

---

## macOS

### 1. Instalar o Node.js via nvm

O projeto já vem com um `.nvmrc` fixando a versão — usar `nvm` evita ter que lembrar qual versão instalar.

```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.1/install.sh | bash
```

Feche e reabra o terminal (ou rode `source ~/.nvm/nvm.sh`), depois:

```bash
nvm install 22
```

### 2. Clonar o repositório

```bash
git clone <URL_DO_REPOSITORIO>
cd agrotech-portal
```

### 3. Instalar as dependências

```bash
nvm use          # lê o .nvmrc e troca pra versão certa do Node
npm install
```

### 4. Configurar variáveis de ambiente

```bash
cp .env.example .env.local
```

Abra `.env.local` num editor e preencha `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY` — como conseguir esses valores está em [SUPABASE.md](./SUPABASE.md#pegar-as-credenciais).

### 5. Rodar

```bash
npm run dev
```

Abre em [http://localhost:5173](http://localhost:5173).

---

## Windows

### 1. Instalar o Node.js

Duas opções — qualquer uma funciona:

- **Mais simples**: baixe o instalador do Node **22 LTS** em [nodejs.org](https://nodejs.org) e instale normalmente (Next, Next, Finish).
- **Se for trabalhar com outros projetos que usam versões diferentes de Node**: instale o [nvm-windows](https://github.com/coreybutler/nvm-windows/releases) (baixe o `nvm-setup.exe`), depois no PowerShell:
  ```powershell
  nvm install 22
  nvm use 22
  ```

Confirme a instalação (PowerShell ou Prompt de Comando):

```powershell
node -v
# deve mostrar v22.x.x
```

### 2. Instalar o Git

Se ainda não tiver: [git-scm.com/download/win](https://git-scm.com/download/win).

### 3. Clonar o repositório

```powershell
git clone <URL_DO_REPOSITORIO>
cd agrotech-portal
```

### 4. Instalar as dependências

```powershell
npm install
```

> Se você instalou o Node direto do site (não usou nvm-windows), pode pular o `nvm use` — só confirme com `node -v` que está na versão 22.

### 5. Configurar variáveis de ambiente

```powershell
Copy-Item .env.example .env.local
```

Abra `.env.local` no Bloco de Notas (ou VS Code: `code .env.local`) e preencha `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY` — ver [SUPABASE.md](./SUPABASE.md#pegar-as-credenciais).

### 6. Rodar

```powershell
npm run dev
```

Abre em [http://localhost:5173](http://localhost:5173).

---

## Scripts disponíveis

| Comando | O que faz |
| --- | --- |
| `npm run dev` | Sobe o servidor de desenvolvimento (hot reload) |
| `npm run build` | Confere os tipos e gera o build de produção em `dist/` |
| `npm run preview` | Serve localmente o build de produção (pra testar antes de subir) |
| `npm run typecheck` | Só confere os tipos, sem gerar build |
| `npm run lint` | Roda o linter (oxlint) |

Rode `npm run typecheck && npm run lint` antes de qualquer commit — é rápido e pega a maioria dos erros bobos.

## Problemas comuns

**`npm install` trava ou dá timeout de conexão**
Provavelmente o `registry` do npm da sua máquina está apontando pra outro lugar (comum se você usa esse computador pra projetos de trabalho com um registry corporativo/privado). Rode:
```bash
npm config get registry
```
Se não for `https://registry.npmjs.org/`, o projeto já tem um `.npmrc` próprio corrigindo isso só para esta pasta — então rodar `npm install` de dentro da pasta `agrotech-portal` deve funcionar mesmo assim. Se ainda assim der erro, apague `node_modules` e `package-lock.json` e rode `npm install` de novo.

**`npm run lint` quebra com um erro mencionando "native binding" ou "Cannot find module"**
Quase sempre é versão errada do Node. Confirme com `node -v` — precisa ser `22.x`. No Mac/Linux, `nvm use` dentro da pasta do projeto resolve. No Windows, reinstale o Node 22 ou rode `nvm use 22` se estiver usando nvm-windows.

**A tela abre em branco, ou o console do navegador mostra erro mencionando "Supabase"**
Falta configurar (ou está errado) o `.env.local`. Confira:
- O arquivo `.env.local` existe na raiz do projeto (não é o `.env.example`)
- `VITE_SUPABASE_URL` **não** termina em `/rest/v1/` — é só `https://SEU-PROJETO.supabase.co`
- Depois de editar `.env.local`, é preciso reiniciar o `npm run dev` (o Vite só lê as variáveis de ambiente na inicialização)

**Erro dizendo que uma tabela não existe (ex: `relation "lotes" does not exist`)**
O schema não foi aplicado no projeto Supabase ainda — ver [SUPABASE.md](./SUPABASE.md#aplicar-o-schema).
