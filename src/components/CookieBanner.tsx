import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

// Hoy la web solo usa almacenamiento técnico (tema claro/oscuro y esta elección).
// Cuando haya analítica, solo se cargará si "analitica" es true.
const CLAVE = "consentimiento-cookies";
const EVENTO = "abrir-preferencias-cookies";

type Consentimiento = { analitica: boolean; fecha: string };

export function leerConsentimiento(): Consentimiento | null {
  try { const v = localStorage.getItem(CLAVE); return v ? (JSON.parse(v) as Consentimiento) : null; } catch { return null; }
}

export function abrirPreferenciasCookies() {
  window.dispatchEvent(new Event(EVENTO));
}

export function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!leerConsentimiento()) setVisible(true);
    const abrir = () => setVisible(true);
    window.addEventListener(EVENTO, abrir);
    return () => window.removeEventListener(EVENTO, abrir);
  }, []);

  const guardar = (analitica: boolean) => {
    try { localStorage.setItem(CLAVE, JSON.stringify({ analitica, fecha: new Date().toISOString() })); } catch { /* sin almacenamiento */ }
    setVisible(false);
  };

  if (!visible) return null;
  return (
    <section role="dialog" aria-modal="false" aria-labelledby="cookies-titulo" className="fixed inset-x-0 bottom-0 z-50 p-4">
      <div className="container max-w-3xl rounded-lg border bg-card p-5 shadow-lg">
        <h2 id="cookies-titulo" className="font-semibold">Tu privacidad</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Usamos solo almacenamiento técnico necesario para que la web funcione. Si en el futuro añadimos cookies de analítica, solo se activarán si las aceptas.{" "}
          <Link to="/cookies" className="text-primary underline underline-offset-4">Más información</Link>
        </p>
        <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:justify-end">
          <Button variant="outline" onClick={() => guardar(false)}>Rechazar no esenciales</Button>
          <Button onClick={() => guardar(true)}>Aceptar todas</Button>
        </div>
      </div>
    </section>
  );
}
