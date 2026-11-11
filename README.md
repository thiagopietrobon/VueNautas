# VueNautas

[![Vue 3](https://img.shields.io/badge/Vue-3-42b883?logo=vue.js&logoColor=white)](https://vuejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-6-3178c6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-8-646cff?logo=vite&logoColor=white)](https://vite.dev/)
[![Deploy](https://img.shields.io/badge/deploy-GitHub%20Pages-2ea44f?logo=github)](https://thiagopietrobon.github.io/VueNautas/)
[![API](https://img.shields.io/badge/API-Render-46e3b7?logo=render&logoColor=white)](https://vuenautas.onrender.com/projetos)

Gerenciador de Tarefas Acadêmicas desenvolvido como trabalho de **G2** da disciplina de Desenvolvimento Web/Frontend.

- **Aplicação publicada:** <https://thiagopietrobon.github.io/VueNautas/>
- **API publicada:** <https://vuenautas.onrender.com>

## Sobre o projeto

O VueNautas permite organizar projetos acadêmicos e suas atividades em um só lugar. As tarefas podem ser acompanhadas em uma **visão de lista** ou em um **quadro Kanban**, com filtros por título, status e prioridade. O cadastro, a edição, a mudança de status e a exclusão são feitos diretamente pela interface, consumindo uma API REST (`json-server`) publicada no [Render](https://render.com/).

### Integrantes

- Thiago
- Eduarda
- Corina

## Funcionalidades

- **Visão de lista**: tarefas exibidas em cartões com status, prioridade, responsável e prazo.
- **Visão de quadro (Kanban)**: tarefas agrupadas nas colunas *A fazer*, *Em andamento*, *Em revisão* e *Concluída*.
- **Filtros combináveis**: busca por título, status e prioridade, com opção de limpar os filtros.
- **CRUD de tarefas**: criar, visualizar, editar e excluir tarefas.
- **Mudança de status rápida**: alteração do status direto no cartão da tarefa.
- **CRUD de projetos**: criar, visualizar e editar projetos acadêmicos.
- **Tarefas vinculadas ao projeto**: cada tarefa pertence a um projeto, e o detalhe do projeto lista suas atividades.
- **Navegação entre entidades**: a partir de uma tarefa é possível acessar o projeto relacionado, e vice-versa.
- **Estados de interface**: telas de carregamento, mensagens de erro com opção de tentar novamente e estados vazios.
- **Layout responsivo** e navegação acessível.

## Tecnologias

| Tecnologia | Uso |
| --- | --- |
| [Vue 3](https://vuejs.org/) | Framework da interface (Composition API + `<script setup>`) |
| [TypeScript](https://www.typescriptlang.org/) | Tipagem estática dos dados e componentes |
| [Vite](https://vite.dev/) | Build e servidor de desenvolvimento |
| [Vue Router](https://router.vuejs.org/) | Roteamento SPA com `createWebHashHistory` |
| [Pinia](https://pinia.vuejs.org/) | Estado global dos filtros de tarefas |
| [json-server](https://github.com/typicode/json-server) | API REST local baseada em `db.json` |
| [vue-tsc](https://github.com/vuejs/language-tools) | Verificação de tipos no build |

## Rotas

| Rota | Descrição |
| --- | --- |
| `/` | Lista de tarefas |
| `/quadro` | Quadro Kanban de tarefas |
| `/tarefas/nova` | Formulário de nova tarefa |
| `/tarefas/:id` | Detalhe da tarefa |
| `/tarefas/:id/editar` | Edição da tarefa |
| `/projetos` | Lista de projetos |
| `/projetos/novo` | Formulário de novo projeto |
| `/projetos/:id` | Detalhe do projeto e suas tarefas |
| `/projetos/:id/editar` | Edição do projeto |

## Como executar localmente

### Pré-requisitos

- [Node.js](https://nodejs.org/) **20.19+** ou **22.12+** (requisito do Vite 8)
- npm

### Passos

1. Instale as dependências:

   ```bash
   npm install
   ```

2. Em um terminal, inicie a API local:

   ```bash
   npm run api
   ```

   A API ficará disponível em `http://localhost:3000`.

3. Em outro terminal, inicie a aplicação:

   ```bash
   npm run dev
   ```

4. Acesse `http://localhost:5173/VueNautas/`.

> O `postinstall` executa `scripts/patch-json-server.js`, que ajusta o `json-server` para gerar IDs sequenciais ao criar registros.

### Scripts disponíveis

| Comando | Descrição |
| --- | --- |
| `npm run dev` | Inicia o servidor de desenvolvimento do Vite |
| `npm run api` | Inicia o `json-server` na porta 3000 |

## Estrutura do projeto

```text
.
├── .github/workflows/deploy.yml   # CI/CD para o GitHub Pages
├── db.json                        # Dados usados pelo json-server
├── db.seed.json                   # Dados iniciais para reposição
├── scripts/patch-json-server.js   # Patch de IDs sequenciais
├── public/
├── src/
│   ├── api.ts                     # Cliente HTTP da API
│   ├── router.ts                  # Rotas da aplicação
│   ├── tipos.ts                   # Tipos de Projeto, Tarefa, Status e Prioridade
│   ├── derivar.ts                 # Filtros e agrupamento por status
│   ├── filtrosStore.ts            # Store Pinia dos filtros
│   ├── utils.ts                   # Funções auxiliares (formatação de data)
│   ├── App.vue                    # Cabeçalho, navegação e layout base
│   ├── ListaTarefas.vue
│   ├── QuadroTarefas.vue
│   ├── ListaProjetos.vue
│   ├── DetalheTarefa.vue
│   ├── DetalheProjeto.vue
│   ├── FormularioTarefa.vue
│   ├── FormularioProjeto.vue
│   ├── components/
│   │   ├── BarraFiltros.vue
│   │   ├── CartaoTarefa.vue
│   │   ├── CartaoProjeto.vue
│   │   ├── EstadoConsulta.vue
│   │   └── AlternadorVisaoTarefas.vue
│   └── composables/
│       └── useTarefas.ts          # Carregamento, atualização e exclusão de tarefas
├── index.html
└── vite.config.ts
```

## API e modelo de dados

A aplicação consome uma API REST via `fetch`. A URL é definida pela variável de ambiente `VITE_API_URL`:

| Ambiente | URL da API |
| --- | --- |
| Desenvolvimento local | `http://localhost:3000` (definida em `.env.development`) |
| Produção | `https://vuenautas.onrender.com` (variável `VITE_API_URL` no GitHub Actions) |

> A API está hospedada no plano gratuito do Render. Após um período de inatividade, a primeira requisição pode demorar alguns segundos enquanto o serviço é reativado.

### Projeto

```json
{
  "id": "1",
  "nome": "Gerenciador de Tarefas",
  "descricao": "Projeto em equipe da disciplina",
  "disciplina": "Desenvolvimento Frontend",
  "criadoEm": "2026-10-01"
}
```

### Tarefa

```json
{
  "id": "1",
  "projetoId": "1",
  "titulo": "Criar o repositório",
  "descricao": "Repositório da equipe no GitHub",
  "status": "concluida",
  "prioridade": "alta",
  "responsavel": "Ana",
  "prazo": "2026-10-06"
}
```

- **Status:** `a-fazer`, `em-andamento`, `em-revisao`, `concluida`
- **Prioridade:** `baixa`, `media`, `alta`

O arquivo `db.json` é usado pelo `json-server`. O arquivo `db.seed.json` mantém os dados iniciais para reposição manual quando necessário.

## Deploy (GitHub Pages)

O deploy é automático pelo workflow [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml) a cada push na branch `main` (ou manualmente em **Actions > Deploy no GitHub Pages > Run workflow**).

Aplicação publicada: <https://thiagopietrobon.github.io/VueNautas/>
<<<<<<< HEAD

### Configuração inicial

1. No GitHub, acesse **Settings > Pages** e defina **Source** como **GitHub Actions**. O workflow também tenta habilitar o Pages automaticamente.
2. Em **Settings > Secrets and variables > Actions > Variables**, confirme a variável `VITE_API_URL` com o valor `https://vuenautas.onrender.com`.
3. Faça push na branch `main`.

> O GitHub Pages hospeda apenas o front-end estático. A API (`json-server`) está publicada no Render em <https://vuenautas.onrender.com>, com CORS habilitado para o site.
=======
>>>>>>> 9cd6dd6fcd502011c964fc7bfbe476ef9b7e134b
