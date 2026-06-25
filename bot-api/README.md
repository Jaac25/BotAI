# bot-api

API del chatbot (NestJS).

## Resumen

Servicio backend que expone puntos de entrada para el chatbot, utiliza herramientas locales (CSV) y servicios externos. Incluye documentación Swagger en `/api`.

## Requisitos

- Node.js 18+
- pnpm (recomendado)

## Instalación

```bash
pnpm install
```

## Variables de entorno

Puedes crear un archivo `.env` en la carpeta `bot-api` con estas variables:

```
# Puerto donde correrá la API (por defecto 3000)
PORT=3001

# Keys y configuración para LLM
LLM_API_KEY=
LLM_BASE_URL="https://openrouter.ai/api/v1"
LLM_MODEL="openrouter/owl-alpha"
MAX_ATTEMPS=10

# APP_ID para openexchangerates
CURRENCY_API_KEY=

```

Nota: en desarrollo recomiendo usar `PORT=3001` si también ejecutas el `front` en `3000`.

## Comandos útiles

- `pnpm run start` — Inicia la app (producción).
- `pnpm run start:dev` — Modo desarrollo (watch).
- `pnpm run build` — Compila TypeScript a `dist`.
- `pnpm run test` — Ejecuta tests.
- `pnpm run test:e2e` — Ejecuta tests e2e.

Ejemplo local rápido:

```bash
cd bot-api
PORT=3001 pnpm run start:dev
```

## Documentación (Swagger)

La documentación Swagger está montada en `/api`. Por ejemplo, si corres el backend en `http://localhost:3001`, abre `http://localhost:3001/api`.

## Endpoints comunes

- `POST /chatBot` — Enviar mensaje al chatbot (payload: `{ message: string }`).
- (Otros endpoints) — Revisa `/api` para ver los esquemas y rutas disponibles.

## Notas

- El proyecto ya incluye dependencias para `openai`, `csv-parser` y `swagger-ui-express`.
- Ajusta valores sensibles (API keys) en `.env` y no los subas a repositorios públicos.
