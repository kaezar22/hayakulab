"use client";

import { useEffect, useMemo, useState } from "react";
import { countryName, flag, topicLabel, type Risk, type Tone, type Topic } from "@/lib/geo/classify";
import type { Lang } from "@/lib/i18n";
import type { GeoItem, GeoNews } from "@/lib/geo/news";
import { OUTLETS } from "@/lib/geo/outlets";

const N_COUNTRIES = new Set(OUTLETS.map((o) => o.country)).size;

type Data = Extract<GeoNews, { ok: true }>;

const TX = {
  es: {
    tone: { positivo: "Positivo", neutral: "Neutral", negativo: "Negativo" } as Record<Tone, string>,
    risk: { aumenta: "↑ Aumenta", neutral: "→ Neutral", disminuye: "↓ Disminuye" } as Record<Risk, string>,
    loading: (n: number, c: number) => [`Leyendo ${n} medios de ${c} países`, "Descartando lo que no es geopolítica", "Resumiendo y clasificando con IA"],
    loadingNote: "La primera carga de cada hora puede tardar hasta un minuto. Después queda guardada y abre al instante.",
    errTitle: "No se pudieron cargar las noticias", errGeneric: "No se pudieron cargar las noticias. Intenta en unos minutos.", errNet: "No se pudieron cargar las noticias. Revisa tu conexión.", retry: "Reintentar",
    headCount: (n: number, c: number) => `${n} noticias enriquecidas de ${c} revisadas`,
    headSub: (o: number, time: string) => `${o} medios · últimas 48 horas · actualizado ${time} (hora de Colombia) · se renueva cada hora`,
    sample: "Datos de ejemplo (modo sin conexión)",
    toneAria: "Tono de las noticias filtradas", neg: "Negativas", neu: "Neutrales", pos: "Positivas",
    topicsAria: "Temas", search: "Buscar", searchPh: "Palabra, medio…", person: "Protagonista", country: "País involucrado", outletCountry: "País del medio", sentiment: "Sentimiento", riskLabel: "Riesgo de mercado", all: "Todos",
    count: (r: number, n: number) => `${r} de ${n} noticias`, clear: "Quitar filtros", csv: "↓ Descargar CSV",
    cols: ["Medio", "Noticia y resumen", "Protagonistas", "Países", "Tema", "Sentimiento", "Riesgo"], newsCol: "Noticia",
    state: "Estatal", pub: "Público", stateTitle: "Medio controlado o financiado por un Estado", pubTitle: "Medio público con independencia editorial",
    none: "Ninguna noticia coincide con los filtros.",
    help1: ["Sentimiento", " es el tono de la noticia (un acuerdo es positivo, un ataque es negativo). ", "Riesgo", " es si probablemente aumenta o reduce la incertidumbre que perciben los mercados. La clasificación es automática y puede equivocarse: abre la noticia original antes de sacar conclusiones. El país de cada medio está fijado a mano."],
    outletsUsed: "Medios consultados:", noResponse: "Sin respuesta esta vez:",
    csvHeader: ["fecha", "medio", "pais_medio", "tipo_medio", "titulo", "resumen", "personas", "paises", "tema", "subtema", "tono", "riesgo", "url"],
    csvName: "noticias-enriquecidas", own: { estatal: "estatal", publico: "publico", privado: "privado" } as Record<string, string>,
    locale: "es-CO",
  },
  en: {
    tone: { positivo: "Positive", neutral: "Neutral", negativo: "Negative" } as Record<Tone, string>,
    risk: { aumenta: "↑ Increases", neutral: "→ Neutral", disminuye: "↓ Decreases" } as Record<Risk, string>,
    loading: (n: number, c: number) => [`Reading ${n} outlets from ${c} countries`, "Discarding anything that isn't geopolitics", "Summarizing and classifying with AI"],
    loadingNote: "The first load each hour can take up to a minute. After that it's cached and opens instantly.",
    errTitle: "Couldn't load the news", errGeneric: "Couldn't load the news. Try again in a few minutes.", errNet: "Couldn't load the news. Check your connection.", retry: "Retry",
    headCount: (n: number, c: number) => `${n} enriched stories out of ${c} reviewed`,
    headSub: (o: number, time: string) => `${o} outlets · last 48 hours · updated ${time} (Colombia time, UTC−5) · refreshes hourly`,
    sample: "Sample data (offline mode)",
    toneAria: "Tone of the filtered stories", neg: "Negative", neu: "Neutral", pos: "Positive",
    topicsAria: "Topics", search: "Search", searchPh: "Word, outlet…", person: "Key person", country: "Country involved", outletCountry: "Outlet country", sentiment: "Sentiment", riskLabel: "Market risk", all: "All",
    count: (r: number, n: number) => `${r} of ${n} stories`, clear: "Clear filters", csv: "↓ Download CSV",
    cols: ["Outlet", "Story and summary", "Key people", "Countries", "Topic", "Sentiment", "Risk"], newsCol: "Story",
    state: "State", pub: "Public", stateTitle: "Outlet controlled or funded by a government", pubTitle: "Public broadcaster with editorial independence",
    none: "No stories match the filters.",
    help1: ["Sentiment", " is the tone of the story (an agreement is positive, an attack is negative). ", "Risk", " is whether it likely increases or reduces the uncertainty markets perceive. Classification is automatic and can be wrong: open the original story before drawing conclusions. Each outlet's country is set by hand."],
    outletsUsed: "Outlets checked:", noResponse: "No response this time:",
    csvHeader: ["date", "outlet", "outlet_country", "outlet_type", "headline", "summary", "people", "countries", "topic", "subtopic", "tone", "risk", "url"],
    csvName: "enriched-news", own: { estatal: "state", publico: "public", privado: "private" } as Record<string, string>,
    locale: "en-US",
  },
};
type T = (typeof TX)["es"];

