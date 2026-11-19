import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { supabase } from "@/lib/supabase";
import {
  familias as familiasFijas, oposiciones as oposicionesFijas,
  type Cuaderno, type Familia, type Oposicion, type TemaCuaderno,
} from "@/data/catalogo";
import generado from "@/data/cuadernos.generado.json";

// Catálogo de la web: oposiciones, cuadernos y temas.
// 1.º intenta leerlo de Supabase (esquema aula). 2.º si no hay conexión o falla,
// usa los datos incluidos en el código (plan B), para que la web nunca se quede vacía.

export interface Catalogo {
  familias: Familia[];
  oposiciones: Oposicion[];
  cuadernos: Cuaderno[];
  temas: TemaCuaderno[];
  origen: "supabase" | "local";
  cargando: boolean;
}

const fecha = (iso: string | null) => (iso ? iso.split("-").reverse().join("/") : null);

function catalogoLocal(): Omit<Catalogo, "cargando"> {
  const cuadernos: Cuaderno[] = generado.cuadernos.map((c) => ({ ...c, tipo: c.tipo as Cuaderno["tipo"], actualizado: fecha(c.actualizado) }));
  const enlaces = generado.enlaces as Record<string, string[]>;
  const packs = generado.packs as Record<string, string>;
  const oposiciones = oposicionesFijas.map((o) => {
    const lista = enlaces[o.slug];
    if (!lista) return o;
    const cs = cuadernos.filter((c) => lista.includes(c.slug));
    return {
      ...o, cuadernos: lista, bloques: [], material: "disponible" as const, packPdf: packs[o.slug] ?? null,
      numTemas: cs.reduce((a, c) => a + c.numTemas, 0),
      numPreguntas: cs.reduce((a, c) => a + c.numPreguntas, 0),
      numSupuestos: cs.reduce((a, c) => a + c.numSupuestos, 0),
      actualizado: fecha(generado.generado),
    };
  });
  return { familias: familiasFijas, oposiciones, cuadernos, temas: generado.temas, origen: "local" };
}

async function catalogoSupabase(): Promise<Omit<Catalogo, "cargando">> {
  if (!supabase) throw new Error("Sin Supabase");
  const [f, o, c, t, e] = await Promise.all([
    supabase.from("familias").select("*").order("orden"),
    supabase.from("oposiciones").select("*").order("orden"),
    supabase.from("cuadernos").select("*").order("orden"),
    supabase.from("temas").select("*").order("orden"),
    supabase.from("oposicion_cuadernos").select("*").order("orden"),
  ]);
  const error = f.error || o.error || c.error || t.error || e.error;
  if (error) throw error;
  return {
    origen: "supabase",
    familias: f.data!.map((x) => ({ slug: x.slug, nombre: x.nombre, descripcion: x.descripcion, activa: x.activa })),
    cuadernos: c.data!.map((x) => ({
      slug: x.slug, tipo: x.tipo, titulo: x.titulo, subtitulo: x.subtitulo, etiqueta: x.etiqueta, edicion: x.edicion,
      numTemas: x.num_temas, numPreguntas: x.num_preguntas, numSupuestos: x.num_supuestos, paginas: x.paginas,
      actualizado: fecha(x.actualizado), orden: x.orden, pdf: x.pdf ?? null,
    })),
    temas: t.data!.map((x) => ({
      cuaderno: x.cuaderno_slug, orden: x.orden, titulo: x.titulo, corto: x.corto,
      aprender: x.aprender ?? [], numPreguntas: x.num_preguntas, incluye: x.incluye,
    })),
    oposiciones: o.data!.map((x) => ({
      slug: x.slug, familia: x.familia_slug, nombre: x.nombre, organismo: x.organismo, ambito: x.ambito, grupo: x.grupo,
      estado: x.estado, material: x.material, numTemas: x.num_temas, numPreguntas: x.num_preguntas, numSupuestos: x.num_supuestos,
      actualizado: fecha(x.actualizado), resumen: x.resumen, requisitos: x.requisitos ?? [], formatoExamen: x.formato_examen,
      bloques: [], fuenteOficial: { texto: x.fuente_texto, url: x.fuente_url }, ejemplo: x.ejemplo, packPdf: x.pack_pdf ?? null,
      cuadernos: e.data!.filter((y) => y.oposicion_slug === x.slug).map((y) => y.cuaderno_slug),
    })),
  };
}

const Contexto = createContext<Catalogo>({ ...catalogoLocal(), cargando: false });

export function CatalogoProvider({ children }: { children: ReactNode }) {
  const [catalogo, setCatalogo] = useState<Catalogo>({ ...catalogoLocal(), cargando: !!supabase });
  useEffect(() => {
    if (!supabase) return;
    let vivo = true;
    catalogoSupabase()
      .then((d) => vivo && setCatalogo({ ...d, cargando: false }))
      .catch((err) => {
        console.warn("Catálogo: no se pudo leer Supabase, se usan los datos locales.", err);
        if (vivo) setCatalogo((c) => ({ ...c, cargando: false }));
      });
    return () => { vivo = false; };
  }, []);
  return <Contexto.Provider value={catalogo}>{children}</Contexto.Provider>;
}

export const useCatalogo = () => useContext(Contexto);
