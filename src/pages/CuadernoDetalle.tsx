import { Link, useParams } from "react-router-dom";
import { ArrowLeft, ArrowRight, BookOpen, Check } from "lucide-react";
import { useSesion } from "@/lib/sesion";
import { BotonDescarga } from "@/components/BotonDescarga";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Cabecera } from "@/components/Cabecera";
import { useTitulo } from "@/lib/useTitulo";
import { useCatalogo } from "@/data/useCatalogo";
import NotFound from "@/pages/NotFound";

export default function CuadernoDetalle() {
  const { slug } = useParams();
  const { cuadernos, temas, oposiciones, cargando } = useCatalogo();
  const { disponible, sesion } = useSesion();
  const c = cuadernos.find((x) => x.slug === slug);
  useTitulo(c?.titulo ?? "Cuaderno");
  if (!c) return cargando ? <p className="container py-16 text-muted-foreground">Cargando…</p> : <NotFound />;

  const lista = temas.filter((t) => t.cuaderno === c.slug).sort((a, b) => a.orden - b.orden);
  const usadoEn = oposiciones.filter((o) => o.cuadernos?.includes(c.slug));
  const psico = c.tipo === "psicotecnicos";
  const incluye = [
    "Lo básico: la idea en una frase, una analogía y los conceptos clave",
    "A fondo: desarrollo completo con tablas, normativa y ejemplos",
    "Repaso exprés: mapa del tema y las 10 ideas clave",
    psico ? "Errores típicos y cómo evitarlos" : "Trampas de test: lo que te dicen frente a lo que es verdad",
    psico ? "Ejercicios resueltos paso a paso" : "Supuesto práctico resuelto",
    `Test de autoevaluación con soluciones (${c.numPreguntas.toLocaleString("es-ES")} ${psico ? "ejercicios" : "preguntas"} en total)`,
  ];

  return (
    <>
      <Cabecera titulo={c.titulo} subtitulo={c.subtitulo}>
        <Link to="/cuadernos" className="mb-4 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary">
          <ArrowLeft aria-hidden className="h-4 w-4" /> Volver a los cuadernos
        </Link>
        <div className="mb-4 flex flex-wrap gap-2">
          <Badge variant="secondary">{c.etiqueta}</Badge>
          <Badge variant="outline">{c.edicion}</Badge>
        </div>
      </Cabecera>

      <div className="container grid gap-10 py-10 lg:grid-cols-[1fr_320px]">
        <div className="space-y-12">
          <section aria-labelledby="incluye">
            <h2 id="incluye" className="text-2xl font-bold">Qué incluye cada tema</h2>
            <ul className="mt-4 space-y-2">
              {incluye.map((x) => (
                <li key={x} className="flex gap-2 text-muted-foreground"><Check aria-hidden className="mt-0.5 h-4 w-4 shrink-0 text-primary" />{x}</li>
              ))}
            </ul>
          </section>

          <section aria-labelledby="temas">
            <h2 id="temas" className="text-2xl font-bold">{psico ? "Tipos de prueba" : "Temas"}</h2>
            <Accordion type="multiple" className="mt-4">
              {lista.map((t) => (
                <AccordionItem key={t.orden} value={String(t.orden)}>
                  <AccordionTrigger>
                    <span className="text-left"><span className="mr-2 font-semibold text-primary">{String(t.orden).padStart(2, "0")}</span>{t.titulo}</span>
                  </AccordionTrigger>
                  <AccordionContent>
                    <p className="mb-2 text-sm font-semibold">Qué vas a aprender</p>
                    <ul className="list-disc space-y-1 pl-5 text-sm text-muted-foreground">
                      {t.aprender.map((a) => <li key={a}>{a}</li>)}
                    </ul>
                    <p className="mt-3 text-xs text-muted-foreground">{t.numPreguntas} {psico ? "ejercicios" : "preguntas de test"} · {t.incluye}</p>
                    {disponible && (
                      <Button asChild size="sm" className="mt-4">
                        <Link to={`/cuadernos/${c.slug}/tema/${t.orden}`}><BookOpen aria-hidden /> {sesion ? "Estudiar este tema" : "Ver el tema (con registro gratis)"}</Link>
                      </Button>
                    )}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </section>

          {usadoEn.length > 0 && (
            <section aria-labelledby="usado">
              <h2 id="usado" className="text-2xl font-bold">Entra en estas oposiciones</h2>
              <ul className="mt-3 space-y-1">
                {usadoEn.map((o) => (
                  <li key={o.slug}><Link className="text-primary underline underline-offset-4" to={`/oposiciones/${o.slug}`}>{o.nombre}</Link> <span className="text-muted-foreground">· {o.organismo}</span></li>
                ))}
              </ul>
            </section>
          )}
        </div>

        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="space-y-5 rounded-lg border bg-card p-6">
            <dl className="grid grid-cols-2 gap-3 text-sm">
              <div><dt className="text-muted-foreground">{psico ? "Tipos" : "Temas"}</dt><dd className="font-semibold">{c.numTemas}</dd></div>
              <div><dt className="text-muted-foreground">{psico ? "Ejercicios" : "Preguntas"}</dt><dd className="font-semibold">{c.numPreguntas.toLocaleString("es-ES")}</dd></div>
              <div><dt className="text-muted-foreground">{psico ? "Resueltos" : "Supuestos"}</dt><dd className="font-semibold">{c.numSupuestos}</dd></div>
              <div><dt className="text-muted-foreground">Páginas</dt><dd className="font-semibold">{c.paginas ?? "—"}</dd></div>
            </dl>
            <p className="text-xs text-muted-foreground">Actualizado: {c.actualizado ?? "pendiente"}</p>
            {sesion && lista[0] ? (
              <>
                <Button asChild className="w-full"><Link to={`/cuadernos/${c.slug}/tema/${lista[0].orden}`}>Empezar por el {psico ? "tipo" : "tema"} 1 <ArrowRight /></Link></Button>
                {c.pdf && <BotonDescarga fichero={c.pdf} texto={`Descargar en PDF${c.paginas ? ` (${c.paginas} págs.)` : ""}`} />}
              </>
            ) : (
              <Button asChild className="w-full"><Link to={`/entrar?modo=registro&volver=/cuadernos/${c.slug}`}>Regístrate gratis para acceder <ArrowRight /></Link></Button>
            )}
            <p className="text-xs text-muted-foreground">{sesion ? "PDF para estudiar sin conexión, subrayar o imprimir. Es para tu uso personal." : "Durante la beta el acceso es gratuito con registro: temas, tests y PDF descargable."}</p>
          </div>
        </aside>
      </div>
    </>
  );
}
