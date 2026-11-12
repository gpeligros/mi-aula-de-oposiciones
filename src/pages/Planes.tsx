import { Link } from "react-router-dom";
import { Check, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Cabecera } from "@/components/Cabecera";
import { useTitulo } from "@/lib/useTitulo";

const incluye = [
  "Temario completo de las oposiciones disponibles, en web y PDF",
  "Tests ilimitados con explicación de cada respuesta",
  "Repaso espaciado de tus fallos",
  "Simulacros con la penalización real",
  "Supuestos prácticos con solución propuesta",
  "Estadísticas por bloque y por tema",
  "Rachas, niveles, logros y reto semanal",
];

export default function Planes() {
  useTitulo("Planes");
  return (
    <>
      <Cabecera titulo="Planes" subtitulo="Durante la fase beta, todo es gratis. Sin tarjeta y sin letra pequeña." />
      <div className="container grid max-w-4xl gap-6 py-12 md:grid-cols-2">
        <Card className="border-2 border-primary">
          <CardHeader>
            <Badge className="w-fit">Disponible</Badge>
            <CardTitle className="mt-2 text-2xl">Beta gratuita</CardTitle>
            <CardDescription>Para preparar tu oposición con todo el material mientras construimos la plataforma.</CardDescription>
            <p className="pt-2 text-4xl font-extrabold">0 €</p>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2.5">
              {incluye.map((i) => (
                <li key={i} className="flex gap-2 text-sm"><Check aria-hidden className="mt-0.5 h-4 w-4 shrink-0 text-primary" />{i}</li>
              ))}
            </ul>
          </CardContent>
          <CardFooter>
            <Button asChild className="w-full"><Link to="/entrar">Empieza gratis</Link></Button>
          </CardFooter>
        </Card>
        <Card className="border-dashed bg-warm-cream">
          <CardHeader>
            <Badge variant="soft" className="w-fit">Próximamente</Badge>
            <CardTitle className="mt-2 flex items-center gap-2 text-2xl"><Sparkles aria-hidden className="h-5 w-5 text-primary" />Premium</CardTitle>
            <CardDescription>Estamos decidiendo qué incluirá a partir de lo que nos contéis durante la beta.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Lo básico seguirá siendo gratis. Si quieres opinar sobre qué echarías en falta, cuéntanoslo cuando abramos el registro.
            </p>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
