front (Next.js)

Interfaz web que consume la API del chatbot. Está creada con Next.js y Tailwind.

## Requisitos

- Node.js 18+
- pnpm (recomendado)

## Instalación y ejecución

```bash
cd front
pnpm install
pnpm run dev
```

La app estará disponible en `http://localhost:3000`.

## Variables de entorno

Crea un archivo `.env.local` en la carpeta `front` con las variables necesarias:

```
# URL base del backend (sin slash final)
NEXT_PUBLIC_HOST=http://localhost:3001
```

`NEXT_PUBLIC_HOST` se usa en el componente `Chat` para llamar a `POST /chatBot`.

## Scripts útiles

- `pnpm run dev` — Inicia el servidor de desarrollo.
- `pnpm run build` — Compila para producción.
- `pnpm run start` — Inicia el servidor en modo producción.

## Rutas y componentes importantes

- `src/pages/index.tsx` — Página principal.
- `src/components/Chat.tsx` — Componente principal del chat; envía mensajes a la API usando `NEXT_PUBLIC_HOST`.

## Despliegue

Recomiendo desplegar `front` en Vercel y configurar `NEXT_PUBLIC_HOST` en las variables de entorno del proyecto.

Si quieres, añado ejemplos `curl` para probar la API o un pequeño `docker-compose` para levantar `front` + `bot-api`.
