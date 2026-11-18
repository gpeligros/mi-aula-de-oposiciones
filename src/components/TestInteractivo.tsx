import { useRef, useState } from "react";
import { Check, RotateCcw, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Figura, Md } from "@/components/Bloques";
import { cn } from "@/lib/utils";

export type Pregunta = { q: string; opts: string[]; ok: string; svg?: string };

const LETRAS = ["a", "b", "c", "d", "e", "f"];
const esSvg = (s: string) => s.trimStart().startsWith("<svg");

export function TestInteractivo({ preguntas, id }: { preguntas: Pregunta[]; id: string }) {
  const [resp, setResp] = useState<Record<number, string>>({});
  const [corregido, setCorregido] = useState(false);
  const resultado = useRef<HTMLDivElement>(null);

  const aciertos = preguntas.filter((p, i) => resp[i] === p.ok).length;
  const contestadas = Object.keys(resp).length;
  const sinContestar = preguntas.length - contestadas;
  const nota = preguntas.length ? Math.round((aciertos / preguntas.length) * 100) / 10 : 0;

  const corregir = () => {
    setCorregido(true);
    requestAnimationFrame(() => {
      resultado.current?.focus({ preventScroll: true });
      resultado.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  };
  const repetir = () => {
    setResp({});
    setCorregido(false);
    document.getElementById(`${id}-p0`)?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  return (
    <div className="space-y-6">
      {corregido && (
        <div ref={resultado} tabIndex={-1} role="status" className="scroll-mt-44 rounded-lg border-2 border-primary bg-warm-cream p-5 outline-none">
          <p className="text-2xl font-bold">Nota: {nota.toLocaleString("es-ES")} / 10</p>
          <p className="mt-1 text-muted-foreground">
            {aciertos} aciertos de {preguntas.length}{sinContestar > 0 ? ` · ${sinContestar} sin contestar` : ""}. Abajo tienes cada pregunta corregida.
          </p>
          <Button variant="outline" className="mt-4" onClick={repetir}><RotateCcw aria-hidden /> Repetir el test</Button>
        </div>
      )}

      <ol className="space-y-6">
        {preguntas.map((p, i) => {
          const elegida = resp[i];
          const bien = elegida === p.ok;
          return (
            <li key={i} id={`${id}-p${i}`} className="rounded-lg border bg-card p-4 sm:p-5">
              <fieldset>
                <legend className="font-semibold text-foreground">
                  <span className="mr-1 text-primary">{i + 1}.</span> <Md texto={p.q} />
                </legend>
                {p.svg && <Figura svg={p.svg} alt="Figura de la pregunta" className="mt-3 w-full max-w-xl rounded-md border bg-white p-1" />}
                <div className={cn("mt-3 grid gap-2", p.opts.some(esSvg) && "grid-cols-2 sm:grid-cols-4")}>
                  {p.opts.map((o, j) => {
                    const letra = LETRAS[j];
                    const marcada = elegida === letra;
                    const correcta = corregido && letra === p.ok;
                    const fallo = corregido && marcada && !bien;
                    return (
                      <label key={j} className={cn(
                        "flex cursor-pointer items-start gap-3 rounded-md border p-3 text-sm transition-colors",
                        !corregido && "hover:border-primary",
                        marcada && !corregido && "border-primary bg-primary/5",
                        correcta && "border-emerald-600 bg-emerald-50 dark:bg-emerald-950/40",
                        fallo && "border-red-600 bg-red-50 dark:bg-red-950/40",
                        corregido && "cursor-default",
                      )}>
                        <input type="radio" name={`${id}-p${i}`} value={letra} checked={marcada} disabled={corregido}
                          onChange={() => setResp((r) => ({ ...r, [i]: letra }))} className="mt-0.5 h-4 w-4 accent-[hsl(var(--primary))]" />
                        <span className="flex-1">
                          <span className="font-semibold">{letra}) </span>
                          {esSvg(o) ? <Figura svg={o} alt={`Figura de la opción ${letra}`} className="mt-1 w-20 rounded bg-white" /> : <Md texto={o} />}
                          {correcta && <span className="mt-1 flex items-center gap-1 font-semibold text-emerald-700 dark:text-emerald-300"><Check aria-hidden className="h-4 w-4" /> Respuesta correcta</span>}
                          {fallo && <span className="mt-1 flex items-center gap-1 font-semibold text-red-700 dark:text-red-300"><X aria-hidden className="h-4 w-4" /> Tu respuesta</span>}
                        </span>
                      </label>
                    );
                  })}
                </div>
                {corregido && elegida === undefined && <p className="mt-2 text-sm font-medium text-orange-700 dark:text-orange-300">Sin contestar.</p>}
              </fieldset>
            </li>
          );
        })}
      </ol>

      {!corregido && (
        <div className="sticky bottom-4 flex flex-wrap items-center justify-between gap-3 rounded-lg border bg-background/95 p-4 shadow-lg backdrop-blur">
          <p className="text-sm text-muted-foreground" aria-live="polite">Has contestado {contestadas} de {preguntas.length}.</p>
          <Button onClick={corregir}>Corregir el test</Button>
        </div>
      )}
    </div>
  );
}
