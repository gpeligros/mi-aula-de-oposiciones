import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Cabecera } from "@/components/Cabecera";
import { useTitulo } from "@/lib/useTitulo";

const partes = [
  { t: "Un plan hecho a tu medida", d: "Le dices a la plataforma cuántas horas tienes a la semana, qué días estudias y cuándo es el examen. Con eso reparte los temas, los tests y los repasos. Si un día no puedes, el plan se recoloca solo." },
  { t: "Sesiones cortas", d: "Cada tema se estudia en bloques de unas dos horas: primero entender, después fijar y practicar. Es más fácil mantener la constancia con sesiones abarcables que con maratones de fin de semana." },
  { t: "Cada tema, siempre igual", d: "Explicación sencilla para entender la idea → esquema con los datos que caen → trampas típicas de test → test de autoevaluación → supuesto práctico. Siempre sabes dónde estás." },
  { t: "Repaso espaciado", d: "Lo que no se repasa se olvida, y se olvida rápido. Por eso las preguntas vuelven a aparecer en intervalos cada vez más largos: pronto si fallas, más tarde si aciertas con seguridad." },
  { t: "Tests que enseñan", d: "Después de cada respuesta ves si has acertado y, sobre todo, por qué. Muchas preguntas de examen juegan con plazos y números parecidos: te señalamos la trampa." },
  { t: "Simulacros con las reglas reales", d: "Mismo número de preguntas, mismo tiempo y la misma penalización por error que en tu convocatoria. Así aprendes también cuándo compensa dejar una pregunta en blanco." },
  { t: "Supuestos prácticos", d: "Casos parecidos a los de examen sobre redes, seguridad, sistemas o bases de datos. Escribes tu solución y después la comparas con la propuesta." },
  { t: "Estadísticas para decidir", d: "Tu nota por bloque y por tema, cómo evoluciona y qué preguntas fallas más. Sirven para saber qué estudiar mañana, no para agobiarte." },
];

export default function Metodo() {
  useTitulo("Método");
  return (
    <>
      <Cabecera titulo="El método" subtitulo="Estudiar una oposición no va de horas delante del libro, sino de hacer lo correcto en el orden correcto. Esto es lo que hacemos y por qué." />
      <div className="container max-w-3xl py-12">
        <ol className="relative space-y-10 border-l-2 border-terracota-light/60 pl-8">
          {partes.map((p, i) => (
            <li key={p.t} className="relative">
              <span aria-hidden className="absolute -left-[2.85rem] flex h-9 w-9 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">{i + 1}</span>
              <h2 className="text-xl font-bold">{p.t}</h2>
              <p className="mt-2 text-muted-foreground">{p.d}</p>
            </li>
          ))}
        </ol>
        <div className="mt-14 rounded-lg bg-warm-cream p-8 text-center">
          <p className="text-lg font-semibold">¿Lo pruebas con tu oposición?</p>
          <Button asChild className="mt-4"><Link to="/oposiciones">Ver oposiciones <ArrowRight /></Link></Button>
        </div>
      </div>
    </>
  );
}
