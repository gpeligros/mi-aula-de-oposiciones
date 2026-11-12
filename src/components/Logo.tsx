import { Link } from "react-router-dom";
import { GraduationCap } from "lucide-react";

// Logo (opción B): cuadrado terracota con birrete + nombre en dos líneas.
// Es el único sitio donde se define el logo: cabecera y pie lo reutilizan.
export function Logo() {
  return (
    <Link to="/" aria-label="Mi Aula de Oposiciones, ir a inicio" className="flex items-center gap-3 rounded-md">
      <span aria-hidden className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary sm:h-14 sm:w-14">
        <GraduationCap className="h-7 w-7 text-primary-foreground sm:h-9 sm:w-9" strokeWidth={2} />
      </span>
      <span aria-hidden className="flex flex-col leading-none">
        <span className="text-xl font-bold text-foreground sm:text-3xl">Mi Aula</span>
        <span className="mt-1 text-sm font-semibold text-primary sm:text-lg">de Oposiciones</span>
      </span>
    </Link>
  );
}
