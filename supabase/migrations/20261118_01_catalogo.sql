-- Catálogo público de Mi Aula de Oposiciones (esquema aula)
-- Crea las tablas del catálogo, activa la seguridad por filas (RLS) y deja
-- solo LECTURA para el público. Escribir solo se puede con la clave secreta
-- (service_role) o desde el SQL Editor de Supabase.
-- Se puede ejecutar varias veces sin romper nada.

create schema if not exists aula;

-- Familias de oposiciones (Informática, Administrativo…)
create table if not exists aula.familias (
  slug        text primary key,
  nombre      text not null,
  descripcion text not null default '',
  activa      boolean not null default false,
  orden       int not null default 0
);

-- Oposiciones (cada convocatoria tipo)
create table if not exists aula.oposiciones (
  slug            text primary key,
  familia_slug    text not null references aula.familias(slug),
  nombre          text not null,
  organismo       text not null,
  ambito          text not null check (ambito in ('estado','ccaa','local')),
  grupo           text not null check (grupo in ('A1','A2','C1','C2')),
  estado          text not null check (estado in ('abierta','prevista','en_preparacion')),
  material        text not null check (material in ('disponible','en_preparacion')),
  num_temas       int,
  num_preguntas   int,
  num_supuestos   int,
  actualizado     date,
  resumen         text not null default '',
  requisitos      jsonb not null default '[]'::jsonb,
  formato_examen  jsonb,
  fuente_texto    text not null default '',
  fuente_url      text not null default '',
  ejemplo         boolean not null default true,
  orden           int not null default 0
);

-- Cuadernos (bloques de temario reutilizables y productos como psicotécnicos)
create table if not exists aula.cuadernos (
  slug           text primary key,
  tipo           text not null check (tipo in ('temario','psicotecnicos')),
  titulo         text not null,
  subtitulo      text not null default '',
  etiqueta       text not null default '',
  edicion        text not null default '',
  num_temas      int not null default 0,
  num_preguntas  int not null default 0,
  num_supuestos  int not null default 0,
  paginas        int,
  actualizado    date,
  orden          int not null default 0,
  publicado      boolean not null default false
);

-- Temas de cada cuaderno (solo datos de catálogo, no el texto completo)
create table if not exists aula.temas (
  id             bigint generated always as identity primary key,
  cuaderno_slug  text not null references aula.cuadernos(slug) on delete cascade,
  orden          int not null,
  titulo         text not null,
  corto          text not null,
  aprender       jsonb not null default '[]'::jsonb,
  num_preguntas  int not null default 0,
  incluye        text not null default 'Supuesto práctico',
  unique (cuaderno_slug, orden)
);

-- Qué cuadernos forman el temario de cada oposición (un cuaderno puede estar en varias)
create table if not exists aula.oposicion_cuadernos (
  oposicion_slug text not null references aula.oposiciones(slug) on delete cascade,
  cuaderno_slug  text not null references aula.cuadernos(slug) on delete cascade,
  orden          int not null default 0,
  primary key (oposicion_slug, cuaderno_slug)
);

-- Seguridad por filas: activada en todas las tablas
alter table aula.familias            enable row level security;
alter table aula.oposiciones         enable row level security;
alter table aula.cuadernos           enable row level security;
alter table aula.temas               enable row level security;
alter table aula.oposicion_cuadernos enable row level security;

-- Políticas: cualquiera puede LEER el catálogo (solo cuadernos publicados)
drop policy if exists "leer familias" on aula.familias;
create policy "leer familias" on aula.familias for select to anon, authenticated using (true);

drop policy if exists "leer oposiciones" on aula.oposiciones;
create policy "leer oposiciones" on aula.oposiciones for select to anon, authenticated using (true);

drop policy if exists "leer cuadernos publicados" on aula.cuadernos;
create policy "leer cuadernos publicados" on aula.cuadernos for select to anon, authenticated using (publicado);

drop policy if exists "leer temas publicados" on aula.temas;
create policy "leer temas publicados" on aula.temas for select to anon, authenticated
  using (exists (select 1 from aula.cuadernos c where c.slug = cuaderno_slug and c.publicado));

drop policy if exists "leer enlaces" on aula.oposicion_cuadernos;
create policy "leer enlaces" on aula.oposicion_cuadernos for select to anon, authenticated using (true);

-- Permisos del esquema (necesarios en Supabase autoalojado con esquema propio)
grant usage on schema aula to anon, authenticated, service_role;
grant select on all tables in schema aula to anon, authenticated;
grant all on all tables in schema aula to service_role;
alter default privileges in schema aula grant select on tables to anon, authenticated;
alter default privileges in schema aula grant all on tables to service_role;

