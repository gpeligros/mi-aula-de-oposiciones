import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";

// Sesión del alumno (Supabase Auth). Si no hay Supabase configurado
// (por ejemplo, en Vercel durante la beta), no hay registro: "disponible" = false.
type Sesion = {
  disponible: boolean;
  sesion: Session | null;
  email: string | null;
  cargando: boolean;
  salir: () => Promise<void>;
};

const Ctx = createContext<Sesion>({ disponible: false, sesion: null, email: null, cargando: false, salir: async () => {} });

export function SesionProvider({ children }: { children: ReactNode }) {
  const [sesion, setSesion] = useState<Session | null>(null);
  const [cargando, setCargando] = useState(!!supabase);

  useEffect(() => {
    if (!supabase) return;
    supabase.auth.getSession().then(({ data }) => {
      setSesion(data.session);
      setCargando(false);
    });
    const { data } = supabase.auth.onAuthStateChange((_evento, s) => setSesion(s));
    return () => data.subscription.unsubscribe();
  }, []);

  const salir = async () => {
    await supabase?.auth.signOut();
  };

  return (
    <Ctx.Provider value={{ disponible: !!supabase, sesion, email: sesion?.user.email ?? null, cargando, salir }}>
      {children}
    </Ctx.Provider>
  );
}

export const useSesion = () => useContext(Ctx);
