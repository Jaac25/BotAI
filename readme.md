# BotAI

Proyecto con dos partes:

1. `bot-api` — Backend en NestJS que expone el chatbot y la documentación Swagger.
2. `front` — Frontend en Next.js que consume la API y muestra el chat.

## Estructura

- `bot-api/` — API REST del chatbot.
- `front/` — Interfaz web.

## Cómo usar

1. Abre una terminal en la carpeta `bot-api` y ejecuta:

```bash
pnpm install
pnpm run start:dev
```

2. Abre otra terminal en la carpeta `front` y ejecuta:

```bash
pnpm install
pnpm run dev
```

3. Abre el navegador en `http://localhost:3000`.

## Enlaces útiles

- `bot-api/README.md` — Documentación del backend.
- `front/README.md` — Documentación del frontend.

## Notas

- Asegúrate de definir `NEXT_PUBLIC_HOST` en `front/.env.local` apuntando a la URL del backend.
- Si ejecutas ambos localmente, usa `PORT=3001` para `bot-api`.

## ChatBot Desplegado: https://bot-ai-inky.vercel.app/
