import { Fragment, type ReactNode } from "react";
import { AlertTriangle, KeyRound, Lightbulb } from "lucide-react";
import { cn } from "@/lib/utils";

// Tipos de bloque que vienen en los JSON de los cuadernos (herramienta maqueta_venta)
export type Bloque =
  | { t: "h"; text: string }
  | { t: "p"; md: string }
  | { t: "ul" | "ol"; items: string[] }
  | { t: "table"; head: string[]; rows: string[][] }
  | { t: "callout"; kind: string; md: string }
  | { t: "code"; text: string }
  | { t: "fig"; svg: string; alt?: string };

// Markdown mínimo en línea: `código`, ***negrita cursiva***, **negrita**, *cursiva*.
// Se convierte a elementos de React (nunca se inserta HTML), así no hay riesgo de inyección.
const PATRON = /(`[^`]+`|\*\*\*[^*]+?\*\*\*|\*\*[^*]+?\*\*|(?<![\w*])\*(?!\s)[^*]+?(?<!\s)\*(?![\w*]))/g;

export function Md({ texto }: { texto: string }) {
  const partes = (texto ?? "").split(PATRON);
  return (
    <>
      {partes.map((p, i) => {
        if (!p) return null;
        if (p.startsWith("`")) return <code key={i} className="rounded bg-muted px-1 py-0.5 text-[0.9em]">{p.slice(1, -1)}</code>;
        if (p.startsWith("***")) return <strong key={i}><em>{p.slice(3, -3)}</em></strong>;
        if (p.startsWith("**")) return <strong key={i} className="font-semibold text-foreground">{p.slice(2, -2)}</strong>;
        if (p.startsWith("*") && p.endsWith("*") && p.length > 2) return <em key={i}>{p.slice(1, -1)}</em>;
        return <Fragment key={i}>{p}</Fragment>;
      })}
    </>
  );
}

// Las figuras (psicotécnicos) son SVG generados por nosotros. Se muestran como <img>,
// que nunca ejecuta código, con un texto alternativo para lectores de pantalla.
export function Figura({ svg, alt, className }: { svg: string; alt: string; className?: string }) {
  return <img src={`data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`} alt={alt} className={cn("h-auto max-w-full", className)} />;
}

const avisos: Record<string, { titulo: string; icono: ReactNode; clase: string }> = {
  clave: { titulo: "Clave", icono: <KeyRound aria-hidden className="h-4 w-4" />, clase: "border-sky-300 bg-sky-50 dark:border-sky-800 dark:bg-sky-950/40" },
  truco: { titulo: "Truco", icono: <Lightbulb aria-hidden className="h-4 w-4" />, clase: "border-emerald-300 bg-emerald-50 dark:border-emerald-800 dark:bg-emerald-950/40" },
  ojo: { titulo: "Ojo", icono: <AlertTriangle aria-hidden className="h-4 w-4" />, clase: "border-orange-300 bg-orange-50 dark:border-orange-800 dark:bg-orange-950/40" },
};

export function Tabla({ head, rows }: { head: string[]; rows: string[][] }) {
  return (
    <div className="overflow-x-auto rounded-lg border" tabIndex={0} role="region" aria-label="Tabla (desliza para ver todo)">
      <table className="w-full min-w-[480px] border-collapse text-sm">
        <thead className="bg-warm-beige/70">
          <tr>{head.map((h, i) => <th key={i} scope="col" className="px-3 py-2 text-left font-semibold"><Md texto={h} /></th>)}</tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i} className="border-t align-top">
              {r.map((c, j) => <td key={j} className="px-3 py-2 text-muted-foreground"><Md texto={c} /></td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function Bloques({ lista }: { lista: Bloque[] }) {
  return (
    <div className="space-y-4 leading-relaxed text-muted-foreground">
      {lista.map((b, i) => {
        switch (b.t) {
          case "h":
            return <h3 key={i} className="pt-4 text-xl font-bold text-foreground"><Md texto={b.text} /></h3>;
          case "p":
            return <p key={i}><Md texto={b.md} /></p>;
          case "ul":
            return <ul key={i} className="list-disc space-y-1.5 pl-6">{b.items.map((x, j) => <li key={j}><Md texto={x} /></li>)}</ul>;
          case "ol":
            return <ol key={i} className="list-decimal space-y-1.5 pl-6">{b.items.map((x, j) => <li key={j}><Md texto={x} /></li>)}</ol>;
          case "table":
            return <Tabla key={i} head={b.head} rows={b.rows} />;
          case "callout": {
            const a = avisos[b.kind] ?? avisos.clave;
            return (
              <aside key={i} className={cn("rounded-lg border-l-4 p-4 text-foreground", a.clase)}>
                <p className="mb-1 flex items-center gap-2 text-sm font-bold">{a.icono}{a.titulo}</p>
                <p className="text-sm leading-relaxed"><Md texto={b.md} /></p>
              </aside>
            );
          }
          case "code":
            return <pre key={i} className="overflow-x-auto rounded-lg bg-[#1f2933] p-4 text-sm text-slate-100"><code>{b.text}</code></pre>;
          case "fig":
            return <Figura key={i} svg={b.svg} alt={b.alt ?? "Figura del ejemplo"} className="mx-auto rounded-lg border bg-white p-2" />;
          default:
            return null;
        }
      })}
    </div>
  );
}
