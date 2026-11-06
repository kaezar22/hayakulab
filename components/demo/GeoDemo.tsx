"use client";

import { useEffect, useMemo, useState } from "react";
import { countryName, flag, TOPICS, type Risk, type Tone, type Topic } from "@/lib/geo/classify";
import type { GeoItem, GeoNews } from "@/lib/geo/news";
import { OUTLETS } from "@/lib/geo/outlets";

const N_COUNTRIES = new Set(OUTLETS.map((o) => o.country)).size;

type Data = Extract<GeoNews, { ok: true }>;

const TONE_LABEL: Record<Tone, string> = { positivo: "Positivo", neutral: "Neutral", negativo: "Negativo" };
const RISK_LABEL: Record<Risk, string> = { aumenta: "↑ Aumenta", neutral: "→ Neutral", disminuye: "↓ Disminuye" };

const timeFmt = new Intl.DateTimeFormat("es-CO", {
  day: "numeric",
  month: "short",
  hour: "numeric",
  minute: "2-digit",
  timeZone: "America/Bogota",
});

function csvCell(v: string) {
  return /[",\n;]/.test(v) ? `"${v.replace(/"/g, '""')}"` : v;
}

function downloadCsv(rows: GeoItem[]) {
  const header = ["fecha", "medio", "pais_medio", "tipo_medio", "titulo", "resumen", "personas", "paises", "tema", "subtema", "tono", "riesgo", "url"];
  const lines = rows.map((it) =>
    [
      it.date,
      it.outlet.name,
      countryName(it.outlet.country),
      it.outlet.ownership ?? "privado",
      it.title,
      it.summary,
      it.people.join(" | "),
      it.countries.map(countryName).join(" | "),
      TOPICS[it.topic],
      it.subtopic,
      it.tone,
      it.risk,
      it.url,
    ]
      .map(csvCell)
      .join(","),
  );
  // BOM para que Excel lea bien las tildes.
  const blob = new Blob(["﻿" + [header.join(","), ...lines].join("\n")], { type: "text/csv;charset=utf-8" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = `noticias-enriquecidas-${new Date().toISOString().slice(0, 10)}.csv`;
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
    const hay = `${it.title} ${it.summary} ${it.subtopic} ${it.outlet.name}`.toLowerCase();
    if (!hay.includes(q)) return false;
  }
  return true;
}

export default function GeoDemo() {
  const [state, setState] = useState<{ status: "loading" } | { status: "error"; message: string } | { status: "ok"; data: Data }>({ status: "loading" });

  useEffect(() => {
    let alive = true;
    fetch("/api/geo")
      .then(async (r) => {
        const j = await r.json().catch(() => null);
        if (!alive) return;
        if (r.ok && j?.ok) setState({ status: "ok", data: j });
        else setState({ status: "error", message: j?.error ?? "No se pudieron cargar las noticias. Intenta en unos minutos." });
      })
      .catch(() => alive && setState({ status: "error", message: "No se pudieron cargar las noticias. Revisa tu conexión." }));
    return () => {
      alive = false;
    };
  }, []);

  if (state.status === "loading") {
    return (
      <div className="geo geo-loading" aria-busy="true">
        <div className="geo-steps">
          <div className="on"><i /> Leyendo {OUTLETS.length} medios de {N_COUNTRIES} países</div>
          <div className="on d2"><i /> Descartando lo que no es geopolítica</div>
          <div className="on d3"><i /> Resumiendo y clasificando con IA</div>
        </div>
        <p>La primera carga de cada hora puede tardar hasta un minuto. Después queda guardada y abre al instante.</p>
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
        <b>No se pudieron cargar las noticias</b>
        <p>{state.message}</p>
        <button className="hk-btn hk-btn-primary hk-btn-sm" onClick={() => location.reload()}>Reintentar</button>
      </div>
    );
  }
  return <GeoTable data={state.data} />;
}

function GeoTable({ data }: { data: Data }) {
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
          <b>
            {data.items.length} noticias enriquecidas de {data.candidates} revisadas
          </b>
          <span>
            {ok.length} medios · últimas 48 horas · actualizado {timeFmt.format(new Date(data.generatedAt))} (hora de Colombia) · se renueva cada hora
          </span>
          {data.sample && <em>Datos de ejemplo (modo sin conexión)</em>}
        </div>
        <div className="geo-tones" aria-label="Tono de las noticias filtradas">
          <div className="t-neg"><b>{toneN("negativo")}</b><span>Negativas</span></div>
          <div className="t-neu"><b>{toneN("neutral")}</b><span>Neutrales</span></div>
          <div className="t-pos"><b>{toneN("positivo")}</b><span>Positivas</span></div>
        </div>
      </div>

      <div className="geo-topics" aria-label="Temas">
        {topics.map(([t, n]) => (
          <button key={t} type="button" aria-pressed={f.topic === t} className={f.topic === t ? "on" : ""} onClick={() => set("topic")(f.topic === t ? "" : t)}>
            {TOPICS[t as Topic]} <i>{n}</i>
          </button>
        ))}
      </div>

      <div className="geo-filters">
        <label className="dm-field">
          <span>Buscar</span>
          <input value={f.text} onChange={(e) => set("text")(e.target.value)} placeholder="Palabra, medio…" />
        </label>
        <Select label="Protagonista" value={f.person} onChange={set("person")}>
          {people.map(([p, n]) => (
            <option key={p} value={p}>{p} ({n})</option>
          ))}
        </Select>
        <Select label="País involucrado" value={f.country} onChange={set("country")}>
          {countries.map(([c, n]) => (
            <option key={c} value={c}>{flag(c)} {countryName(c)} ({n})</option>
          ))}
        </Select>
        <Select label="País del medio" value={f.outletCountry} onChange={set("outletCountry")}>
          {outletCountries.map(([c, n]) => (
            <option key={c} value={c}>{flag(c)} {countryName(c)} ({n})</option>
          ))}
        </Select>
        <Select label="Sentimiento" value={f.tone} onChange={set("tone")}>
          {Object.entries(TONE_LABEL).map(([k, v]) => (
            <option key={k} value={k}>{v}</option>
          ))}
        </Select>
        <Select label="Riesgo de mercado" value={f.risk} onChange={set("risk")}>
          {Object.entries(RISK_LABEL).map(([k, v]) => (
            <option key={k} value={k}>{v}</option>
          ))}
        </Select>
      </div>

      <div className="geo-bar">
        <span>
          {rows.length} de {data.items.length} noticias
        </span>
        <span className="geo-actions">
          {active && (
            <button type="button" className="hk-btn hk-btn-sm hk-btn-ghost" onClick={() => setF(EMPTY)}>Quitar filtros</button>
          )}
          <button type="button" className="hk-btn hk-btn-sm hk-btn-primary" onClick={() => downloadCsv(rows)} disabled={!rows.length}>
            ↓ Descargar CSV
          </button>
          <a className="hk-btn hk-btn-sm" href="/api/geo" target="_blank" rel="noopener noreferrer">JSON</a>
        </span>
      </div>

      <div className="geo-table-wrap">
        <table className="geo-table">
          <thead>
            <tr>
              <th>Medio</th>
              <th>Noticia y resumen</th>
              <th>Protagonistas</th>
              <th>Países</th>
              <th>Tema</th>
              <th>Sentimiento</th>
              <th>Riesgo</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((it) => (
              <tr key={it.id}>
                <td className="c-outlet" data-label="Medio">
                  <b>{it.outlet.name}</b>
                  <span>{flag(it.outlet.country)} {countryName(it.outlet.country)}</span>
                  {it.outlet.ownership && (
                    <em title={it.outlet.ownership === "estatal" ? "Medio controlado o financiado por un Estado" : "Medio público con independencia editorial"}>
                      {it.outlet.ownership === "estatal" ? "Estatal" : "Público"}
                    </em>
                  )}
                  <small>{timeFmt.format(new Date(it.date))}</small>
                </td>
                <td className="c-news" data-label="Noticia">
                  <a href={it.url} target="_blank" rel="noopener noreferrer">{it.title}</a>
                  <p>{it.summary}</p>
                </td>
                <td data-label="Protagonistas">
                  {it.people.length ? <ul>{it.people.map((p) => <li key={p}>{p}</li>)}</ul> : <span className="muted">—</span>}
                </td>
                <td data-label="Países">
                  <ul>{it.countries.map((c) => <li key={c}>{flag(c)} {countryName(c)}</li>)}</ul>
                </td>
                <td data-label="Tema">
                  <div>{TOPICS[it.topic]}</div>
                  {it.subtopic && <small className="muted">{it.subtopic}</small>}
                </td>
                <td data-label="Sentimiento"><span className={`geo-pill tone-${it.tone}`}>{TONE_LABEL[it.tone]}</span></td>
                <td data-label="Riesgo"><span className={`geo-risk risk-${it.risk}`}>{RISK_LABEL[it.risk]}</span></td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr>
                <td colSpan={7} className="geo-none">Ninguna noticia coincide con los filtros.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="geo-foot">
        <p>
          <b>Sentimiento</b> es el tono de la noticia (un acuerdo es positivo, un ataque es negativo). <b>Riesgo</b> es si probablemente aumenta o reduce la incertidumbre que perciben los mercados. La clasificación es automática y puede equivocarse: abre la noticia original antes de sacar conclusiones. El país de cada medio está fijado a mano.
        </p>
        <p>
          Medios consultados: {data.outlets.map((o) => `${o.name} (${o.used})`).join(", ")}.
          {failed.length > 0 && <> Sin respuesta esta vez: {failed.map((o) => o.name).join(", ")}.</>}
        </p>
      </div>
    </div>
  );
}

function Select({ label, value, onChange, children }: { label: string; value: string; onChange: (v: string) => void; children: React.ReactNode }) {
  return (
    <label className="dm-field">
      <span>{label}</span>
      <select value={value} onChange={(e) => onChange(e.target.value)}>
        <option value="">Todos</option>
        {children}
      </select>
    </label>
  );
}
