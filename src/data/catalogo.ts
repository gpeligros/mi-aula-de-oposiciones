// Catálogo de la web pública.
// Provisional: cuando montemos Supabase, estos datos pasarán a las tablas
// "familias", "oposiciones", "bloques" y "temas".
//
// Regla: no se inventan cifras. Lo que no sabemos se deja en null y la web
// lo muestra como "Pendiente". Lo que es de relleno lleva ejemplo: true.

export type Ambito = "estado" | "ccaa" | "local";
export type Grupo = "A1" | "A2" | "C1" | "C2";
export type EstadoConvocatoria = "abierta" | "prevista" | "en_preparacion";
export type EstadoMaterial = "disponible" | "en_preparacion";

export interface Familia {
  slug: string;
  nombre: string;
  descripcion: string;
  activa: boolean;
}

export interface Tema {
  codigo: string;
  titulo: string;
}

export interface Bloque {
  nombre: string;
  temas: Tema[];
}

export interface Ejercicio {
  nombre: string;
  descripcion: string;
}

export interface Oposicion {
  slug: string;
  familia: string;
  nombre: string;
  organismo: string;
  ambito: Ambito;
  grupo: Grupo;
  estado: EstadoConvocatoria;
  material: EstadoMaterial;
  numTemas: number | null;
  numPreguntas: number | null;
  numSupuestos: number | null;
  actualizado: string | null; // dd/mm/aaaa
  resumen: string;
  requisitos: string[];
  formatoExamen: Ejercicio[] | null;
  bloques: Bloque[];
  fuenteOficial: { texto: string; url: string };
  ejemplo: boolean;
}

export const familias: Familia[] = [
  {
    slug: "informatica",
    nombre: "Informática",
    descripcion: "Técnicos y analistas de sistemas, redes, seguridad y desarrollo para cualquier Administración.",
    activa: true,
  },
  {
    slug: "administrativo",
    nombre: "Administrativo",
    descripcion: "Cuerpos administrativos del Estado, de las comunidades autónomas y de la Administración local.",
    activa: false,
  },
  {
    slug: "auxiliar-administrativo",
    nombre: "Auxiliar Administrativo",
    descripcion: "La puerta de entrada más habitual al empleo público.",
    activa: false,
  },
];

const requisitosC1 = [
  "Nacionalidad española o de un Estado de la Unión Europea, en los términos del art. 57 del TREBEP.",
  "Tener cumplidos 16 años y no superar la edad máxima de jubilación forzosa.",
  "Título de Bachiller o Técnico (grupo C1, art. 76 del TREBEP), salvo lo que digan las bases.",
  "Capacidad funcional para el desempeño de las tareas.",
  "No haber sido separado ni estar inhabilitado para el empleo público.",
];

const requisitosA2 = [
  "Nacionalidad española o de un Estado de la Unión Europea, en los términos del art. 57 del TREBEP.",
  "Tener cumplidos 16 años y no superar la edad máxima de jubilación forzosa.",
  "Título universitario de Grado (grupo A2, art. 76 del TREBEP), salvo lo que digan las bases.",
  "Capacidad funcional para el desempeño de las tareas.",
  "No haber sido separado ni estar inhabilitado para el empleo público.",
];

