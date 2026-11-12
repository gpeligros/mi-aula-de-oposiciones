import { AlertTriangle } from "lucide-react";
import { Cabecera } from "@/components/Cabecera";
import { useTitulo } from "@/lib/useTitulo";

type Seccion = { titulo: string; texto: string[] };

function PaginaLegal({ titulo, secciones }: { titulo: string; secciones: Seccion[] }) {
  useTitulo(titulo);
  return (
    <>
      <Cabecera titulo={titulo} />
      <div className="container max-w-3xl py-10">
        <p role="note" className="flex items-start gap-2 rounded-lg border border-primary/50 bg-primary/10 p-4 text-sm font-semibold">
          <AlertTriangle aria-hidden className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
          PENDIENTE DE REVISIÓN: texto de plantilla. Debe revisarlo un profesional antes de abrir la plataforma al público.
        </p>
        <div className="mt-8 space-y-8">
          {secciones.map((s) => (
            <section key={s.titulo}>
              <h2 className="text-xl font-bold">{s.titulo}</h2>
              {s.texto.map((t) => <p key={t} className="mt-2 text-muted-foreground">{t}</p>)}
            </section>
          ))}
        </div>
      </div>
    </>
  );
}

export function AvisoLegal() {
  return (
    <PaginaLegal titulo="Aviso legal" secciones={[
      { titulo: "Titular del sitio web", texto: ["[Nombre o razón social], [NIF], [domicilio], [correo de contacto]. Datos que exige el art. 10 de la Ley 34/2002 (LSSI)."] },
      { titulo: "Objeto", texto: ["Mi Aula de Oposiciones ofrece material de preparación de oposiciones públicas elaborado a partir de fuentes oficiales. No es una web oficial de ninguna Administración."] },
      { titulo: "Responsabilidad", texto: ["El material se revisa con cuidado, pero las bases de cada convocatoria y los boletines oficiales son siempre la referencia válida."] },
      { titulo: "Propiedad intelectual", texto: ["Los textos, esquemas y preguntas propios de esta web no pueden reproducirse sin autorización. Las normas citadas son de dominio público."] },
    ]} />
  );
}

export function Privacidad() {
  return (
    <PaginaLegal titulo="Política de privacidad" secciones={[
      { titulo: "Responsable del tratamiento", texto: ["[Nombre o razón social], [NIF], [correo de contacto para protección de datos]."] },
      { titulo: "Qué datos tratamos y para qué", texto: ["Cuando abramos el registro: correo electrónico, nombre o alias y tu actividad de estudio (tests, progreso), para prestarte el servicio. Base jurídica: ejecución del servicio que solicitas (art. 6.1.b RGPD)."] },
      { titulo: "Cuánto tiempo los guardamos", texto: ["Mientras mantengas tu cuenta. Si la borras, se eliminan tus datos salvo obligación legal de conservarlos."] },
      { titulo: "Con quién los compartimos", texto: ["Con los proveedores técnicos necesarios para alojar la plataforma (alojamiento web y base de datos), con contrato de encargado del tratamiento. [Indicar proveedores y si hay transferencias internacionales]."] },
      { titulo: "Tus derechos", texto: ["Acceso, rectificación, supresión, oposición, limitación y portabilidad, escribiendo a [correo]. También puedes reclamar ante la Agencia Española de Protección de Datos (www.aepd.es)."] },
    ]} />
  );
}

export function Cookies() {
  return (
    <PaginaLegal titulo="Política de cookies" secciones={[
      { titulo: "Qué usamos ahora", texto: ["Solo almacenamiento técnico en tu navegador: tu preferencia de modo claro u oscuro y tu elección sobre las cookies. No requieren consentimiento porque son necesarias para el funcionamiento (art. 22.2 LSSI)."] },
      { titulo: "Analítica", texto: ["Ahora mismo no usamos cookies de analítica ni de publicidad. Si las añadimos, solo se activarán si las aceptas en el banner."] },
      { titulo: "Cómo cambiar tu elección", texto: ["Pulsa “Configurar cookies” en el pie de cualquier página."] },
    ]} />
  );
}
