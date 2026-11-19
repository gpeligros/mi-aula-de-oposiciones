-- Mi Aula de Oposiciones · Descarga de los PDF (cuadernos y pack completo)
-- Se puede ejecutar varias veces sin problema (idempotente).
--
-- Qué hace:
--   1. Crea en Supabase Storage un "cajón" (bucket) PRIVADO llamado "cuadernos".
--      Solo admite PDF de hasta 20 MB.
--   2. Regla de seguridad: solo los usuarios con sesión iniciada pueden leer
--      (descargar) sus ficheros. Nadie puede subir ni borrar desde la web:
--      los PDF se suben a mano desde Studio.
--   3. Guarda en la base de datos el nombre del PDF de cada cuaderno y del pack.

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('cuadernos', 'cuadernos', false, 20971520, array['application/pdf'])
on conflict (id) do update
  set public = false, file_size_limit = excluded.file_size_limit, allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "descargar cuadernos con sesion" on storage.objects;
create policy "descargar cuadernos con sesion" on storage.objects
  for select to authenticated
  using (bucket_id = 'cuadernos');

alter table aula.cuadernos   add column if not exists pdf text;
alter table aula.oposiciones add column if not exists pack_pdf text;

update aula.cuadernos set pdf = v.pdf
from (values
  ('redes',          '01_Mi_Aula_Redes_y_comunicaciones.pdf'),
  ('seguridad',      '02_Mi_Aula_Seguridad_ENS_y_auditoria.pdf'),
  ('sistemas',       '03_Mi_Aula_Sistemas_operativos_y_mantenimiento.pdf'),
  ('virtualizacion', '04_Mi_Aula_Virtualizacion_cloud_y_CPD.pdf'),
  ('almacenamiento', '05_Mi_Aula_Almacenamiento_directorio_y_copias.pdf'),
  ('bases-de-datos', '06_Mi_Aula_Bases_de_datos.pdf'),
  ('servicios-web',  '07_Mi_Aula_Servicios_web_CMS_y_correo.pdf'),
  ('normativa-comun','08_Mi_Aula_Normativa_comun.pdf'),
  ('regimen-local',  '09_Mi_Aula_Regimen_local.pdf'),
  ('psicotecnicos',  '10_Mi_Aula_Psicotecnicos.pdf')
) as v(slug, pdf)
where aula.cuadernos.slug = v.slug;

update aula.oposiciones set pack_pdf = '00_Mi_Aula_Pack_completo_Informatica.pdf'
where slug = 'analista-programador-informatica-local-c1';