export const oposiciones: Oposicion[] = [
  {
    slug: "analista-programador-informatica-local-c1",
    familia: "informatica",
    nombre: "Analista/Programador de Informática",
    organismo: "Administración local (ayuntamientos)",
    ambito: "local",
    grupo: "C1",
    estado: "prevista",
    material: "disponible",
    numTemas: 48,
    numPreguntas: 862,
    numSupuestos: null,
    actualizado: "09/11/2026",
    resumen:
      "Plaza técnica de informática en ayuntamientos: administración de sistemas y redes, seguridad, bases de datos, virtualización y servicios web, más un temario general de derecho administrativo.",
    requisitos: requisitosC1,
    formatoExamen: [
      { nombre: "Primer ejercicio", descripcion: "Test sobre el temario general y específico, normalmente con penalización por respuesta errónea." },
      { nombre: "Segundo ejercicio", descripcion: "Supuesto práctico sobre el temario específico." },
      { nombre: "Fase de concurso", descripcion: "Solo si la convocatoria es de concurso-oposición: méritos de experiencia y formación." },
    ],
    bloques: [
      {
        nombre: "Bloque I · Derecho administrativo",
        temas: [
          { codigo: "G1", titulo: "Alcalde, Junta de Gobierno y Pleno en municipios de gran población" },
          { codigo: "G2", titulo: "La Ley: tipos, reserva de ley, Decreto-ley y Decreto legislativo" },
          { codigo: "G3", titulo: "Ley 39/2015: los interesados en el procedimiento" },
          { codigo: "G4", titulo: "Ley 39/2015: actividad de las Administraciones públicas" },
          { codigo: "G5", titulo: "Ley 39/2015: términos y plazos, actos administrativos, eficacia y nulidad" },
          { codigo: "G6", titulo: "Ley 39/2015: el procedimiento administrativo común" },
          { codigo: "G7", titulo: "Ley 39/2015: revisión de los actos en vía administrativa" },
          { codigo: "G8", titulo: "Ley 40/2015 de Régimen Jurídico del Sector Público (I)" },
        ],
      },
      {
        nombre: "Bloque II · Redes",
        temas: [
          { codigo: "E13", titulo: "Modelo TCP/IP: capas, protocolos, direccionamiento y enrutamiento" },
          { codigo: "E14", titulo: "Redes locales y de área extensa: tipologías, medios de transmisión y dispositivos" },
          { codigo: "E15", titulo: "Administración de redes: gestión de usuarios, control de tráfico, SNMP" },
          { codigo: "E16", titulo: "Redes inalámbricas y su seguridad: Wi-Fi, Bluetooth y normativas" },
          { codigo: "E39", titulo: "VoIP y telecomunicaciones: convergencia con redes de datos" },
        ],
      },
      {
        nombre: "Bloque III · Seguridad",
        temas: [
          { codigo: "E17", titulo: "Seguridad en redes: control de accesos, cortafuegos, VPN e IDS" },
          { codigo: "E18", titulo: "Seguridad en bases de datos: cifrado, control de acceso y auditoría" },
          { codigo: "E19", titulo: "Esquema Nacional de Seguridad (ENS)" },
          { codigo: "E20", titulo: "Identificación y firma electrónica: certificados, DNIe y biometría" },
          { codigo: "E29", titulo: "Auditoría informática: objetivos, técnicas y metodologías" },
          { codigo: "E30", titulo: "Protección de datos en la Administración: normativa y herramientas" },
          { codigo: "E31", titulo: "Seguridad en el puesto de trabajo: malware, XDR, EDR y cumplimiento" },
          { codigo: "E32", titulo: "Centro de Operaciones de Ciberseguridad (SOC)" },
          { codigo: "E40", titulo: "Acceso remoto seguro: VPN, teletrabajo y gestión de identidades" },
        ],
      },
      {
        nombre: "Bloque IV · Sistemas",
        temas: [
          { codigo: "E5", titulo: "GNU/Linux: arquitectura, instalación, configuración y administración" },
          { codigo: "E6", titulo: "Windows Server: versiones, instalación, configuración y administración" },
          { codigo: "E7", titulo: "Administración avanzada de servidores: rendimiento y optimización" },
          { codigo: "E8", titulo: "Scripting y automatización: Shell en Linux y PowerShell" },
          { codigo: "E21", titulo: "Mantenimiento de servidores y redes: preventivo, correctivo y perfectivo" },
          { codigo: "E22", titulo: "Monitorización y gestión de capacidad en servidores y bases de datos" },
          { codigo: "E23", titulo: "Gestión de inventario, licencias y actualizaciones de software" },
        ],
      },
      {
        nombre: "Bloque V · Virtualización y cloud",
        temas: [
          { codigo: "E1", titulo: "Tecnologías actuales: dispositivos móviles, servidores y supercomputadores" },
          { codigo: "E2", titulo: "Virtualización: tipos y aplicaciones en la Administración pública" },
          { codigo: "E3", titulo: "Cloud computing: IaaS, PaaS, SaaS en entornos públicos" },
          { codigo: "E4", titulo: "Centros de Procesamiento de Datos (CPD): planificación y consolidación" },
          { codigo: "E33", titulo: "VMware vSphere: arquitectura, administración y optimización" },
          { codigo: "E34", titulo: "Docker y Kubernetes: contenedores y orquestación" },
          { codigo: "E35", titulo: "Hiperconvergencia y almacenamiento definido por software" },
          { codigo: "E36", titulo: "Entornos híbridos: infraestructura local y nube" },
        ],
      },
      {
        nombre: "Bloque VI · Almacenamiento y directorio",
        temas: [
          { codigo: "E24", titulo: "Estrategias de backup y recuperación de la información" },
          { codigo: "E37", titulo: "Almacenamiento SAN, NAS y DAS: gestión y administración" },
          { codigo: "E38", titulo: "Servicios de directorio: LDAP, OpenLDAP y Active Directory" },
        ],
      },
      {
        nombre: "Bloque VII · Bases de datos",
        temas: [
          { codigo: "E9", titulo: "Modelado lógico y físico de bases de datos. Arquitectura ANSI/SPARC" },
          { codigo: "E10", titulo: "Diseño, normalización y optimización de bases de datos relacionales" },
          { codigo: "E11", titulo: "SQL y PL/SQL: gestión de datos, seguridad y usuarios" },
          { codigo: "E12", titulo: "Administración de SGBD: copias, recuperación y conflictos" },
        ],
      },
      {
        nombre: "Bloque VIII · Servicios web",
        temas: [
          { codigo: "E25", titulo: "Servidores web: Apache, Tomcat y Nginx" },
          { codigo: "E26", titulo: "Gestión de contenidos: CMS y gestores documentales" },
          { codigo: "E27", titulo: "Aplicaciones web y seguridad: estándares, interoperabilidad y servicios web" },
          { codigo: "E28", titulo: "Correo electrónico en entornos corporativos" },
        ],
      },
    ],
    fuenteOficial: {
      texto: "Boletín Oficial de la provincia o comunidad correspondiente",
      url: "https://www.boe.es/",
    },
    ejemplo: true,
  },
  {
    slug: "tai-tecnico-auxiliar-informatica-estado-c1",
    familia: "informatica",
    nombre: "Técnico Auxiliar de Informática (TAI)",
    organismo: "Administración General del Estado",
    ambito: "estado",
    grupo: "C1",
    estado: "prevista",
    material: "en_preparacion",
    numTemas: null,
    numPreguntas: null,
    numSupuestos: null,
    actualizado: null,
    resumen:
      "Cuerpo técnico de informática del Estado. Gran parte del temario específico (redes, sistemas, bases de datos, seguridad) se comparte con otras oposiciones del catálogo.",
    requisitos: requisitosC1,
    formatoExamen: null,
    bloques: [],
    fuenteOficial: { texto: "Boletín Oficial del Estado (BOE)", url: "https://www.boe.es/" },
    ejemplo: true,
  },
  {
    slug: "gsi-gestion-sistemas-informatica-estado-a2",
    familia: "informatica",
    nombre: "Gestión de Sistemas e Informática (GSI)",
    organismo: "Administración General del Estado",
    ambito: "estado",
    grupo: "A2",
    estado: "prevista",
    material: "en_preparacion",
    numTemas: null,
    numPreguntas: null,
    numSupuestos: null,
    actualizado: null,
    resumen:
      "Cuerpo de gestión de sistemas e informática del Estado, con mayor peso en dirección de proyectos y arquitectura de sistemas.",
    requisitos: requisitosA2,
    formatoExamen: null,
    bloques: [],
    fuenteOficial: { texto: "Boletín Oficial del Estado (BOE)", url: "https://www.boe.es/" },
    ejemplo: true,
  },
];

