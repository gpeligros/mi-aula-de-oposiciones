import { useEffect, useState, type FormEvent } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Hourglass, LogOut, UserRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTitulo } from "@/lib/useTitulo";
import { supabase } from "@/lib/supabase";
import { useSesion } from "@/lib/sesion";

// Traduce los mensajes de error de Supabase Auth a un español claro.
function traducir(msg: string): string {
  const m = msg.toLowerCase();
  if (m.includes("invalid login credentials")) return "El correo o la contraseña no son correctos.";
  if (m.includes("already registered") || m.includes("already been registered")) return "Ya existe una cuenta con ese correo. Prueba a entrar.";
  if (m.includes("password should be") || m.includes("weak password")) return "La contraseña es demasiado débil. Usa al menos 8 caracteres.";
  if (m.includes("email not confirmed")) return "Tu correo aún no está confirmado.";
  if (m.includes("signups not allowed") || m.includes("signup is disabled")) return "El registro está cerrado en este momento.";
  if (m.includes("invalid") && m.includes("email")) return "Ese correo no parece válido.";
  if (m.includes("fetch") || m.includes("network")) return "No se ha podido conectar con el servidor. Inténtalo de nuevo.";
  return "No se ha podido completar. Inténtalo de nuevo.";
}

// Solo permitimos volver a rutas internas de la web (evita redirecciones a otras webs).
function rutaSegura(v: string | null) {
  return v && v.startsWith("/") && !v.startsWith("//") ? v : "/cuadernos";
}

export default function Entrar() {
  useTitulo("Entrar");
  const { disponible, sesion, email, cargando, salir } = useSesion();
  const [params] = useSearchParams();
  const volver = rutaSegura(params.get("volver"));
  const navigate = useNavigate();

  const [modo, setModo] = useState<"entrar" | "registro">(params.get("modo") === "registro" ? "registro" : "entrar");
  const [correo, setCorreo] = useState("");
  const [clave, setClave] = useState("");
  const [error, setError] = useState("");
  const [aviso, setAviso] = useState("");
  const [enviando, setEnviando] = useState(false);

  useEffect(() => { setError(""); setAviso(""); }, [modo]);

  if (!disponible) {
    return (
      <section className="container flex max-w-xl flex-col items-center py-24 text-center">
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
          <Hourglass aria-hidden className="h-6 w-6 text-primary" />
        </span>
        <h1 className="mt-6 text-3xl font-bold">El área del alumno llega muy pronto</h1>
        <p className="mt-3 text-muted-foreground">
          Estamos terminando el registro y los tests. Mientras tanto, puedes ver el catálogo y el temario de cada oposición.
        </p>
        <Button asChild className="mt-8"><Link to="/oposiciones">Ver oposiciones</Link></Button>
      </section>
    );
  }

  if (cargando) return <p className="container py-24 text-center text-muted-foreground">Cargando…</p>;

  if (sesion) {
    return (
      <section className="container flex max-w-xl flex-col items-center py-24 text-center">
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
          <UserRound aria-hidden className="h-6 w-6 text-primary" />
        </span>
        <h1 className="mt-6 text-3xl font-bold">Ya has entrado</h1>
        <p className="mt-3 text-muted-foreground">Has iniciado sesión como <strong className="text-foreground">{email}</strong>.</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Button asChild><Link to="/cuadernos">Ir a los cuadernos</Link></Button>
          <Button variant="outline" onClick={() => salir()}><LogOut aria-hidden /> Cerrar sesión</Button>
        </div>
      </section>
    );
  }

  const enviar = async (e: FormEvent) => {
    e.preventDefault();
    if (!supabase) return;
    setError(""); setAviso("");
    if (modo === "registro" && clave.length < 8) {
      setError("La contraseña debe tener al menos 8 caracteres.");
      return;
    }
    setEnviando(true);
    const r = modo === "entrar"
      ? await supabase.auth.signInWithPassword({ email: correo.trim(), password: clave })
      : await supabase.auth.signUp({ email: correo.trim(), password: clave });
    setEnviando(false);
    if (r.error) { setError(traducir(r.error.message)); return; }
    if (!r.data.session) {
      // El servidor pide confirmar el correo (en la beta del MiniPC no debería pasar).
      setAviso("Cuenta creada. Revisa tu correo para confirmarla y después entra.");
      return;
    }
    navigate(volver, { replace: true });
  };

  const registro = modo === "registro";

  return (
    <section className="container max-w-md py-16 sm:py-24">
      <h1 className="text-3xl font-bold">{registro ? "Crea tu cuenta gratis" : "Entra en tu aula"}</h1>
      <p className="mt-2 text-muted-foreground">
        {registro ? "Durante la beta todo el material es gratuito. Solo necesitas un correo y una contraseña." : "Accede a los temas completos y a los tests."}
      </p>

      <form onSubmit={enviar} className="mt-8 space-y-5 rounded-lg border bg-card p-6" noValidate>
        <div className="space-y-2">
          <label htmlFor="correo" className="text-sm font-medium">Correo electrónico</label>
          <Input id="correo" type="email" autoComplete="email" required value={correo}
            onChange={(e) => setCorreo(e.target.value)} aria-invalid={!!error} aria-describedby={error ? "error-entrar" : undefined} />
        </div>
        <div className="space-y-2">
          <label htmlFor="clave" className="text-sm font-medium">Contraseña</label>
          <Input id="clave" type="password" required minLength={registro ? 8 : undefined}
            autoComplete={registro ? "new-password" : "current-password"} value={clave}
            onChange={(e) => setClave(e.target.value)} aria-invalid={!!error}
            aria-describedby={[registro ? "ayuda-clave" : "", error ? "error-entrar" : ""].join(" ").trim() || undefined} />
          {registro && <p id="ayuda-clave" className="text-xs text-muted-foreground">Mínimo 8 caracteres.</p>}
        </div>

        <div aria-live="polite">
          {error && <p id="error-entrar" role="alert" className="rounded-md border border-red-300 bg-red-50 p-3 text-sm text-red-800 dark:border-red-800 dark:bg-red-950 dark:text-red-200">{error}</p>}
          {aviso && <p className="rounded-md border bg-warm-cream p-3 text-sm">{aviso}</p>}
        </div>

        <Button type="submit" className="w-full" disabled={enviando || !correo || !clave}>
          {enviando ? "Un momento…" : registro ? "Crear cuenta" : "Entrar"}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        {registro ? "¿Ya tienes cuenta? " : "¿Aún no tienes cuenta? "}
        <button type="button" className="font-medium text-primary underline underline-offset-4" onClick={() => setModo(registro ? "entrar" : "registro")}>
          {registro ? "Entra" : "Regístrate gratis"}
        </button>
      </p>
    </section>
  );
}
