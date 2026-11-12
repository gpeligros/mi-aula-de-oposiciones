export function Cabecera({ titulo, subtitulo, children }: { titulo: string; subtitulo?: string; children?: React.ReactNode }) {
  return (
    <section className="bg-warm-cream">
      <div className="container py-12 md:py-16">
        {children}
        <h1 className="text-3xl font-extrabold sm:text-4xl">{titulo}</h1>
        {subtitulo && <p className="mt-3 max-w-2xl text-lg text-muted-foreground">{subtitulo}</p>}
      </div>
    </section>
  );
}
