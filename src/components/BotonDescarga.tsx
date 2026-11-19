import { useState } from "react";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";

// Descarga un PDF del cajón privado "cuadernos" de Supabase Storage.
// Supabase solo firma el enlace si hay sesión iniciada (regla RLS) y el enlace caduca en 60 segundos,
// así que no sirve para compartirlo.
export function BotonDescarga({ fichero, texto, variante = "outline" }: { fichero: string; texto: string; variante?: "default" | "outline" }) {
  const [estado, setEstado] = useState<"" | "preparando" | "error">("");

  const descargar = async () => {
    if (!supabase) return;
    setEstado("preparando");
    const { data, error } = await supabase.storage.from("cuadernos").createSignedUrl(fichero, 60, { download: fichero });
    if (error || !data) { setEstado("error"); return; }
    setEstado("");
    window.location.assign(data.signedUrl);
  };

  return (
    <div className="space-y-1">
      <Button type="button" variant={variante} className="w-full" onClick={descargar} disabled={estado === "preparando"}>
        <Download aria-hidden /> {estado === "preparando" ? "Preparando la descarga…" : texto}
      </Button>
      <p aria-live="polite" className="text-xs text-red-700 dark:text-red-300">
        {estado === "error" && "No se ha podido descargar. Inténtalo de nuevo en unos minutos."}
      </p>
    </div>
  );
}
