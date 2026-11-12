import { Link } from "react-router-dom";
import {
  ArrowRight, BarChart3, BookOpenCheck, CalendarClock, CheckCircle2, FileCheck2, Flame,
  ListChecks, Repeat2, Target, Trophy,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { familias } from "@/data/catalogo";
import { useTitulo } from "@/lib/useTitulo";

const pasos = [
  { icono: Target, titulo: "Elige tu oposición", texto: "Busca la tuya en el catálogo y mira su temario, el formato del examen y el estado de la convocatoria." },
  { icono: CalendarClock, titulo: "Plan según tus horas", texto: "Dinos cuántas horas tienes a la semana y cuándo es el examen. El plan se reparte solo." },
  { icono: Repeat2, titulo: "Estudia y repasa", texto: "Sesiones cortas, tests explicados y repasos programados justo antes de que se te olvide." },
  { icono: FileCheck2, titulo: "Simulacros", texto: "Exámenes completos con el tiempo y la penalización reales, para llegar sin sorpresas." },
];

const ventajas = [
  { icono: BookOpenCheck, titulo: "Temario por fuentes oficiales", texto: "Cada tema sale del BOE, boletines y documentación oficial, y lleva indicada su fuente y su fecha." },
  { icono: ListChecks, titulo: "Tests explicados", texto: "Cada pregunta trae el porqué de la respuesta correcta y la trampa que esconde." },
  { icono: Repeat2, titulo: "Repaso espaciado", texto: "Las preguntas que fallas vuelven cuando toca, no cuando te acuerdas de ellas." },
  { icono: BarChart3, titulo: "Estadísticas claras", texto: "Ves tu nota por bloque y por tema, y qué es lo que más te cuesta." },
  { icono: Trophy, titulo: "Motivación diaria", texto: "Rachas, niveles y retos semanales para mantener el hábito sin agobio." },
];

const preguntas = [
  { p: "¿De verdad es gratis?", r: "Sí. Mientras la plataforma esté en fase beta, todo el contenido es gratuito. Más adelante habrá un plan Premium opcional, pero lo básico seguirá siendo gratis." },
  { p: "¿Qué oposiciones puedo preparar ahora?", r: "Empezamos por informática: Analista/Programador de la Administración local ya tiene su temario completo. TAI y GSI del Estado están en preparación." },
  { p: "¿De dónde sale el temario?", r: "De fuentes oficiales: el BOE, los boletines autonómicos y provinciales, el CCN-CERT y la documentación oficial de cada norma o tecnología. Cada tema indica su fuente y su fecha de actualización." },
  { p: "¿Qué pasa si cambia una ley?", r: "Revisamos los cambios normativos y marcamos los temas afectados para actualizarlos. En cada tema verás la fecha de su última revisión." },
  { p: "¿Necesito instalar algo?", r: "No. Funciona en el navegador del ordenador o del móvil. Además, el temario se puede descargar en PDF." },
  { p: "¿Garantizáis la plaza?", r: "No, y desconfía de quien lo haga. Te damos un método y buen material; el esfuerzo lo pones tú." },
];

function TarjetaPregunta() {
  return (
    <div aria-hidden className="relative mx-auto w-full max-w-sm">
      <div className="absolute -right-3 -top-3 h-full w-full rotate-3 rounded-lg bg-terracota-light/40" />
      <div className="relative rounded-lg border bg-card p-6 shadow-lg">
        <div className="mb-4 flex items-center justify-between text-xs text-muted-foreground">
          <span className="font-semibold text-primary">Tema G4 · Ley 39/2015</span>
          <span>Pregunta 3 de 10</span>
        </div>
        <p className="font-semibold leading-snug">Si una norma no fija el plazo máximo para resolver, ¿cuál es?</p>
        <ul className="mt-4 space-y-2 text-sm">
          {["1 mes", "3 meses", "6 meses", "10 días"].map((o, i) => (
            <li key={o} className={`flex items-center gap-3 rounded-md border px-3 py-2 ${i === 1 ? "border-primary bg-primary/10 font-semibold" : ""}`}>
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-secondary text-xs">{"abcd"[i]}</span>
              {o}
              {i === 1 && <CheckCircle2 className="ml-auto h-4 w-4 text-primary" />}
            </li>
          ))}
        </ul>
        <p className="mt-4 rounded-md bg-warm-cream p-3 text-xs text-muted-foreground">
          <strong className="text-foreground">Por qué:</strong> art. 21.3 de la Ley 39/2015. Trampa típica: confundirlo con el plazo de los recursos.
        </p>
        <div className="mt-4 flex items-center gap-2 text-xs font-semibold text-earth-brown">
          <Flame className="h-4 w-4 text-primary" /> Racha de 6 días · +10 XP
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  useTitulo();
  const informatica = familias.find((f) => f.activa);
  return (
    <>
      <section className="bg-warm-cream">
        <div className="container grid items-center gap-12 py-16 md:py-24 lg:grid-cols-[1.15fr_1fr]">
          <div>
            <Badge variant="soft">Informática · Beta gratuita</Badge>
            <h1 className="mt-5 text-4xl font-extrabold leading-[1.1] sm:text-5xl">
              Prepara tu oposición de informática con un método, <span className="text-primary">no a ciegas</span>
            </h1>
            <p className="mt-5 max-w-xl text-lg text-muted-foreground">
              Temario hecho a partir de fuentes oficiales, tests que explican cada respuesta y repasos en el momento justo. Gratis mientras dure la fase beta.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg"><Link to="/entrar">Empieza gratis <ArrowRight /></Link></Button>
              <Button asChild size="lg" variant="outline"><Link to="/oposiciones">Ver oposiciones</Link></Button>
            </div>
            <p className="mt-4 text-sm text-muted-foreground">Sin tarjeta. Sin permanencia. Sin promesas imposibles.</p>
          </div>
          <TarjetaPregunta />
        </div>
      </section>

      <section aria-labelledby="como-funciona" className="container py-20">
        <h2 id="como-funciona" className="text-3xl font-bold">Cómo funciona</h2>
        <p className="mt-2 max-w-2xl text-muted-foreground">Cuatro pasos, siempre en el mismo orden. Así sabes en cada momento qué toca.</p>
        <ol className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {pasos.map((p, i) => (
            <li key={p.titulo} className="relative rounded-lg border bg-card p-6">
              <span className="absolute right-5 top-4 text-4xl font-extrabold text-terracota-light/60" aria-hidden>{i + 1}</span>
              <p.icono aria-hidden className="h-8 w-8 text-primary" />
              <h3 className="mt-4 font-semibold"><span className="sr-only">Paso {i + 1}: </span>{p.titulo}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{p.texto}</p>
            </li>
          ))}
        </ol>
      </section>

      <section aria-labelledby="ventajas" className="bg-secondary/50 py-20">
        <div className="container">
          <h2 id="ventajas" className="text-3xl font-bold">Lo que te llevas</h2>
          <ul className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {ventajas.map((v) => (
              <li key={v.titulo} className="flex gap-4 rounded-lg bg-card p-6 shadow-sm">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                  <v.icono aria-hidden className="h-5 w-5 text-primary" />
                </span>
                <div>
                  <h3 className="font-semibold">{v.titulo}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{v.texto}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section aria-labelledby="familias" className="container py-20">
        <h2 id="familias" className="text-3xl font-bold">Familias de oposiciones</h2>
        <p className="mt-2 max-w-2xl text-muted-foreground">Empezamos por informática, donde casi nadie ofrece preparación. Después llegarán más.</p>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {familias.map((f) => (
            <Card key={f.slug} className={f.activa ? "border-primary/50" : "opacity-80"}>
              <CardHeader>
                <div className="flex items-center justify-between gap-2">
                  <CardTitle>{f.nombre}</CardTitle>
                  <Badge variant={f.activa ? "default" : "secondary"}>{f.activa ? "Disponible" : "Próximamente"}</Badge>
                </div>
                <CardDescription>{f.descripcion}</CardDescription>
              </CardHeader>
              {f.activa && (
                <CardContent>
                  <Button asChild variant="link" className="h-auto p-0">
                    <Link to="/oposiciones">Ver oposiciones de {f.nombre.toLowerCase()} <ArrowRight /></Link>
                  </Button>
                </CardContent>
              )}
            </Card>
          ))}
        </div>
      </section>

      <section aria-labelledby="faq" className="container max-w-3xl py-10">
        <h2 id="faq" className="text-3xl font-bold">Preguntas frecuentes</h2>
        <Accordion type="single" collapsible className="mt-6">
          {preguntas.map((q, i) => (
            <AccordionItem key={q.p} value={`q${i}`}>
              <AccordionTrigger>{q.p}</AccordionTrigger>
              <AccordionContent>{q.r}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>

      <section className="container py-20">
        <div className="rounded-lg bg-primary px-6 py-12 text-center text-primary-foreground sm:px-12">
          <h2 className="text-3xl font-bold">Tu plaza no se prepara sola. Empieza hoy.</h2>
          <p className="mx-auto mt-3 max-w-xl opacity-90">
            {informatica ? "El temario de informática ya está disponible. " : ""}Crea tu cuenta gratis y haz tu primer test en cinco minutos.
          </p>
          <Button asChild size="lg" variant="secondary" className="mt-8">
            <Link to="/entrar">Empieza gratis <ArrowRight /></Link>
          </Button>
        </div>
      </section>
    </>
  );
}
