import { Link } from "react-router-dom";
import { BookOpen, Brain } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Cabecera } from "@/components/Cabecera";
import { useTitulo } from "@/lib/useTitulo";
import { useCatalogo } from "@/data/useCatalogo";
import type { Cuaderno } from "@/data/catalogo";

const n = (x: number | null) => (x === null ? "—" : x.toLocaleString("es-ES"));

export function TarjetaCuaderno({ c }: { c: Cuaderno }) {
  const Icono = c.tipo === "psicotecnicos" ? Brain : BookOpen;
  return (
    <Card className="flex flex-col">
      <CardHeader>
        <div className="flex flex-wrap items-center gap-2">
          <Icono aria-hidden className="h-5 w-5 text-primary" />
          <Badge variant="secondary">{c.etiqueta}</Badge>
        </div>
        <CardTitle className="mt-2">
          <Link to={`/cuadernos/${c.slug}`} className="hover:text-primary">{c.titulo}</Link>
        </CardTitle>
        <p className="text-sm text-muted-foreground">{c.subtitulo}</p>
      </CardHeader>
      <CardContent className="flex-1">
        <dl className="grid grid-cols-3 gap-2 rounded-lg bg-secondary/60 p-3 text-center">
          <div><dt className="text-xs text-muted-foreground">{c.tipo === "psicotecnicos" ? "Tipos" : "Temas"}</dt><dd className="font-semibold">{n(c.numTemas)}</dd></div>
          <div><dt className="text-xs text-muted-foreground">{c.tipo === "psicotecnicos" ? "Ejercicios" : "Preguntas"}</dt><dd className="font-semibold">{n(c.numPreguntas)}</dd></div>
          <div><dt className="text-xs text-muted-foreground">Páginas</dt><dd className="font-semibold">{n(c.paginas)}</dd></div>
        </dl>
        <p className="mt-3 text-xs text-muted-foreground">Última actualización: {c.actualizado ?? "pendiente"}</p>
      </CardContent>
      <CardFooter>
        <Button asChild variant="outline" className="w-full"><Link to={`/cuadernos/${c.slug}`}>Ver cuaderno<span className="sr-only">: {c.titulo}</span></Link></Button>
      </CardFooter>
    </Card>
  );
}

export default function Cuadernos() {
  useTitulo("Cuadernos");
  const { cuadernos } = useCatalogo();
  const temario = cuadernos.filter((c) => c.tipo === "temario");
  const otros = cuadernos.filter((c) => c.tipo !== "temario");
  return (
    <>
      <Cabecera titulo="Cuadernos" subtitulo="Cada cuaderno es un bloque de temario que sirve para varias oposiciones: explicación sencilla, desarrollo, repaso exprés, trampas de test, supuesto práctico y test." />
      <div className="container space-y-14 py-10">
        <section aria-labelledby="temario">
          <h2 id="temario" className="text-2xl font-bold">Temario por bloques</h2>
          <div className="mt-4 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {temario.map((c) => <TarjetaCuaderno key={c.slug} c={c} />)}
          </div>
        </section>
        {otros.length > 0 && (
          <section aria-labelledby="otros">
            <h2 id="otros" className="text-2xl font-bold">Para muchas oposiciones</h2>
            <div className="mt-4 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {otros.map((c) => <TarjetaCuaderno key={c.slug} c={c} />)}
            </div>
          </section>
        )}
      </div>
    </>
  );
}