const fmt = (lang: Lang) =>
  new Intl.DateTimeFormat(TX[lang].locale, { day: "numeric", month: "short", hour: "numeric", minute: "2-digit", timeZone: "America/Bogota" });

function csvCell(v: string) {
  return /[",\n;]/.test(v) ? `"${v.replace(/"/g, '""')}"` : v;
}

function downloadCsv(rows: GeoItem[], lang: Lang) {
  const t = TX[lang];
  const header = t.csvHeader;
  const lines = rows.map((it) =>
    [
      it.date,
      it.outlet.name,
      countryName(it.outlet.country, lang),
      t.own[it.outlet.ownership ?? "privado"],
      it.title,
      lang === "en" ? it.summaryEn : it.summary,
      it.people.join(" | "),
      it.countries.map((c) => countryName(c, lang)).join(" | "),
      topicLabel(it.topic, lang),
      lang === "en" ? it.subtopicEn || it.subtopic : it.subtopic,
      t.tone[it.tone].toLowerCase(),
      t.risk[it.risk].replace(/^[^ ]+ /, "").toLowerCase(),
      it.url,
    ]
      .map(csvCell)
      .join(","),
  );
  // BOM para que Excel lea bien las tildes.
  const blob = new Blob(["﻿" + [header.join(","), ...lines].join("\n")], { type: "text/csv;charset=utf-8" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = `${t.csvName}-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(a.href);
}

function countBy<T>(list: T[], key: (x: T) => string[]): [string, number][] {
  const m = new Map<string, number>();
  for (const x of list) for (const k of key(x)) m.set(k, (m.get(k) ?? 0) + 1);
  return [...m.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));
}

type Filters = { topic: string; country: string; person: string; outletCountry: string; tone: string; risk: string; text: string };
const EMPTY: Filters = { topic: "", country: "", person: "", outletCountry: "", tone: "", risk: "", text: "" };

function matches(it: GeoItem, f: Filters) {
  if (f.topic && it.topic !== f.topic) return false;
  if (f.country && !it.countries.includes(f.country)) return false;
  if (f.person && !it.people.includes(f.person)) return false;
  if (f.outletCountry && it.outlet.country !== f.outletCountry) return false;
  if (f.tone && it.tone !== f.tone) return false;
  if (f.risk && it.risk !== f.risk) return false;
  if (f.text) {
    const q = f.text.toLowerCase();
    const hay = `${it.title} ${it.summary} ${it.summaryEn} ${it.subtopic} ${it.subtopicEn} ${it.outlet.name}`.toLowerCase();
    if (!hay.includes(q)) return false;
  }
  return true;
}

export default function GeoDemo({ lang = "es" }: { lang?: Lang }) {
  const t = TX[lang];
  const [state, setState] = useState<{ status: "loading" } | { status: "error"; message: string } | { status: "ok"; data: Data }>({ status: "loading" });

  useEffect(() => {
    let alive = true;
    fetch("/api/geo")
      .then(async (r) => {
        const j = await r.json().catch(() => null);
        if (!alive) return;
        if (r.ok && j?.ok) setState({ status: "ok", data: j });
        else setState({ status: "error", message: lang === "en" ? t.errGeneric : (j?.error ?? t.errGeneric) });
      })
      .catch(() => alive && setState({ status: "error", message: t.errNet }));
    return () => {
      alive = false;
    };
  }, [lang, t]);

  if (state.status === "loading") {
    return (
      <div className="geo geo-loading" aria-busy="true">
        <div className="geo-steps">
          {t.loading(OUTLETS.length, N_COUNTRIES).map((x, k) => (
            <div key={x} className={`on${k ? ` d${k + 1}` : ""}`}><i /> {x}</div>
          ))}
        </div>
        <p>{t.loadingNote}</p>
        <div className="geo-skel">
          {Array.from({ length: 6 }, (_, k) => (
            <span key={k} />
          ))}
        </div>
      </div>
    );
  }
  if (state.status === "error") {
    return (
      <div className="geo geo-error" role="alert">
        <b>{t.errTitle}</b>
        <p>{state.message}</p>
        <button className="hk-btn hk-btn-primary hk-btn-sm" onClick={() => location.reload()}>{t.retry}</button>
      </div>
    );
  }
  return <GeoTable data={state.data} lang={lang} t={t} />;
}

function GeoTable({ data, lang, t }: { data: Data; lang: Lang; t: T }) {
  const timeFmt = fmt(lang);
  const [f, setF] = useState<Filters>(EMPTY);
  const set = (k: keyof Filters) => (v: string) => setF((p) => ({ ...p, [k]: v }));

  const topics = useMemo(() => countBy(data.items, (i) => [i.topic]), [data.items]);
  const countries = useMemo(() => countBy(data.items, (i) => i.countries), [data.items]);
  const people = useMemo(() => countBy(data.items, (i) => i.people), [data.items]);
  const outletCountries = useMemo(() => countBy(data.items, (i) => [i.outlet.country]), [data.items]);
  const rows = data.items.filter((it) => matches(it, f));
  const active = Object.values(f).some(Boolean);
  const tones = useMemo(() => countBy(rows, (i) => [i.tone]), [rows]);
  const toneN = (t: Tone) => tones.find(([k]) => k === t)?.[1] ?? 0;

  const ok = data.outlets.filter((o) => !o.error);
  const failed = data.outlets.filter((o) => o.error);

  return (
    <div className="geo">
      <div className="geo-head">
        <div>
          <b>{t.headCount(data.items.length, data.candidates)}</b>
          <span>{t.headSub(ok.length, timeFmt.format(new Date(data.generatedAt)))}</span>
          {data.sample && <em>{t.sample}</em>}
        </div>
        <div className="geo-tones" aria-label={t.toneAria}>
          <div className="t-neg"><b>{toneN("negativo")}</b><span>{t.neg}</span></div>
          <div className="t-neu"><b>{toneN("neutral")}</b><span>{t.neu}</span></div>
          <div className="t-pos"><b>{toneN("positivo")}</b><span>{t.pos}</span></div>
        </div>
      </div>

      <div className="geo-topics" aria-label={t.topicsAria}>
        {topics.map(([tp, n]) => (
          <button key={tp} type="button" aria-pressed={f.topic === tp} className={f.topic === tp ? "on" : ""} onClick={() => set("topic")(f.topic === tp ? "" : tp)}>
            {topicLabel(tp as Topic, lang)} <i>{n}</i>
          </button>
        ))}
      </div>

      <div className="geo-filters">
        <label className="dm-field">
          <span>{t.search}</span>
          <input value={f.text} onChange={(e) => set("text")(e.target.value)} placeholder={t.searchPh} />
        </label>
        <Select all={t.all} label={t.person} value={f.person} onChange={set("person")}>
          {people.map(([p, n]) => (
            <option key={p} value={p}>{p} ({n})</option>
          ))}
        </Select>
        <Select all={t.all} label={t.country} value={f.country} onChange={set("country")}>
          {countries.map(([c, n]) => (
            <option key={c} value={c}>{flag(c)} {countryName(c, lang)} ({n})</option>
          ))}
        </Select>
        <Select all={t.all} label={t.outletCountry} value={f.outletCountry} onChange={set("outletCountry")}>
          {outletCountries.map(([c, n]) => (
            <option key={c} value={c}>{flag(c)} {countryName(c, lang)} ({n})</option>
          ))}
        </Select>
        <Select all={t.all} label={t.sentiment} value={f.tone} onChange={set("tone")}>
          {Object.entries(t.tone).map(([k, v]) => (
            <option key={k} value={k}>{v}</option>
          ))}
        </Select>
        <Select all={t.all} label={t.riskLabel} value={f.risk} onChange={set("risk")}>
          {Object.entries(t.risk).map(([k, v]) => (
            <option key={k} value={k}>{v}</option>
          ))}
        </Select>
      </div>

      <div className="geo-bar">
        <span>{t.count(rows.length, data.items.length)}</span>
        <span className="geo-actions">
          {active && (
            <button type="button" className="hk-btn hk-btn-sm hk-btn-ghost" onClick={() => setF(EMPTY)}>{t.clear}</button>
          )}
          <button type="button" className="hk-btn hk-btn-sm hk-btn-primary" onClick={() => downloadCsv(rows, lang)} disabled={!rows.length}>
            {t.csv}
          </button>
          <a className="hk-btn hk-btn-sm" href="/api/geo" target="_blank" rel="noopener noreferrer">JSON</a>
        </span>
      </div>

      <div className="geo-table-wrap">
        <table className="geo-table">
          <thead>
            <tr>
              {t.cols.map((c) => (
                <th key={c}>{c}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((it) => (
              <tr key={it.id}>
                <td className="c-outlet" data-label={t.cols[0]}>
                  <b>{it.outlet.name}</b>
                  <span>{flag(it.outlet.country)} {countryName(it.outlet.country, lang)}</span>
                  {it.outlet.ownership && (
                    <em title={it.outlet.ownership === "estatal" ? t.stateTitle : t.pubTitle}>
                      {it.outlet.ownership === "estatal" ? t.state : t.pub}
                    </em>
                  )}
                  <small>{timeFmt.format(new Date(it.date))}</small>
                </td>
                <td className="c-news" data-label={t.newsCol}>
                  <a href={it.url} target="_blank" rel="noopener noreferrer">{it.title}</a>
                  <p>{lang === "en" ? it.summaryEn : it.summary}</p>
                </td>
                <td data-label={t.cols[2]}>
                  {it.people.length ? <ul>{it.people.map((p) => <li key={p}>{p}</li>)}</ul> : <span className="muted">—</span>}
                </td>
                <td data-label={t.cols[3]}>
                  <ul>{it.countries.map((c) => <li key={c}>{flag(c)} {countryName(c, lang)}</li>)}</ul>
                </td>
                <td data-label={t.cols[4]}>
                  <div>{topicLabel(it.topic, lang)}</div>
                  {(lang === "en" ? it.subtopicEn || it.subtopic : it.subtopic) && <small className="muted">{lang === "en" ? it.subtopicEn || it.subtopic : it.subtopic}</small>}
                </td>
                <td data-label={t.cols[5]}><span className={`geo-pill tone-${it.tone}`}>{t.tone[it.tone]}</span></td>
                <td data-label={t.cols[6]}><span className={`geo-risk risk-${it.risk}`}>{t.risk[it.risk]}</span></td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr>
                <td colSpan={7} className="geo-none">{t.none}</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="geo-foot">
        <p>
          <b>{t.help1[0]}</b>{t.help1[1]}<b>{t.help1[2]}</b>{t.help1[3]}
        </p>
        <p>
          {t.outletsUsed} {data.outlets.map((o) => `${o.name} (${o.used})`).join(", ")}.
          {failed.length > 0 && <> {t.noResponse} {failed.map((o) => o.name).join(", ")}.</>}
        </p>
      </div>
    </div>
  );
}

function Select({ label, value, onChange, children, all }: { label: string; value: string; onChange: (v: string) => void; children: React.ReactNode; all: string }) {
  return (
    <label className="dm-field">
      <span>{label}</span>
      <select value={value} onChange={(e) => onChange(e.target.value)}>
        <option value="">{all}</option>
        {children}
      </select>
    </label>
  );
}
