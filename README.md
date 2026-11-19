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

## Registro y lector de temas (18/11/2026)
- **Registro**: correo y contraseña con Supabase Auth (`/entrar`). En el MiniPC, durante la beta, sin correo de confirmación (`ENABLE_EMAIL_AUTOCONFIRM=true` en el `.env` de Supabase).
- **Lector**: `/cuadernos/:slug/tema/:orden` con pestañas (lo básico, a fondo, repaso, trampas, supuesto y test interactivo con nota).
- `supabase/migrations/20261118_02_contenidos.sql`: tabla `aula.contenidos_tema`. **Solo la leen usuarios con sesión** (RLS); el anónimo no tiene permiso.
- `supabase/seed/02_contenidos.sql`: el texto completo de los 51 temas (unos 1,5 MB). **Cárgalo siempre después del 01**, porque el 01 borra los cuadernos y con ellos sus contenidos.
- Sin Supabase (Vercel en la beta) el lector muestra "disponible muy pronto" y no se publica el contenido.

## PDF descargables (19/11/2026)
- `supabase/migrations/20261119_03_pdf.sql`: crea el cajón **privado** `cuadernos` en Supabase Storage (solo PDF, máx. 20 MB). Solo descargan usuarios con sesión, con un enlace firmado que caduca en 60 s.
- Los PDF **no se guardan en GitHub**: se suben a mano desde Studio → Storage → `cuadernos`, con su nombre original (`01_Mi_Aula_Redes_y_comunicaciones.pdf`, …, `00_Mi_Aula_Pack_completo_Informatica.pdf`).
- Botón "Descargar en PDF" en cada cuaderno y "Descargar el pack completo" en la ficha de la oposición (solo con sesión).
