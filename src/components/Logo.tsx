import { Link } from "react-router-dom";

export function Logo() {
  return (
    <Link to="/" className="flex items-center gap-2.5 rounded-md font-bold">
      <svg aria-hidden viewBox="0 0 32 32" className="h-8 w-8">
        <rect width="32" height="32" rx="8" className="fill-primary" />
        <path d="M8 22V11l8 6 8-6v11" fill="none" className="stroke-primary-foreground" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <span className="leading-tight">
        Mi Aula <span className="font-normal text-muted-foreground">de Oposiciones</span>
      </span>
    </Link>
  );
}
