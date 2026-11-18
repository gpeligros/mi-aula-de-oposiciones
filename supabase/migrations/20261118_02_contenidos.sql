-- Mi Aula de Oposiciones · Contenido completo de los temas (lector web)
-- Se puede ejecutar varias veces sin problema (idempotente).
--
-- Qué hace:
--   1. Crea aula.contenidos_tema: el texto completo de cada tema (lo básico,
--      a fondo, repaso, trampas, supuesto y test) en un campo jsonb.
--   2. Activa la seguridad por filas (RLS): SOLO los usuarios con sesión
--      iniciada ("authenticated") pueden leerlo, y solo de cuadernos publicados.
--      Los visitantes anónimos ("anon") no pueden leer nada de esta tabla.

create table if not exists aula.contenidos_tema (
  cuaderno_slug  text not null references aula.cuadernos(slug) on delete cascade,
  orden          int  not null,
  contenido      jsonb not null,
  actualizado    date not null default current_date,
  primary key (cuaderno_slug, orden)
);

alter table aula.contenidos_tema enable row level security;

drop policy if exists "leer contenido con sesion" on aula.contenidos_tema;
create policy "leer contenido con sesion" on aula.contenidos_tema
  for select to authenticated
  using (exists (select 1 from aula.cuadernos c where c.slug = cuaderno_slug and c.publicado));

-- Permisos: el anónimo no tiene ni siquiera permiso de lectura (doble candado).
revoke all on aula.contenidos_tema from anon;
grant select on aula.contenidos_tema to authenticated;
grant all on aula.contenidos_tema to service_role;
