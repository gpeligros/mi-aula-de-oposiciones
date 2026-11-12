import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useTitulo } from "@/lib/useTitulo";

export default function NotFound() {
  useTitulo("Página no encontrada");
  return (
    <section className="container flex flex-col items-center py-24 text-center">
      <p className="text-6xl font-extrabold text-terracota-light">404</p>
      <h1 className="mt-4 text-3xl font-bold">Esta página no está en el temario</h1>
      <p className="mt-3 max-w-md text-muted-foreground">Puede que el enlace haya cambiado o que la dirección tenga una errata.</p>
      <div className="mt-8 flex gap-3">
        <Button asChild><Link to="/">Ir a la portada</Link></Button>
        <Button asChild variant="outline"><Link to="/oposiciones">Ver oposiciones</Link></Button>
      </div>
    </section>
  );
}
