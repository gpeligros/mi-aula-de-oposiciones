import { createClient, type SupabaseClient } from "@supabase/supabase-js";

// Conexión con Supabase (esquema "aula").
// Las variables se ponen en el archivo .env (nunca se suben a GitHub):
//   VITE_SUPABASE_URL=http://minipc:8000
//   VITE_SUPABASE_ANON_KEY=la clave pública "anon"
// Si faltan, la web funciona igual con los datos de src/data (plan B).
const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const clave = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

export const supabase: SupabaseClient<any, "aula"> | null =
  url && clave ? createClient(url, clave, { db: { schema: "aula" } }) : null;