-- Datos fijos: familias y oposiciones del catálogo (los cuadernos van en supabase/seed)
insert into aula.familias (slug, nombre, descripcion, activa, orden) values
  ('informatica', 'Informática', 'Técnicos y analistas de sistemas, redes, seguridad y desarrollo para cualquier Administración.', true, 1),
  ('administrativo', 'Administrativo', 'Cuerpos administrativos del Estado, de las comunidades autónomas y de la Administración local.', false, 2),
  ('auxiliar-administrativo', 'Auxiliar Administrativo', 'La puerta de entrada más habitual al empleo público.', false, 3)
on conflict (slug) do update set nombre = excluded.nombre, descripcion = excluded.descripcion, activa = excluded.activa, orden = excluded.orden;

insert into aula.oposiciones (slug, familia_slug, nombre, organismo, ambito, grupo, estado, material, resumen, requisitos, formato_examen, fuente_texto, fuente_url, ejemplo, orden) values
  ('analista-programador-informatica-local-c1', 'informatica', 'Analista/Programador de Informática', 'Administración local (ayuntamientos)', 'local', 'C1', 'prevista', 'disponible',
   'Plaza técnica de informática en ayuntamientos: administración de sistemas y redes, seguridad, bases de datos, virtualización y servicios web, más un temario general de derecho administrativo y régimen local.',
   '["Nacionalidad española o de un Estado de la Unión Europea, en los términos del art. 57 del TREBEP.","Tener cumplidos 16 años y no superar la edad máxima de jubilación forzosa.","Título de Bachiller o Técnico (grupo C1, art. 76 del TREBEP), salvo lo que digan las bases.","Capacidad funcional para el desempeño de las tareas.","No haber sido separado ni estar inhabilitado para el empleo público."]'::jsonb,
   '[{"nombre":"Primer ejercicio","descripcion":"Test sobre el temario general y específico, normalmente con penalización por respuesta errónea."},{"nombre":"Segundo ejercicio","descripcion":"Supuesto práctico sobre el temario específico."},{"nombre":"Fase de concurso","descripcion":"Solo si la convocatoria es de concurso-oposición: méritos de experiencia y formación."}]'::jsonb,
   'Boletín Oficial de la provincia o comunidad correspondiente', 'https://www.boe.es/', true, 1),
  ('tai-tecnico-auxiliar-informatica-estado-c1', 'informatica', 'Técnico Auxiliar de Informática (TAI)', 'Administración General del Estado', 'estado', 'C1', 'prevista', 'en_preparacion',
   'Cuerpo técnico de informática del Estado. Gran parte del temario específico (redes, sistemas, bases de datos, seguridad) se comparte con otras oposiciones del catálogo.',
   '["Nacionalidad española o de un Estado de la Unión Europea, en los términos del art. 57 del TREBEP.","Tener cumplidos 16 años y no superar la edad máxima de jubilación forzosa.","Título de Bachiller o Técnico (grupo C1, art. 76 del TREBEP), salvo lo que digan las bases.","Capacidad funcional para el desempeño de las tareas.","No haber sido separado ni estar inhabilitado para el empleo público."]'::jsonb,
   null, 'Boletín Oficial del Estado (BOE)', 'https://www.boe.es/', true, 2),
  ('gsi-gestion-sistemas-informatica-estado-a2', 'informatica', 'Gestión de Sistemas e Informática (GSI)', 'Administración General del Estado', 'estado', 'A2', 'prevista', 'en_preparacion',
   'Cuerpo de gestión de sistemas e informática del Estado, con mayor peso en dirección de proyectos y arquitectura de sistemas.',
   '["Nacionalidad española o de un Estado de la Unión Europea, en los términos del art. 57 del TREBEP.","Tener cumplidos 16 años y no superar la edad máxima de jubilación forzosa.","Título universitario de Grado (grupo A2, art. 76 del TREBEP), salvo lo que digan las bases.","Capacidad funcional para el desempeño de las tareas.","No haber sido separado ni estar inhabilitado para el empleo público."]'::jsonb,
   null, 'Boletín Oficial del Estado (BOE)', 'https://www.boe.es/', true, 3)
on conflict (slug) do update set nombre = excluded.nombre, organismo = excluded.organismo, resumen = excluded.resumen,
  requisitos = excluded.requisitos, formato_examen = excluded.formato_examen, orden = excluded.orden;
