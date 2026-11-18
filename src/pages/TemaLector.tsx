import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import { ArrowLeft, ArrowRight, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Bloques, Md, Tabla, type Bloque } from "@/components/Bloques";
import { TestInteractivo, type Pregunta } from "@/components/TestInteractivo";
import { useTitulo } from "@/lib/useTitulo";
import { supabase } from "@/lib/supabase";
import { useSesion } from "@/lib/sesion";
import { useCatalogo } from "@/data/useCatalogo";
import { cn } from "@/lib/utils";
import NotFound from "@/pages/NotFound";

type Contenido = {
  titulo: string;
  corto: string;
  fuentes?: string;
  basico: Bloque[];
  fondo: Bloque[];
  repaso: { mapa?: { head: string[]; rows: string[][] }; ideas?: string[]; extra?: Bloque[] };
  trampas: [string, string][];
  trampas_head?: [string, string];
  supuesto: { enunciado?: Bloque[]; solucion?: Bloque[]; libre?: Bloque[] };
  supuesto_banner?: [string, string];
  test: Pregunta[];
};

type Pestana = { id: string; nombre: string };

export default function TemaLector() {
  const { slug = "", orden = "" } = useParams();
  const n = Number(orden);
  const { pathname } = useLocation();
  const { disponible, sesion, cargando: cargandoSesion } = useSesion();
  const { cuadernos, temas, cargando: cargandoCat } = useCatalogo();
  const cuaderno = cuadernos.find((c) => c.slug === slug);
  const lista = temas.filter((t) => t.cuaderno === slug).sort((a, b) => a.orden - b.orden);
  const ficha = lista.find((t) => t.orden === n);
  const psico = cuaderno?.tipo === "psicotecnicos";

  const [cont, setCont] = useState<Contenido | null>(null);
  const [estado, setEstado] = useState<"cargando" | "ok" | "error">("cargando");
  const [activa, setActiva] = useState("basico");
  const panel = useRef<HTMLDivElement>(null);

  useTitulo(ficha ? `${ficha.corto} · ${cuaderno?.titulo ?? ""}` : "Tema");

  useEffect(() => {
    setActiva("basico");
    if (!supabase || !sesion) return;
    setEstado("cargando");
    supabase.from("contenidos_tema").select("contenido").eq("cuaderno_slug", slug).eq("orden", n).maybeSingle()
      .then(({ data, error }) => {
        if (error || !data) { setEstado("error"); return; }
        setCont(data.contenido as Contenido);
        setEstado("ok");
      });
  }, [slug, n, sesion]);

  if (!cuaderno || !ficha) return cargandoCat ? <p className="container py-16 text-muted-foreground">Cargando…</p> : <NotFound />;

  const volverFicha = (
    <Link to={`/cuadernos/${slug}`} className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary">
      <ArrowLeft aria-hidden className="h-4 w-4" /> {cuaderno.titulo}
    </Link>
  );

  // Sin sesión (o sin Supabase): pedimos registro
  if (!disponible || cargandoSesion || !sesion) {
    return (
      <section className="container max-w-xl py-16">
        {volverFicha}
        <div className="mt-8 rounded-lg border bg-card p-8 text-center">
          <Lock aria-hidden className="mx-auto h-8 w-8 text-primary" />
          <h1 className="mt-4 text-2xl font-bold">{ficha.titulo}</h1>
          {cargandoSesion ? <p className="mt-3 text-muted-foreground">Comprobando tu sesión…</p> : !disponible ? (
            <p className="mt-3 text-muted-foreground">El lector de temas estará disponible muy pronto en esta versión de la web.</p>
          ) : (
            <>
              <p className="mt-3 text-muted-foreground">Para leer el tema completo y hacer el test, entra o crea tu cuenta. Es gratis durante la beta.</p>
              <div className="mt-6 flex flex-wrap justify-center gap-3">
                <Button asChild><Link to={`/entrar?modo=registro&volver=${encodeURIComponent(pathname)}`}>Crear cuenta gratis</Link></Button>
                <Button asChild variant="outline"><Link to={`/entrar?volver=${encodeURIComponent(pathname)}`}>Ya tengo cuenta</Link></Button>
              </div>
            </>
          )}
        </div>
      </section>
    );
  }

  const pestanas: Pestana[] = [
    { id: "basico", nombre: "Lo básico" },
    { id: "fondo", nombre: "A fondo" },
    { id: "repaso", nombre: "Repaso" },
    { id: "trampas", nombre: psico ? "Errores típicos" : "Trampas" },
    { id: "supuesto", nombre: cont?.supuesto_banner?.[0] ?? (psico ? "Ejercicios resueltos" : "Supuesto") },
    { id: "test", nombre: `Test (${ficha.numPreguntas})` },
  ];

  const cambiar = (id: string) => {
    setActiva(id);
    panel.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };
  // Teclado en las pestañas: flechas izquierda/derecha, Inicio y Fin (patrón WAI-ARIA)
  const teclas = (e: KeyboardEvent<HTMLButtonElement>, i: number) => {
    const k = e.key;
    let j = -1;
    if (k === "ArrowRight") j = (i + 1) % pestanas.length;
    else if (k === "ArrowLeft") j = (i - 1 + pestanas.length) % pestanas.length;
    else if (k === "Home") j = 0;
    else if (k === "End") j = pestanas.length - 1;
    if (j < 0) return;
    e.preventDefault();
    setActiva(pestanas[j].id);
    document.getElementById(`pest-${pestanas[j].id}`)?.focus();
  };

  const idx = lista.findIndex((t) => t.orden === n);
  const anterior = lista[idx - 1];
  const siguiente = lista[idx + 1];

  return (
    <>
      <section className="bg-warm-cream">
        <div className="container py-8 md:py-10">
          {volverFicha}
          <p className="mt-4 text-sm font-semibold uppercase tracking-wide text-primary">{psico ? "Tipo" : "Tema"} {n} de {lista.length}</p>
          <h1 className="mt-1 text-2xl font-extrabold sm:text-3xl">{ficha.titulo}</h1>
        </div>
      </section>

      <div className="container max-w-4xl py-6">
        <div role="tablist" aria-label="Partes del tema" className="sticky top-16 z-30 -mx-4 flex gap-1 overflow-x-auto border-b bg-background/95 px-4 py-2 backdrop-blur sm:top-20">
          {pestanas.map((p, i) => (
            <button key={p.id} id={`pest-${p.id}`} role="tab" type="button" aria-selected={activa === p.id} aria-controls="panel-tema"
              tabIndex={activa === p.id ? 0 : -1} onClick={() => cambiar(p.id)} onKeyDown={(e) => teclas(e, i)}
              className={cn("whitespace-nowrap rounded-md px-3 py-2 text-sm font-medium",
                activa === p.id ? "bg-primary text-primary-foreground" : "text-foreground/80 hover:bg-muted")}>
              {p.nombre}
            </button>
          ))}
        </div>

        <div ref={panel} id="panel-tema" role="tabpanel" aria-labelledby={`pest-${activa}`} tabIndex={0} className="scroll-mt-40 py-8 outline-none">
          {estado === "cargando" && <p className="text-muted-foreground">Cargando el tema…</p>}
          {estado === "error" && <p role="alert" className="text-red-700">No se ha podido cargar el tema. Recarga la página o inténtalo más tarde.</p>}
          {estado === "ok" && cont && (
            <>
              {activa === "basico" && <Bloques lista={cont.basico} />}
              {activa === "fondo" && (
                <>
                  <Bloques lista={cont.fondo} />
                  {cont.fuentes && (
                    <p className="mt-8 rounded-lg border bg-card p-4 text-sm text-muted-foreground"><strong className="text-foreground">Fuentes: </strong><Md texto={cont.fuentes} /></p>
                  )}
                </>
              )}
              {activa === "repaso" && (
                <div className="space-y-8">
                  {cont.repaso.mapa && (
                    <section><h2 className="mb-3 text-xl font-bold">Mapa del tema</h2><Tabla head={cont.repaso.mapa.head} rows={cont.repaso.mapa.rows} /></section>
                  )}
                  {!!cont.repaso.ideas?.length && (
                    <section>
                      <h2 className="mb-3 text-xl font-bold">Las {cont.repaso.ideas.length} ideas clave</h2>
                      <ol className="space-y-2">
                        {cont.repaso.ideas.map((x, i) => (
                          <li key={i} className="flex gap-3 rounded-md border bg-card p-3 text-muted-foreground">
                            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">{i + 1}</span>
                            <span><Md texto={x} /></span>
                          </li>
                        ))}
                      </ol>
                    </section>
                  )}
                  {!!cont.repaso.extra?.length && <Bloques lista={cont.repaso.extra} />}
                </div>
              )}
              {activa === "trampas" && (
                <Tabla head={cont.trampas_head ?? ["Te dicen…", "La verdad"]} rows={cont.trampas.map(([a, b]) => [a, b])} />
              )}
              {activa === "supuesto" && (
                cont.supuesto.libre ? <Bloques lista={cont.supuesto.libre} /> : (
                  <div className="space-y-8">
                    <section><h2 className="mb-3 text-xl font-bold">Enunciado</h2><Bloques lista={cont.supuesto.enunciado ?? []} /></section>
                    <details className="rounded-lg border bg-card p-4">
                      <summary className="cursor-pointer font-semibold text-primary">Ver la solución propuesta</summary>
                      <div className="mt-4"><Bloques lista={cont.supuesto.solucion ?? []} /></div>
                    </details>
                  </div>
                )
              )}
              {activa === "test" && <TestInteractivo key={`${slug}-${n}`} id={`test-${slug}-${n}`} preguntas={cont.test} />}
            </>
          )}
        </div>

        <nav aria-label="Otros temas" className="flex flex-wrap justify-between gap-3 border-t pt-6">
          {anterior ? (
            <Button asChild variant="outline"><Link to={`/cuadernos/${slug}/tema/${anterior.orden}`}><ArrowLeft aria-hidden /> {anterior.corto}</Link></Button>
          ) : <span />}
          {siguiente && (
            <Button asChild><Link to={`/cuadernos/${slug}/tema/${siguiente.orden}`}>{siguiente.corto} <ArrowRight aria-hidden /></Link></Button>
          )}
        </nav>
      </div>
    </>
  );
}
