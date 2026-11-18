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

## Catálogo de cuadernos y Supabase (18/11/2026)
La web lee el catálogo (oposiciones, cuadernos y temas) de **Supabase, esquema `aula`**.
Si no hay Supabase configurado o no responde, usa los datos de `src/data` (plan B): la web nunca se queda vacía.

- `supabase/migrations/20261118_01_catalogo.sql`: crea las tablas con seguridad por filas (solo lectura pública) y carga familias y oposiciones.
- `supabase/seed/01_catalogo.sql`: carga los 10 cuadernos y sus 51 temas y los enlaza con la oposición de Analista/Programador.
- `scripts/generar_catalogo.py`: vuelve a generar el seed y `src/data/cuadernos.generado.json` a partir de los JSON de los cuadernos (herramienta `maqueta_venta` del proyecto de claude.ai).
- `.env.example`: copia a `.env` y pon la URL y la clave **anon** del Supabase del MiniPC. El `.env` no se sube a GitHub.

Requisito en el servidor: el esquema `aula` debe estar en `PGRST_DB_SCHEMAS` del `.env` de Supabase.
