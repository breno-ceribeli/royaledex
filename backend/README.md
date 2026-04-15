# RoyaleDex Backend

API REST do projeto RoyaleDex, responsável por integrar com a API oficial do Clash Royale, expor endpoints para cartas e jogadores, gerenciar favoritos de usuários autenticados e aplicar segurança, validação e observabilidade básica.

## Stack

- Node.js + Express
- TypeScript
- Firebase Admin (Auth + Firestore)
- Swagger (OpenAPI 3.0)
- Helmet, CORS e rate limiting

---

## Arquitetura adotada

Estrutura em camadas com responsabilidades claras:

- `routes/` — define rotas e middlewares por recurso.
- `controllers/` — orquestra request/response e tratamento HTTP.
- `services/` — regra de negócio e integrações externas (Clash API, Firestore).
- `middlewares/` — autenticação e validações transversais.
- `config/` — bootstrap de Firebase e Swagger.
- `types/` — contratos e tipos compartilhados.

---

## Estrutura de pastas

```
backend/
  src/
    config/
      firebase.ts
      swagger.ts
    controllers/
      cards.controller.ts
      favorites.controller.ts
      players.controller.ts
    middlewares/
      auth.middleware.ts
    routes/
      cards.routes.ts
      favorites.routes.ts
      players.routes.ts
      index.ts
    services/
      clash.service.ts
      favorites.service.ts
    types/
      clash.types.ts
      express.d.ts
      favorites.types.ts
    server.ts
```

---

## Requisitos

- Node.js 18 ou superior
- npm 9 ou superior
- Projeto Firebase com Service Account configurada
- Token da API do Clash Royale

---

## Configuração de ambiente

Crie um arquivo `.env` na pasta `backend/` a partir do template:

```cmd
copy .env.example .env
```

Exemplo de `.env`:

```env
PORT=3001

CLASH_TOKEN=seu_token_da_api
CLASH_BASE_URL=https://proxy.royaleapi.dev/v1

FIREBASE_SERVICE_ACCOUNT={"type":"service_account","project_id":"..."}

ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000
```

### Variáveis esperadas

| Variável | Descrição |
|---|---|
| `PORT` | Porta do servidor (padrão `3001`) |
| `CLASH_TOKEN` | Bearer token da Clash Royale API |
| `CLASH_BASE_URL` | URL base da Clash Royale API |
| `FIREBASE_SERVICE_ACCOUNT` | JSON completo da service account em uma linha |
| `ALLOWED_ORIGINS` | Origens permitidas pelo CORS, separadas por vírgula |
| `RATE_LIMIT_WINDOW_MS` | Janela de tempo do rate limit em ms (opcional) |
| `RATE_LIMIT_MAX` | Máximo de requisições por janela (opcional) |

---

## Scripts

```cmd
npm run dev    # desenvolvimento com ts-node
npm run build  # compila TypeScript para dist/
npm run start  # executa a build compilada
```

---

## Como rodar localmente

```cmd
cd backend
npm install
npm run dev
```

Servidor disponível em: `http://localhost:3001`

Swagger UI: `http://localhost:3001/api-docs`

Health check: `http://localhost:3001/health`

---

## Endpoints principais

Base: `/api`

### Cartas

| Método | Rota | Descrição |
|---|---|---|
| `GET` | `/cards` | Lista cartas com suporte a busca e filtros |

### Jogadores

| Método | Rota | Descrição |
|---|---|---|
| `GET` | `/players/:tag` | Retorna perfil do jogador |
| `GET` | `/players/:tag/battlelog` | Retorna histórico recente de batalhas |
| `GET` | `/players/:tag/battlelog/stats` | Retorna agregações de desempenho |

### Favoritos (autenticado)

Necessita header: `Authorization: Bearer <firebase_id_token>`

| Método | Rota | Descrição |
|---|---|---|
| `GET` | `/favorites/players` | Lista favoritos do usuário |
| `POST` | `/favorites/players` | Adiciona favorito |
| `DELETE` | `/favorites/players/:tag` | Remove favorito por tag |
| `GET` | `/favorites/players/:tag/check` | Verifica se a tag está favoritada |

---

## Segurança e boas práticas aplicadas

- `helmet` para hardening de headers HTTP.
- `express-rate-limit` para mitigar abuso de requisições.
- CORS com allowlist configurável por variável de ambiente.
- Middleware de autenticação Firebase para todas as rotas protegidas.
- Tratamento de erros centralizado por controller com status HTTP apropriado.
- Service Account e tokens nunca expostos no código-fonte.

---

## Convenções de desenvolvimento

- Não acessar serviços externos diretamente da rota — use `services/`.
- Não concentrar regra de negócio no controller.
- Preferir tipos explicitamente declarados para payloads e respostas.
- Manter rotas protegidas sempre atrás do `authMiddleware`.

---

## Deploy

Hospedado no **Render** com deploy automático a cada push na branch `main` com mudanças em `backend/`.

Checklist mínimo para produção:

- `CLASH_TOKEN` válido com IP do Render cadastrado na Clash Royale API.
- `FIREBASE_SERVICE_ACCOUNT` correto e em formato JSON minificado (uma linha).
- `ALLOWED_ORIGINS` alinhado com os domínios dos frontends.
- Build command: `npm install && npm run build`
- Start command: `npm start`

---

## Troubleshooting

| Problema | Solução |
|---|---|
| `401 Unauthorized` em favoritos | Verifique o token Firebase no header `Authorization` |
| `403` ou `429` em consultas | Verifique limites da API externa e o rate limit local |
| Erro ao iniciar Firebase Admin | Valide o JSON de `FIREBASE_SERVICE_ACCOUNT` (formato e escape) |
| Servidor não conecta à Clash API | Confirme que o IP correto está cadastrado na chave da API |
