# KEEPER hub Finanças

Aplicação web MVP para gerenciamento financeiro pessoal, baseada nas telas do projeto KEEPER hub.

## Funcionalidades

- Dashboard financeiro em modo dark
- Saldo total
- Despesas mensais
- Lista de transações
- Cadastro de nova transação
- Receita e despesa
- Categorias
- Contas vinculadas
- Data e vencimento
- Status da transação
- Marcação de pagamentos como pagos
- Cadastro, consulta, edição e exclusão de contas pessoais
- Relatórios de receitas, despesas e saldo líquido
- Comparação mensal
- Filtros de relatórios
- Navegação horizontal entre módulos
- Botões de retorno padronizados
- Alerta de sucesso ao salvar uma transação

## Estrutura

```text
projetofigma/
├── index.html
├── transacoes.html
├── nova-transacao.html
├── relatorios.html
├── contas.html
├── vencimentos.html
├── style.css
├── script.js
└── README.md
```

## Backend Node.js

O backend fica isolado em `backend/` para não interferir no frontend estático.

```text
backend/
├── server.js
├── package.json
├── .env.example
├── database/schema.sql
└── src/
	├── config/database.js
	└── routes/
		├── contas.routes.js
		├── transacoes.routes.js
		└── relatorios.routes.js
```

### Iniciar a API

```bash
cd backend
npm install
copy .env.example .env
npm run dev
```

Antes de iniciar, execute `backend/database/schema.sql` no MySQL Workbench e preencha o arquivo `.env`.

Endpoints principais:

- `GET /api/health`
- `GET|POST|PUT|DELETE /api/contas`
- `GET|POST /api/transacoes`
- `PATCH /api/transacoes/:id/pagamento`
- `GET /api/relatorios/resumo`

## Arquivos principais

- `index.html`: dashboard inicial
- `transacoes.html`: consulta de transações
- `nova-transacao.html`: cadastro de receitas e despesas
- `relatorios.html`: indicadores e filtros financeiros
- `contas.html`: gerenciamento de contas pessoais
- `vencimentos.html`: próximos vencimentos
- `style.css`: estilos e responsividade
- `script.js`: interações e integração com a API
- `docs/modelo-conceitual-keeperhub.brM3`: modelo conceitual para abrir no brModelo

## Como executar

Abra o arquivo `index.html` no navegador ou use a extensão Live Server do VS Code.

O frontend estático usa a API Node.js para cadastrar contas e transações. A API persiste os dados no MySQL configurado em `backend/.env`.

## Node.js e MySQL

A estrutura está organizada com uma API Node.js e banco de dados MySQL Workbench. As páginas `nova-transacao.html` e `contas.html` já consomem os endpoints da API.

Entidades sugeridas:

- `usuarios`
- `contas`
- `categorias`
- `transacoes`
- `pagamentos`

Relacionamentos principais:

- Uma conta possui várias transações.
- Uma categoria pode estar associada a várias transações.
- Uma transação pode possuir um pagamento.
- Um usuário possui suas contas e transações.

## Status

MVP frontend implementado e publicado no GitHub:

https://github.com/infofieb/projetofigmafinancas
