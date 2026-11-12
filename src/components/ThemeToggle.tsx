import { useState } from "react";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ThemeToggle() {
  const [oscuro, setOscuro] = useState(() => document.documentElement.classList.contains("dark"));
  const cambiar = () => {
    const nuevo = !oscuro;
    document.documentElement.classList.toggle("dark", nuevo);
    try { localStorage.setItem("tema", nuevo ? "oscuro" : "claro"); } catch { /* sin almacenamiento */ }
    setOscuro(nuevo);
  };
  return (
    <Button variant="ghost" size="icon" onClick={cambiar} aria-label={oscuro ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}>
      {oscuro ? <Sun /> : <Moon />}
    </Button>
  );
}
