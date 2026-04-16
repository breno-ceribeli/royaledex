# RoyaleDex

<p align="left">
  <img alt="Deploy Web" src="https://img.shields.io/badge/web-royaledex.vercel.app-0D1B2A?style=flat-square&logo=vercel&logoColor=white" />
  <img alt="Deploy Backend" src="https://img.shields.io/badge/api-royaledex.onrender.com-0D1B2A?style=flat-square&logo=render&logoColor=white" />
  <img alt="React" src="https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react&logoColor=black" />
  <img alt="Flutter" src="https://img.shields.io/badge/Flutter-3.24-02569B?style=flat-square&logo=flutter&logoColor=white" />
  <img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript&logoColor=white" />
  <img alt="Firebase" src="https://img.shields.io/badge/Firebase-Auth%20%2B%20Firestore-FFCA28?style=flat-square&logo=firebase&logoColor=black" />
  <img alt="License" src="https://img.shields.io/badge/license-MIT-green?style=flat-square" />
</p>

**RoyaleDex** é uma plataforma de estatísticas do Clash Royale com duas interfaces (web e mobile) que compartilham o mesmo backend e base de autenticação.

O projeto foi desenvolvido como trabalho acadêmico e está organizado como um monorepo com três camadas independentes: backend em Node.js/Express, frontend web em React e aplicativo mobile em Flutter.

---

## Visão geral

| Camada | Tecnologia | Hospedagem |
|---|---|---|
| Backend | Node.js + Express + TypeScript | Render |
| Web | React + Vite + TypeScript + Tailwind | Vercel |
| Mobile | Flutter (Android + Web) | APK / Firebase Hosting |
| Auth | Firebase Auth | Firebase |
| Banco de dados | Cloud Firestore | Firebase |

---

## Funcionalidades

- Autenticação com Google e email/senha
- Busca de jogadores por tag
- Listagem de cartas com filtros por elixir e raridade
- Perfil completo do jogador com estatísticas, análise de batalhas e histórico
- Favoritos por usuário autenticado
- Documentação interativa da API via Swagger

---

## Estrutura do repositório

```
royaledex/
  app/        # Flutter — Android e Web
  backend/    # Express + TypeScript
  web/        # React + Vite + TypeScript
```

Cada camada tem seu próprio README com instruções detalhadas de configuração e execução:

- [`app/README.md`](app/README.md) — Flutter
- [`backend/README.md`](backend/README.md) — Express API
- [`web/README.md`](web/README.md) — React Web

---

## Arquitetura

O fluxo principal da aplicação:

1. O usuário acessa a interface web ou o app Flutter.
2. A autenticação é feita diretamente com o Firebase Auth, que retorna um ID Token.
3. As interfaces enviam requisições ao backend com o token no header `Authorization`.
4. O backend valida o token, consulta a API do Clash Royale e/ou o Firestore, e retorna os dados.

```
React Web / Flutter App
  │
  ├─→ Firebase Auth  (login direto — emite ID Token)
  │
  └─→ Backend Express (Render)
         ├─→ Clash Royale API  (dados do jogo)
         └─→ Cloud Firestore   (favoritos por usuário)
```

---

## Links

- 🌐 Aplicação web: [royaledex.vercel.app](https://royaledex.vercel.app)
- 📱 APK Android: [Github Release](https://github.com/breno-ceribeli/royaledex/releases/tag/v1.0.0)
- 📄 API (Swagger): [royaledex.onrender.com/api-docs](https://royaledex.onrender.com/api-docs)

---

## Licença

Distribuído sob a licença MIT. Veja [LICENSE](LICENSE) para mais detalhes.

Não afiliado à Supercell. Clash Royale é marca registrada da Supercell.
