# RoyaleDex

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
- 📱 APK Android: [Google Drive](https://drive.google.com/file/d/1Gtf08eiOTzbcw0V-HHfVmQtCnOekv5Te/view?usp=drive_link)
- 📄 API (Swagger): [royaledex.onrender.com/api-docs](https://royaledex.onrender.com/api-docs)

---

## Licença

Projeto de uso acadêmico e educacional.
Não afiliado à Supercell. Clash Royale é marca registrada da Supercell.
