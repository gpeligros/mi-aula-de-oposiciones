"""Genera el catálogo de cuadernos para la web a partir de los JSON de bloque
(herramienta maqueta_venta del proyecto) y de los PDF finales.

Salidas:
  src/data/cuadernos.generado.json   -> datos que usa la web si no hay Supabase
  supabase/seed/01_catalogo.sql      -> carga del catálogo en el esquema aula
  supabase/seed/02_contenidos.sql    -> texto completo de cada tema (solo con sesión)
                                        OJO: si se vuelve a cargar el 01, hay que cargar después el 02

Uso: python3 scripts/generar_catalogo.py CARPETA_JSON CARPETA_PDF
"""
import json
import sys
from pathlib import Path

RAIZ = Path(__file__).resolve().parent.parent

# slug web, archivo JSON, PDF final, tipo, orden
CUADERNOS = [
    ("redes", "bloque_redes.json", "01_Mi_Aula_Redes_y_comunicaciones.pdf", "temario"),
    ("seguridad", "bloque_seguridad.json", "02_Mi_Aula_Seguridad_ENS_y_auditoria.pdf", "temario"),
    ("sistemas", "bloque_sistemas.json", "03_Mi_Aula_Sistemas_operativos_y_mantenimiento.pdf", "temario"),
    ("virtualizacion", "bloque_virtualizacion.json", "04_Mi_Aula_Virtualizacion_cloud_y_CPD.pdf", "temario"),
    ("almacenamiento", "bloque_almacenamiento.json", "05_Mi_Aula_Almacenamiento_directorio_y_copias.pdf", "temario"),
    ("bases-de-datos", "bloque_bbdd.json", "06_Mi_Aula_Bases_de_datos.pdf", "temario"),
    ("servicios-web", "bloque_web.json", "07_Mi_Aula_Servicios_web_CMS_y_correo.pdf", "temario"),
    ("normativa-comun", "bloque_derecho_comun.json", "08_Mi_Aula_Normativa_comun.pdf", "temario"),
    ("regimen-local", "bloque_regimen_local.json", "09_Mi_Aula_Regimen_local.pdf", "temario"),
    ("psicotecnicos", "bloque_psicotecnicos.json", "10_Mi_Aula_Psicotecnicos.pdf", "psicotecnicos"),
]
# Qué cuadernos forman el temario de cada oposición (orden de estudio)
ENLACES = {
    "analista-programador-informatica-local-c1": [
        "normativa-comun", "regimen-local", "redes", "seguridad", "sistemas",
        "virtualizacion", "almacenamiento", "bases-de-datos", "servicios-web"],
}
ACTUALIZADO = "2026-11-18"
# PDF del pack completo de cada oposición (bucket privado "cuadernos" de Supabase Storage)
PACKS = {"analista-programador-informatica-local-c1": "00_Mi_Aula_Pack_completo_Informatica.pdf"}


def paginas(pdf):
    try:
        import pymupdf
        return pymupdf.open(pdf).page_count
    except Exception:
        return None


def q(v):
    if v is None:
        return "null"
    if isinstance(v, bool):
        return "true" if v else "false"
    if isinstance(v, (int, float)):
        return str(v)
    if isinstance(v, (list, dict)):
        return "'" + json.dumps(v, ensure_ascii=False).replace("'", "''") + "'::jsonb"
    return "'" + str(v).replace("'", "''") + "'"


