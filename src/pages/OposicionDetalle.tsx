import { Link, useParams } from "react-router-dom";
import { ArrowLeft, ArrowRight, ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Cabecera } from "@/components/Cabecera";
import { AvisoEjemplo } from "@/components/AvisoEjemplo";
import { useTitulo } from "@/lib/useTitulo";
import { etiquetaAmbito, etiquetaEstado, etiquetaMaterial, oposiciones } from "@/data/catalogo";
import NotFound from "@/pages/NotFound";

export default function OposicionDetalle() {
  const { slug } = useParams();
  const o = oposiciones.find((x) => x.slug === slug);
  useTitulo(o?.nombre ?? "Oposición no encontrada");
  if (!o) return <NotFound />;

  return (
    <>
      <Cabecera titulo={o.nombre} subtitulo={o.organismo}>
        <Link to="/oposiciones" className="mb-4 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary">
          <ArrowLeft aria-hidden className="h-4 w-4" /> Volver al catálogo
        </Link>
        <div className="mb-4 flex flex-wrap gap-2">
          <Badge variant="secondary">Grupo {o.grupo}</Badge>
          <Badge variant="outline">{etiquetaAmbito[o.ambito]}</Badge>
          <Badge variant={o.material === "disponible" ? "default" : "soft"}>{etiquetaMaterial[o.material]}</Badge>
        </div>
      </Cabecera>

      <div className="container grid gap-10 py-10 lg:grid-cols-[1fr_320px]">
        <div className="space-y-12">
          {o.ejemplo && <AvisoEjemplo />}

          <section aria-labelledby="resumen">
            <h2 id="resumen" className="text-2xl font-bold">Resumen</h2>
            <p className="mt-3 text-muted-foreground">{o.resumen}</p>
          </section>

          <section aria-labelledby="requisitos">
            <h2 id="requisitos" className="text-2xl font-bold">Requisitos habituales</h2>
            <ul className="mt-3 list-disc space-y-1.5 pl-5 text-muted-foreground">
              {o.requisitos.map((r) => <li key={r}>{r}</li>)}
            </ul>
            <p className="mt-3 text-sm text-muted-foreground">Fuente: Real Decreto Legislativo 5/2015 (TREBEP), arts. 56, 57 y 76. Manda siempre lo que digan las bases de cada convocatoria.</p>
          </section>

          <section aria-labelledby="formato">
            <h2 id="formato" className="text-2xl font-bold">Formato del examen</h2>
            {o.formatoExamen ? (
              <div className="mt-4 overflow-x-auto rounded-lg border">
                <table className="w-full text-left text-sm">
                  <caption className="sr-only">Ejercicios del proceso selectivo</caption>
                  <thead className="bg-secondary">
                    <tr><th scope="col" className="p-3">Ejercicio</th><th scope="col" className="p-3">En qué consiste</th></tr>
                  </thead>
                  <tbody>
                    {o.formatoExamen.map((e) => (
                      <tr key={e.nombre} className="border-t">
                        <th scope="row" className="p-3 font-semibold">{e.nombre}</th>
                        <td className="p-3 text-muted-foreground">{e.descripcion}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="mt-3 text-muted-foreground">Pendiente: lo publicaremos cuando esté preparado el material de esta oposición.</p>
            )}
          </section>

          <section aria-labelledby="temario">
            <h2 id="temario" className="text-2xl font-bold">Temario</h2>
            {o.bloques.length ? (
              <Accordion type="multiple" className="mt-4">
                {o.bloques.map((b) => (
                  <AccordionItem key={b.nombre} value={b.nombre}>
                    <AccordionTrigger>
                      <span>{b.nombre} <span className="font-normal text-muted-foreground">({b.temas.length} temas)</span></span>
                    </AccordionTrigger>
                    <AccordionContent>
                      <ol className="space-y-2">
                        {b.temas.map((t) => (
                          <li key={t.codigo} className="flex gap-3">
                            <span className="w-10 shrink-0 font-semibold text-primary">{t.codigo}</span>
                            <span className="text-foreground">{t.titulo}</span>
                          </li>
                        ))}
                      </ol>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            ) : (
              <p className="mt-3 text-muted-foreground">El temario de esta oposición está en preparación.</p>
            )}
          </section>
        </div>

        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="space-y-5 rounded-lg border bg-card p-6">
            <div>
              <h2 className="text-sm font-semibold text-muted-foreground">Convocatoria</h2>
              <p className="mt-1 font-semibold">{etiquetaEstado[o.estado]}</p>
              <a href={o.fuenteOficial.url} target="_blank" rel="noopener noreferrer" className="mt-2 inline-flex items-center gap-1 text-sm text-primary underline underline-offset-4">
                {o.fuenteOficial.texto} <ExternalLink aria-hidden className="h-3.5 w-3.5" /><span className="sr-only">(se abre en una pestaña nueva)</span>
              </a>
            </div>
            <dl className="grid grid-cols-2 gap-3 text-sm">
              <div><dt className="text-muted-foreground">Temas</dt><dd className="font-semibold">{o.numTemas ?? "Pendiente"}</dd></div>
              <div><dt className="text-muted-foreground">Preguntas</dt><dd className="font-semibold">{o.numPreguntas?.toLocaleString("es-ES") ?? "Pendiente"}</dd></div>
              <div><dt className="text-muted-foreground">Supuestos</dt><dd className="font-semibold">{o.numSupuestos ?? "Pendiente"}</dd></div>
              <div><dt className="text-muted-foreground">Actualizado</dt><dd className="font-semibold">{o.actualizado ?? "Pendiente"}</dd></div>
            </dl>
            {o.material === "disponible" ? (
              <Button asChild className="w-full"><Link to="/entrar">Empezar a prepararla <ArrowRight /></Link></Button>
            ) : (
              <Button className="w-full" disabled>Disponible próximamente</Button>
            )}
          </div>
        </aside>
      </div>
    </>
  );
}