export const etiquetaAmbito: Record<Ambito, string> = {
  estado: "Estado",
  ccaa: "Comunidad Autónoma",
  local: "Local",
};

export const etiquetaEstado: Record<EstadoConvocatoria, string> = {
  abierta: "Convocatoria abierta",
  prevista: "Convocatoria prevista",
  en_preparacion: "En preparación",
};

export const etiquetaMaterial: Record<EstadoMaterial, string> = {
  disponible: "Material disponible",
  en_preparacion: "Material en preparación",
};

export interface Recurso {
  titulo: string;
  tipo: "Artículo" | "Descarga";
  resumen: string;
  ejemplo: true;
}

export const recursos: Recurso[] = [
  {
    titulo: "Cómo se calcula la nota en un test con penalización",
    tipo: "Artículo",
    resumen: "Aciertos, fallos y blancos: cuándo compensa arriesgar y cuándo dejar una pregunta en blanco.",
    ejemplo: true,
  },
  {
    titulo: "Repaso espaciado: estudiar menos veces y recordar más",
    tipo: "Artículo",
    resumen: "Qué es la curva del olvido y cómo organizar los repasos para que el temario no se escape.",
    ejemplo: true,
  },
  {
    titulo: "Cómo leer una convocatoria en el BOE sin perderse",
    tipo: "Artículo",
    resumen: "Las partes de unas bases, qué plazos importan y dónde mirar las listas y los resultados.",
    ejemplo: true,
  },
  {
    titulo: "Plantilla de planificación semanal",
    tipo: "Descarga",
    resumen: "Una hoja sencilla para repartir temas, tests y repasos según tus horas disponibles.",
    ejemplo: true,
  },
  {
    titulo: "Esquema de la Ley 39/2015 en una página",
    tipo: "Descarga",
    resumen: "Plazos, silencio administrativo y recursos: los números que más caen, en un vistazo.",
    ejemplo: true,
  },
  {
    titulo: "Glosario de siglas de informática pública",
    tipo: "Descarga",
    resumen: "ENS, CCN-CERT, SARA, Cl@ve, eIDAS… lo que significa cada sigla y en qué tema aparece.",
    ejemplo: true,
  },
];
