import { Info } from "lucide-react";

export function AvisoEjemplo({ children }: { children?: React.ReactNode }) {
  return (
    <p className="flex items-start gap-2 rounded-lg border border-dashed border-primary/40 bg-primary/5 p-3 text-sm text-muted-foreground">
      <Info aria-hidden className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
      <span>{children ?? "Datos de ejemplo durante la beta. Se sustituirán por la información de cada convocatoria."}</span>
    </p>
  );
}
