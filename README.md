# Mi Aula de Oposiciones – web

Web pública del portal (fase 1). React + Vite + TypeScript + Tailwind + componentes estilo shadcn/ui.

## Arrancar en tu PC
1. `npm install` (solo la primera vez)
2. `npm run dev` y abre la dirección que aparece (normalmente http://localhost:5173)

## Otras órdenes
- `npm run build`: genera la versión para publicar en la carpeta `dist`.
- `npm run preview`: prueba esa versión en local.

## Dónde está cada cosa
- `src/pages/`: una página por archivo (portada, catálogo, ficha, método, recursos, planes, legales).
- `src/data/catalogo.ts`: datos del catálogo (provisional, pasará a Supabase).
- `src/index.css`: colores del diseño (terracota y crema, modo claro y oscuro).
- `vercel.json`: hace que las rutas funcionen al publicar en Vercel.
