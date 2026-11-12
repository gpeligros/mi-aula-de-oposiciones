import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input, Select } from "@/components/ui/input";
import { Cabecera } from "@/components/Cabecera";
import { AvisoEjemplo } from "@/components/AvisoEjemplo";
import { useTitulo } from "@/lib/useTitulo";
import {
  etiquetaAmbito, etiquetaEstado, etiquetaMaterial, familias, oposiciones,
  type Ambito, type EstadoConvocatoria, type Grupo, type Oposicion,
} from "@/data/catalogo";

const cifra = (n: number | null) => (n === null ? "Pendiente" : n.toLocaleString("es-ES"));

export function TarjetaOposicion({ o }: { o: Oposicion }) {
  return (
    <Card className="flex flex-col">
      <CardHeader>
        <div className="flex flex-wrap gap-2">
          <Badge variant="secondary">{o.grupo}</Badge>
          <Badge variant="outline">{etiquetaAmbito[o.ambito]}</Badge>
          <Badge variant={o.material === "disponible" ? "default" : "soft"}>{etiquetaMaterial[o.material]}</Badge>
        </div>
        <CardTitle className="mt-2">
          <Link to={`/oposiciones/${o.slug}`} className="hover:text-primary">{o.nombre}</Link>
        </CardTitle>
        <p className="text-sm text-muted-foreground">{o.organismo}</p>
      </CardHeader>
      <CardContent className="flex-1">
        <dl className="grid grid-cols-3 gap-2 rounded-lg bg-secondary/60 p-3 text-center">
          <div><dt className="text-xs text-muted-foreground">Temas</dt><dd className="font-semibold">{cifra(o.numTemas)}</dd></div>
          <div><dt className="text-xs text-muted-foreground">Preguntas</dt><dd className="font-semibold">{cifra(o.numPreguntas)}</dd></div>
          <div><dt className="text-xs text-muted-foreground">Supuestos</dt><dd className="font-semibold">{cifra(o.numSupuestos)}</dd></div>
        </dl>
        <p className="mt-3 text-xs text-muted-foreground">
          {etiquetaEstado[o.estado]} · Última actualización: {o.actualizado ?? "pendiente"}
        </p>
      </CardContent>
      <CardFooter>
        <Button asChild variant="outline" className="w-full"><Link to={`/oposiciones/${o.slug}`}>Ver ficha<span className="sr-only">: {o.nombre}</span></Link></Button>
      </CardFooter>
    </Card>
  );
}

export default function Oposiciones() {
  useTitulo("Oposiciones");
  const [texto, setTexto] = useState("");
  const [familia, setFamilia] = useState("");
  const [ambito, setAmbito] = useState<"" | Ambito>("");
  const [grupo, setGrupo] = useState<"" | Grupo>("");
  const [estado, setEstado] = useState<"" | EstadoConvocatoria>("");

  const lista = useMemo(() => {
    const q = texto.trim().toLowerCase();
    return oposiciones.filter((o) =>
      (!q || `${o.nombre} ${o.organismo}`.toLowerCase().includes(q)) &&
      (!familia || o.familia === familia) && (!ambito || o.ambito === ambito) &&
      (!grupo || o.grupo === grupo) && (!estado || o.estado === estado));
  }, [texto, familia, ambito, grupo, estado]);

  const limpiar = () => { setTexto(""); setFamilia(""); setAmbito(""); setGrupo(""); setEstado(""); };

  return (
    <>
      <Cabecera titulo="Oposiciones" subtitulo="Busca tu oposición y mira qué incluye: temario, preguntas de test, supuestos y estado de la convocatoria." />
      <div className="container py-10">
        <form role="search" onSubmit={(e) => e.preventDefault()} className="grid gap-4 rounded-lg border bg-card p-4 md:grid-cols-6">
          <div className="md:col-span-2">
            <label htmlFor="buscar" className="mb-1 block text-sm font-medium">Buscar</label>
            <div className="relative">
              <Search aria-hidden className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input id="buscar" type="search" value={texto} onChange={(e) => setTexto(e.target.value)} placeholder="Ej.: analista, TAI…" className="pl-9" />
            </div>
          </div>
          <div>
            <label htmlFor="f-familia" className="mb-1 block text-sm font-medium">Familia</label>
            <Select id="f-familia" value={familia} onChange={(e) => setFamilia(e.target.value)}>
              <option value="">Todas</option>
              {familias.map((f) => <option key={f.slug} value={f.slug}>{f.nombre}</option>)}
            </Select>
          </div>
          <div>
            <label htmlFor="f-ambito" className="mb-1 block text-sm font-medium">Ámbito</label>
            <Select id="f-ambito" value={ambito} onChange={(e) => setAmbito(e.target.value as Ambito | "")}>
              <option value="">Todos</option>
              {Object.entries(etiquetaAmbito).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
            </Select>
          </div>
          <div>
            <label htmlFor="f-grupo" className="mb-1 block text-sm font-medium">Grupo</label>
            <Select id="f-grupo" value={grupo} onChange={(e) => setGrupo(e.target.value as Grupo | "")}>
              <option value="">Todos</option>
              {(["A1", "A2", "C1", "C2"] as const).map((g) => <option key={g} value={g}>{g}</option>)}
            </Select>
          </div>
          <div>
            <label htmlFor="f-estado" className="mb-1 block text-sm font-medium">Convocatoria</label>
            <Select id="f-estado" value={estado} onChange={(e) => setEstado(e.target.value as EstadoConvocatoria | "")}>
              <option value="">Todas</option>
              {Object.entries(etiquetaEstado).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
            </Select>
          </div>
        </form>

        <div className="mt-6"><AvisoEjemplo /></div>

        <p className="mt-6 text-sm text-muted-foreground" aria-live="polite">
          {lista.length === 1 ? "1 oposición encontrada" : `${lista.length} oposiciones encontradas`}
        </p>
        {lista.length > 0 ? (
          <div className="mt-4 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {lista.map((o) => <TarjetaOposicion key={o.slug} o={o} />)}
          </div>
        ) : (
          <div className="mt-4 rounded-lg border border-dashed p-10 text-center">
            <p className="font-semibold">No hay oposiciones con esos filtros.</p>
            <p className="mt-1 text-sm text-muted-foreground">Las familias de Administrativo y Auxiliar llegarán más adelante.</p>
            <Button variant="outline" className="mt-4" onClick={limpiar}>Quitar filtros</Button>
          </div>
        )}
      </div>
    </>
  );
}
