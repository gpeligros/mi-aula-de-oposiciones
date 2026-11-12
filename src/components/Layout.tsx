import { useEffect, useState } from "react";
import { Link, NavLink, Outlet, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/Logo";
import { ThemeToggle } from "@/components/ThemeToggle";
import { CookieBanner, abrirPreferenciasCookies } from "@/components/CookieBanner";
import { cn } from "@/lib/utils";

const nav = [
  { to: "/oposiciones", label: "Oposiciones" },
  { to: "/metodo", label: "Método" },
  { to: "/recursos", label: "Recursos" },
  { to: "/planes", label: "Planes" },
];

function Header() {
  const [abierto, setAbierto] = useState(false);
  const { pathname } = useLocation();
  useEffect(() => setAbierto(false), [pathname]);

  const enlace = ({ isActive }: { isActive: boolean }) =>
    cn("rounded-md px-3 py-2 text-sm font-medium hover:text-primary", isActive ? "text-primary" : "text-foreground/80");

  return (
    <header className="sticky top-0 z-40 border-b bg-background/90 backdrop-blur">
      <div className="container flex h-16 items-center justify-between gap-4 sm:h-20">
        <Logo />
        <nav aria-label="Principal" className="hidden md:block">
          <ul className="flex items-center gap-1">
            {nav.map((n) => (
              <li key={n.to}><NavLink to={n.to} className={enlace}>{n.label}</NavLink></li>
            ))}
          </ul>
        </nav>
        <div className="hidden items-center gap-2 md:flex">
          <ThemeToggle />
          <Button asChild variant="ghost"><Link to="/entrar">Entrar</Link></Button>
          <Button asChild><Link to="/entrar">Empieza gratis</Link></Button>
        </div>
        <div className="flex items-center md:hidden">
          <ThemeToggle />
          <Button variant="ghost" size="icon" aria-expanded={abierto} aria-controls="menu-movil" aria-label={abierto ? "Cerrar menú" : "Abrir menú"} onClick={() => setAbierto(!abierto)}>
            {abierto ? <X /> : <Menu />}
          </Button>
        </div>
      </div>
      {abierto && (
        <nav id="menu-movil" aria-label="Principal" className="border-t bg-background md:hidden">
          <ul className="container flex flex-col gap-1 py-3">
            {nav.map((n) => (
              <li key={n.to}><NavLink to={n.to} className={({ isActive }) => cn(enlace({ isActive }), "block py-3 text-base")}>{n.label}</NavLink></li>
            ))}
            <li className="mt-2 grid grid-cols-2 gap-2">
              <Button asChild variant="outline"><Link to="/entrar">Entrar</Link></Button>
              <Button asChild><Link to="/entrar">Empieza gratis</Link></Button>
            </li>
          </ul>
        </nav>
      )}
    </header>
  );
}

function Footer() {
  return (
    <footer className="mt-24 border-t bg-warm-cream">
      <div className="container grid gap-10 py-12 sm:grid-cols-2 lg:grid-cols-4">
        <div className="space-y-3">
          <Logo />
          <p className="text-sm text-muted-foreground">Preparación de oposiciones públicas con método. Beta gratuita.</p>
        </div>
        <div>
          <h2 className="mb-3 text-sm font-semibold">Aprende</h2>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link className="hover:text-primary" to="/oposiciones">Oposiciones</Link></li>
            <li><Link className="hover:text-primary" to="/metodo">Método</Link></li>
            <li><Link className="hover:text-primary" to="/recursos">Recursos</Link></li>
          </ul>
        </div>
        <div>
          <h2 className="mb-3 text-sm font-semibold">Academia</h2>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link className="hover:text-primary" to="/planes">Planes</Link></li>
            <li><Link className="hover:text-primary" to="/entrar">Entrar</Link></li>
          </ul>
        </div>
        <div>
          <h2 className="mb-3 text-sm font-semibold">Legal</h2>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link className="hover:text-primary" to="/aviso-legal">Aviso legal</Link></li>
            <li><Link className="hover:text-primary" to="/privacidad">Privacidad</Link></li>
            <li><Link className="hover:text-primary" to="/cookies">Cookies</Link></li>
            <li><button type="button" className="hover:text-primary" onClick={abrirPreferenciasCookies}>Configurar cookies</button></li>
          </ul>
        </div>
      </div>
      <div className="border-t">
        <p className="container py-5 text-xs text-muted-foreground">
          © {new Date().getFullYear()} Mi Aula de Oposiciones. El temario se elabora a partir de fuentes oficiales; consulta siempre las bases de tu convocatoria.
        </p>
      </div>
    </footer>
  );
}

export function Layout() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return (
    <div className="flex min-h-screen flex-col">
      <a href="#contenido" className="sr-only z-50 rounded-md bg-primary px-4 py-2 text-primary-foreground focus:not-sr-only focus:fixed focus:left-4 focus:top-4">
        Saltar al contenido
      </a>
      <Header />
      <main id="contenido" tabIndex={-1} className="flex-1 focus:outline-none">
        <Outlet />
      </main>
      <Footer />
      <CookieBanner />
    </div>
  );
}