def main():
    dj, dp = Path(sys.argv[1]), Path(sys.argv[2])
    cuadernos, temas, contenidos = [], [], []
    for orden, (slug, fj, fp, tipo) in enumerate(CUADERNOS, 1):
        b = json.loads((dj / fj).read_text(encoding="utf-8"))
        ts = b["temas"]
        c = {
            "slug": slug, "tipo": tipo, "titulo": b["titulo"], "subtitulo": b["subtitulo"],
            "etiqueta": b.get("etiqueta", ""), "edicion": b["edicion"],
            "numTemas": len(ts), "numPreguntas": sum(len(t["test"]) for t in ts),
            "numSupuestos": len(ts), "paginas": paginas(dp / fp), "pdf": fp, "actualizado": ACTUALIZADO, "orden": orden,
        }
        cuadernos.append(c)
        for n, t in enumerate(ts, 1):
            contenidos.append((slug, n, {k: v for k, v in t.items() if k != "aprender"}))
            temas.append({
                "cuaderno": slug, "orden": n, "titulo": t["titulo"], "corto": t["corto"],
                "aprender": t.get("aprender", []), "numPreguntas": len(t["test"]),
                "incluye": (t.get("supuesto_banner") or ["Supuesto práctico"])[0],
            })
    datos = {"cuadernos": cuadernos, "temas": temas, "enlaces": ENLACES, "packs": PACKS, "generado": ACTUALIZADO}
    (RAIZ / "src/data/cuadernos.generado.json").write_text(json.dumps(datos, ensure_ascii=False, indent=1), encoding="utf-8")

    sql = ["-- Datos del catálogo de cuadernos (generado por scripts/generar_catalogo.py). Se puede ejecutar varias veces.",
           "begin;", "set local search_path = aula;",
           "delete from aula.oposicion_cuadernos; delete from aula.temas; delete from aula.cuadernos;"]
    for c in cuadernos:
        sql.append("insert into aula.cuadernos (slug, tipo, titulo, subtitulo, etiqueta, edicion, num_temas, num_preguntas, num_supuestos, paginas, pdf, actualizado, orden, publicado) values ("
                   + ", ".join(q(x) for x in [c["slug"], c["tipo"], c["titulo"], c["subtitulo"], c["etiqueta"], c["edicion"], c["numTemas"],
                                              c["numPreguntas"], c["numSupuestos"], c["paginas"], c["pdf"], c["actualizado"], c["orden"], True]) + ");")
    for t in temas:
        sql.append("insert into aula.temas (cuaderno_slug, orden, titulo, corto, aprender, num_preguntas, incluye) values ("
                   + ", ".join(q(x) for x in [t["cuaderno"], t["orden"], t["titulo"], t["corto"], t["aprender"], t["numPreguntas"], t["incluye"]]) + ");")
    for op, lst in ENLACES.items():
        for n, s in enumerate(lst, 1):
            sql.append(f"insert into aula.oposicion_cuadernos (oposicion_slug, cuaderno_slug, orden) values ({q(op)}, {q(s)}, {n});")
    # cifras de la oposición, calculadas a partir de sus cuadernos
    for op, lst in ENLACES.items():
        cs = [c for c in cuadernos if c["slug"] in lst]
        sql.append(f"update aula.oposiciones set num_temas = {sum(c['numTemas'] for c in cs)}, num_preguntas = {sum(c['numPreguntas'] for c in cs)}, "
                   f"num_supuestos = {sum(c['numSupuestos'] for c in cs)}, actualizado = {q(ACTUALIZADO)}, material = 'disponible', pack_pdf = {q(PACKS.get(op))} where slug = {q(op)};")
    sql.append("commit;")
    (RAIZ / "supabase/seed/01_catalogo.sql").write_text("\n".join(sql) + "\n", encoding="utf-8")

    sql = ["-- Texto completo de los temas (generado por scripts/generar_catalogo.py). Se puede ejecutar varias veces.",
           "-- Ejecutar DESPUÉS de 01_catalogo.sql.", "begin;", "delete from aula.contenidos_tema;"]
    for slug, n, cont in contenidos:
        sql.append(f"insert into aula.contenidos_tema (cuaderno_slug, orden, contenido, actualizado) values ({q(slug)}, {n}, {q(cont)}, {q(ACTUALIZADO)});")
    sql.append("commit;")
    (RAIZ / "supabase/seed/02_contenidos.sql").write_text("\n".join(sql) + "\n", encoding="utf-8")
    print(len(cuadernos), "cuadernos,", len(temas), "temas,", len(contenidos), "contenidos")


if __name__ == "__main__":
    main()
