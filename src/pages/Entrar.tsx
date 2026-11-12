import { Link } from "react-router-dom";
import { Hourglass } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTitulo } from "@/lib/useTitulo";

export default function Entrar() {
  useTitulo("Entrar");
  return (
    <section className="container flex max-w-xl flex-col items-center py-24 text-center">
      <span className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
        <Hourglass aria-hidden className="h-6 w-6 text-primary" />
      </span>
      <h1 className="mt-6 text-3xl font-bold">El área del alumno llega muy pronto</h1>
      <p className="mt-3 text-muted-foreground">
        Estamos terminando el registro y los tests. Mientras tanto, puedes ver el catálogo y el temario de cada oposición.
      </p>
      <Button asChild className="mt-8"><Link to="/oposiciones">Ver oposiciones</Link></Button>
    </section>
  );
}
