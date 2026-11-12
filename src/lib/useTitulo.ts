import { useEffect } from "react";

const BASE = "Mi Aula de Oposiciones";

export function useTitulo(titulo?: string) {
  useEffect(() => {
    document.title = titulo ? `${titulo} · ${BASE}` : `${BASE} · Prepara tu oposición con método`;
  }, [titulo]);
}
