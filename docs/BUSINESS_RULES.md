# Regras de negócio

Este documento descreve **o que o sistema faz** em cada tela — as fórmulas, os efeitos colaterais de cada ação e as limitações conhecidas. Serve tanto pra quem for usar o app quanto pra quem for mexer no código (antes de "corrigir" um comportamento, confira se ele é intencional aqui).

O app tem 3 telas de domínio (Roça, Galpão, Finanças) mais um assistente de alertas. Todas consomem o mesmo banco Supabase — não existe lógica de negócio no servidor, tudo roda no frontend, então as regras abaixo estão implementadas em `src/components/` e `src/pages/`.

---

## Minha Roça (`/roca`)

### Lote (safra)

Um lote representa uma safra/plantio: `cultura`, `variedade`, `areaHectares`, `dataPlantio` e um `custoTotal` que vai sendo acumulado conforme operações são registradas.

- **Dias desde o plantio** = diferença em dias corridos entre hoje e `dataPlantio` (calculado no cliente, em [`src/lib/format.ts`](../src/lib/format.ts), função `diasDesde`).
- **Remover um lote** apaga também todo o histórico de movimentações dele (o banco está configurado com `on delete cascade` — ver [SUPABASE.md](./SUPABASE.md#schema)). A confirmação é só um `window.confirm` do navegador — não tem "lixeira" nem desfazer.

### Registrar Operação

Cada lote tem um formulário de "Registrar Operação" com 4 tipos. O que cada um faz:

| Tipo | O que acontece |
| --- | --- |
| **Insumo (produto existente do Galpão)** | `valor = quantidade × preço unitário do item`. Cria uma movimentação, **desconta a quantidade do estoque** do item, e **soma o valor ao `custoTotal` do lote**. Se a quantidade pedida for maior que o saldo em estoque, o sistema **avisa mas não bloqueia** o lançamento (saldo pode ficar negativo). |
| **Insumo → Compra Direta (produto novo)** | Se já existe um item de estoque com o mesmo nome (comparação sem diferenciar maiúscula/minúscula), a quantidade comprada é **somada** ao estoque existente e o preço unitário é **atualizado** para o novo valor informado. Se não existe, **cria um item novo** na categoria "Outros". Em ambos os casos, soma o valor ao `custoTotal` do lote. |
| **Mão de Obra** | Soma o valor informado direto ao `custoTotal` do lote. Não mexe em estoque. |
| **Diesel / Máquina** | Mesma lógica de Mão de Obra. |
| **Outros** | Campo livre de descrição + valor. Só soma ao `custoTotal` se um valor diferente de zero for informado. |

> **Nota para quem conhece o protótipo Python original**: no `aba_roca.py`, a "Compra Direta" registrava a quantidade comprada como **negativa** no estoque — isso foi corrigido na portagem (aqui incrementa corretamente).

### Diário

Além de "Registrar Operação", cada lote tem um campo de anotação livre (não afeta `custoTotal`, fica só como um registro de texto — tipo `nota` com valor 0).

**Excluir uma entrada do diário/histórico:**
1. Se a entrada tinha um item de estoque vinculado e uma quantidade, essa quantidade é **devolvida ao estoque**.
2. Se a entrada tinha um valor, ele é **subtraído do `custoTotal` do lote** (nunca deixa o total ficar negativo — usa `max(0, custoTotal - valor)`).
3. A entrada é removida.

Isso é diferente do protótipo Python original, que tentava fazer esse "estorno" reinterpretando o texto livre da anotação (frágil, e tinha um bug conhecido de import faltando). Aqui os dados já são estruturados, então o estorno é direto.

### Alertas de manejo

Cada card de lote mostra um alerta automático se aplicável, calculado em [`src/lib/alertas.ts`](../src/lib/alertas.ts):

| Cultura | Condição | Alerta |
| --- | --- | --- |
| Milho | 15 a 22 dias desde o plantio | "Janela ideal para ADUBAÇÃO DE COBERTURA!" |
| Milho | mais de 110 dias desde o plantio | "Ponto de colheita se aproximando." |

**Essa é a única regra implementada** — é exatamente a que existia no `assistente_agro.py` do protótipo original (que, aliás, rodava separado, por linha de comando, e nem estava integrado ao painel). Não existem regras para soja, café, cana ou qualquer outra cultura. Se for adicionar novas regras, isso exige conhecimento agronômico real — não é algo pra inventar limiares "que parecem razoáveis", já que é informação que orienta decisão de manejo de verdade.

---

## Meu Galpão (`/galpao`)

- **Valor de um item** = `quantidade × precoUnitario`.
- **Valor total do estoque** = soma do valor de todos os itens.
- **Estoque baixo**: indicador vermelho quando `quantidade ≤ 5`, verde caso contrário. É um limiar fixo no código (não configurável pela interface).
- **Novo Insumo**: mesma regra de "já existe? soma quantidade e atualiza preço — senão, cria novo" descrita acima para Compra Direta.
- **Excluir item**: exclusão direta, sem confirmar nada além do `window.confirm`. Se esse item já tinha movimentações vinculadas no histórico de algum lote, elas **não são apagadas** — só perdem a referência ao item (o `itemEstoqueId` some, mas a descrição textual da movimentação continua registrada).
- **Distribuição de valor por categoria**: mostrada como uma barra empilhada (uma cor fixa por categoria — Sementes, Adubos, Diesel, Defensivos, Outros, sempre nessa ordem).

---

## Finanças (`/financas`)

Todos os números da tela são calculados no cliente, cruzando dados das outras três tabelas:

```
valorArmazem  = Σ (quantidade × precoUnitario) de todos os itens do estoque
custosRoca    = Σ custoTotal de todos os lotes
valExtras     = Σ valor de todos os lançamentos financeiros avulsos
custosTotais  = custosRoca + valExtras
valVendas     = Σ valorTotal de todas as vendas
lucroTotal    = valVendas − custosTotais
margemTotal   = valVendas > 0 ? (lucroTotal / valVendas) × 100 : 0
```

**Ponto importante que confunde fácil**: existem *duas fontes diferentes* de custo que se somam em `custosTotais`:
1. O `custoTotal` de cada lote — que só cresce através de "Registrar Operação" na tela da Roça.
2. Os "Lançamentos Financeiros" (gastos operacionais) registrados direto na tela de Finanças — que **não** alteram o `custoTotal` do lote, mesmo que estejam vinculados a um lote específico. Eles entram na conta geral (`custosTotais`), mas não aparecem no card do lote na Roça.

Ou seja: um gasto pode estar "no lote" (via Roça) ou "geral, opcionalmente vinculado" (via Finanças) — são dois registros separados, não a mesma coisa vista de dois jeitos.

**Lançar Gasto Operacional**: cria um lançamento financeiro, com um lote vinculado opcional (ou "Geral" = sem vínculo).

**Lançar Venda de Safra**: cria uma venda vinculada a um lote (exige que exista pelo menos um lote cadastrado).

**Resultado por Lote**: mostra, por lote, a soma das vendas daquele lote — é receita bruta, não desconta o custo do próprio lote (o protótipo Python original também deixava isso como um "adicione aqui os gráficos que você criou antes", ou seja, incompleto de propósito).

---

## Limitações conhecidas

Vale ter em mente antes de "corrigir" algo que na verdade é uma limitação aceita:

- **Operações que mexem em mais de uma tabela não são atômicas.** Registrar um insumo, por exemplo, faz 3 chamadas separadas ao Supabase (criar movimentação → atualizar estoque → atualizar custo do lote). Se a conexão cair no meio, pode ficar inconsistente. Para uso de uma pessoa só, o risco é baixo; se isso virar um problema real, a solução é mover essa lógica pra uma função no Postgres (RPC) chamada de uma vez só, em vez de 3 chamadas do cliente.
- **Sem autenticação** — ver [SUPABASE.md](./SUPABASE.md#segurança-e-rls).
- **Vendas/lançamentos sem lote correspondente**: na migração dos dados antigos, alguns registros citavam um "lote" que não batia com nenhum lote cadastrado (ex: divergência de nome, ou o lote nunca foi cadastrado) — esses ficaram com `loteId` nulo. Isso pode voltar a acontecer manualmente se alguém digitar errado, mas a interface atual sempre usa uma lista suspensa dos lotes existentes, então na prática só acontece via importação de dados externos.
