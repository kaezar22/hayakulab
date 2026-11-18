// Taxonomía y validación de la clasificación que devuelve el LLM. Lo que no
// encaja en la taxonomía se descarta o se lleva a un valor neutro.

export const TOPICS = {
  conflicto: "Conflicto armado",
  comercio: "Comercio y aranceles",
  sanciones: "Sanciones",
  energia: "Energía y materias primas",
  diplomacia: "Diplomacia",
  elecciones: "Elecciones y política interna",
  economia: "Economía y bancos centrales",
  tecnologia: "Tecnología y ciberseguridad",
  migracion: "Migración y fronteras",
  derechos: "Derechos humanos y justicia",
} as const;
export type Topic = keyof typeof TOPICS;

export const TOPICS_EN: Record<Topic, string> = {
  conflicto: "Armed conflict",
  comercio: "Trade and tariffs",
  sanciones: "Sanctions",
  energia: "Energy and commodities",
  diplomacia: "Diplomacy",
  elecciones: "Elections and domestic politics",
  economia: "Economy and central banks",
  tecnologia: "Technology and cybersecurity",
  migracion: "Migration and borders",
  derechos: "Human rights and justice",
};

export const TOPICS_ZH: Record<Topic, string> = {
  conflicto: "武装冲突",
  comercio: "贸易与关税",
  sanciones: "制裁",
  energia: "能源与大宗商品",
  diplomacia: "外交",
  elecciones: "选举与国内政治",
  economia: "经济与央行",
  tecnologia: "科技与网络安全",
  migracion: "移民与边境",
  derechos: "人权与司法",
};

export type GeoLang = "es" | "en" | "zh";

export function topicLabel(t: Topic, lang: GeoLang = "es") {
  return lang === "en" ? TOPICS_EN[t] : lang === "zh" ? TOPICS_ZH[t] : TOPICS[t];
}

export const TONES = ["positivo", "neutral", "negativo"] as const;
export type Tone = (typeof TONES)[number];

/** Efecto probable en el riesgo que perciben los mercados. */
export const RISKS = ["aumenta", "neutral", "disminuye"] as const;
export type Risk = (typeof RISKS)[number];

export type Classification = {
  /** Índice de la noticia en el lote enviado. */
  i: number;
  summary: string;
  /** Resumen en inglés (para la versión en inglés del sitio). */
  summaryEn: string;
  /** Resumen en chino simplificado. */
  summaryZh: string;
  people: string[];
  /** ISO 3166-1 alfa-2. */
  countries: string[];
  topic: Topic;
  subtopic: string;
  subtopicEn: string;
  subtopicZh: string;
  tone: Tone;
  risk: Risk;
};

const regionNames = new Intl.DisplayNames(["es"], { type: "region" });
const regionNamesEn = new Intl.DisplayNames(["en"], { type: "region" });
const regionNamesZh = new Intl.DisplayNames(["zh-Hans"], { type: "region" });

/** Código ISO válido (o "EU" para la Unión Europea). */
export function isCountryCode(code: string): boolean {
  if (!/^[A-Z]{2}$/.test(code)) return false;
  try {
    return regionNames.of(code) !== code;
  } catch {
    return false;
  }
}

export function countryName(code: string, lang: GeoLang = "es"): string {
  try {
    return (lang === "en" ? regionNamesEn : lang === "zh" ? regionNamesZh : regionNames).of(code) ?? code;
  } catch {
    return code;
  }
}

/** Bandera emoji a partir del código ISO. */
export function flag(code: string): string {
  return String.fromCodePoint(...[...code.toUpperCase()].map((c) => 0x1f1e6 + c.charCodeAt(0) - 65));
}

function norm(v: unknown): string {
  return String(v ?? "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .trim();
}

function strings(v: unknown, max: number): string[] {
  if (!Array.isArray(v)) return [];
  const out: string[] = [];
  for (const x of v) {
    if (typeof x !== "string") continue;
    const s = x.replace(/\s+/g, " ").trim();
    if (s && s.length <= 60 && !out.includes(s)) out.push(s);
    if (out.length === max) break;
  }
  return out;
}

/**
 * Respuesta esperada: {"items":[{"i":0,"geo":true,"summary":…,"people":[…],
 * "countries":["US"],"topic":"comercio","subtopic":…,"tone":…,"risk":…}]}.
 * Solo se devuelven las noticias marcadas como geopolíticas y con índice válido.
 */
export function parseClassification(raw: string, count: number): Classification[] {
  let data: unknown;
  try {
    data = JSON.parse(raw);
  } catch {
    return [];
  }
  const items = (data as { items?: unknown })?.items;
  if (!Array.isArray(items)) return [];

  const seen = new Set<number>();
  const out: Classification[] = [];
  for (const item of items) {
    if (!item || typeof item !== "object") continue;
    const o = item as Record<string, unknown>;
    const i = Number(o.i);
    if (!Number.isInteger(i) || i < 0 || i >= count || seen.has(i)) continue;
    if (o.geo === false || norm(o.geo) === "false") continue;

    const topic = norm(o.topic) as Topic;
    const summary = typeof o.summary === "string" ? o.summary.trim() : "";
    if (!(topic in TOPICS) || !summary) continue;

    const tone = norm(o.tone) as Tone;
    const risk = norm(o.risk) as Risk;
    seen.add(i);
    out.push({
      i,
      summary: summary.slice(0, 400),
      summaryEn: typeof o.summary_en === "string" && o.summary_en.trim() ? o.summary_en.trim().slice(0, 400) : summary.slice(0, 400),
      summaryZh: typeof o.summary_zh === "string" && o.summary_zh.trim() ? o.summary_zh.trim().slice(0, 300) : "",
      people: strings(o.people, 5),
      countries: strings(o.countries, 8)
        .map((c) => c.toUpperCase())
        .filter(isCountryCode),
      topic,
      subtopic: typeof o.subtopic === "string" ? o.subtopic.trim().slice(0, 60) : "",
      subtopicEn: typeof o.subtopic_en === "string" ? o.subtopic_en.trim().slice(0, 60) : "",
      subtopicZh: typeof o.subtopic_zh === "string" ? o.subtopic_zh.trim().slice(0, 40) : "",
      tone: TONES.includes(tone) ? tone : "neutral",
      risk: RISKS.includes(risk) ? risk : "neutral",
    });
  }
  return out.sort((a, b) => a.i - b.i);
}
