# VueNautas
# Trabalho de G2 com a linguagem Vue.js
# Integrantes: Corina, Eduarda e Thiago.

## Executar o projeto

Instale as dependências:

```bash
npm install
```

Em um terminal, inicie a API local:

```bash
npm run api
```

Em outro terminal, inicie a aplicação:

```bash
npm run dev
```

O arquivo `db.json` é usado pelo `json-server`. O arquivo `db.seed.json` mantém os dados iniciais para reposição manual quando necessário.

## Deploy (GitHub Pages)

O deploy é automático pelo workflow [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml) a cada push na branch `main` (ou manualmente em **Actions > Deploy no GitHub Pages > Run workflow**).

### Configuração inicial

1. No GitHub, acesse **Settings > Pages** e defina **Source** como **GitHub Actions**. O workflow também tenta habilitar o Pages automaticamente.
2. Em **Settings > Secrets and variables > Actions > Variables**, cadastre a variável `VITE_API_URL` com a URL pública da API (por exemplo, `https://minha-api.exemplo.com`). Sem ela, o site usará `http://localhost:3000`.
3. Faça push na branch `main`. A aplicação ficará disponível em `https://thiagopietrobon.github.io/VueNautas/`.

> O GitHub Pages hospeda apenas o front-end estático. A API (`json-server`) precisa estar publicada em outro serviço e configurada em `VITE_API_URL` para que o CRUD funcione em produção.
