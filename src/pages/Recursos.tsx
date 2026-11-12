import { Download, FileText } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Cabecera } from "@/components/Cabecera";
import { AvisoEjemplo } from "@/components/AvisoEjemplo";
import { useTitulo } from "@/lib/useTitulo";
import { recursos } from "@/data/catalogo";

export default function Recursos() {
  useTitulo("Recursos");
  return (
    <>
      <Cabecera titulo="Recursos gratuitos" subtitulo="Artículos y descargas para estudiar mejor, prepares la oposición que prepares." />
      <div className="container py-10">
        <AvisoEjemplo>Contenido de ejemplo: estos recursos se publicarán durante la beta.</AvisoEjemplo>
        <ul className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {recursos.map((r) => {
            const Icono = r.tipo === "Descarga" ? Download : FileText;
            return (
              <li key={r.titulo}>
                <Card className="h-full">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <Badge variant="secondary"><Icono aria-hidden className="mr-1 h-3 w-3" />{r.tipo}</Badge>
                      <span className="text-xs text-muted-foreground">Próximamente</span>
                    </div>
                    <CardTitle className="mt-2">{r.titulo}</CardTitle>
                    <CardDescription>{r.resumen}</CardDescription>
                  </CardHeader>
                </Card>
              </li>
            );
          })}
        </ul>
      </div>
    </>
  );
}
