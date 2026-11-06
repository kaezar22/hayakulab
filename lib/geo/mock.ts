// Datos ficticios para desarrollar sin conexión (GEO_MOCK=1).

import type { GeoItem, GeoNews } from "./news";
import { OUTLETS } from "./outlets";

const SAMPLE: Omit<GeoItem, "id" | "outlet" | "date" | "url">[] = [
  { title: "Ministers meet to discuss tariff truce", summary: "Delegaciones de dos potencias se reúnen para extender una tregua arancelaria que vence este mes.", summaryEn: "Delegations from two powers meet to extend a tariff truce that expires this month.", people: ["Ministra A"], countries: ["US", "CN"], topic: "comercio", subtopic: "Tregua arancelaria", subtopicEn: "Tariff truce", tone: "neutral", risk: "disminuye" },
  { title: "Missile strikes hit energy grid", summary: "Un ataque con misiles dañó la red eléctrica de varias ciudades y dejó a miles sin luz.", summaryEn: "A missile attack damaged the power grid in several cities and left thousands without electricity.", people: [], countries: ["UA", "RU"], topic: "conflicto", subtopic: "Guerra en Ucrania", subtopicEn: "War in Ukraine", tone: "negativo", risk: "aumenta" },
  { title: "OPEC+ weighs output change", summary: "Los productores evalúan modificar sus cuotas de producción ante la caída del precio del crudo.", summaryEn: "Producers are weighing changes to output quotas as crude prices fall.", people: [], countries: ["SA", "RU"], topic: "energia", subtopic: "Cuotas de petróleo", subtopicEn: "Oil quotas", tone: "neutral", risk: "neutral" },
  { title: "New sanctions package announced", summary: "El bloque anunció un nuevo paquete de sanciones contra bancos y navieras.", summaryEn: "The bloc announced a new sanctions package targeting banks and shipping companies.", people: ["Comisaria B"], countries: ["EU", "IR"], topic: "sanciones", subtopic: "Sanciones financieras", subtopicEn: "Financial sanctions", tone: "negativo", risk: "aumenta" },
  { title: "Leaders sign border agreement", summary: "Dos gobiernos firmaron un acuerdo para reabrir pasos fronterizos y reforzar la cooperación.", summaryEn: "Two governments signed an agreement to reopen border crossings and step up cooperation.", people: ["Presidente C", "Presidenta D"], countries: ["CO", "VE"], topic: "diplomacia", subtopic: "Acuerdo fronterizo", subtopicEn: "Border agreement", tone: "positivo", risk: "disminuye" },
  { title: "Central bank holds rates amid uncertainty", summary: "El banco central mantuvo su tasa y advirtió sobre el efecto de las tensiones comerciales.", summaryEn: "The central bank held its rate and warned about the impact of trade tensions.", people: [], countries: ["BR"], topic: "economia", subtopic: "Tasas de interés", subtopicEn: "Interest rates", tone: "neutral", risk: "neutral" },
];

export function mockGeoNews(): GeoNews {
  const now = Date.now();
  const items: GeoItem[] = SAMPLE.map((s, k) => {
    const o = OUTLETS[(k * 3) % OUTLETS.length];
    return {
      ...s,
      id: `mock-${k}`,
      url: "https://example.com/",
      date: new Date(now - k * 2.5 * 3600_000).toISOString(),
      outlet: { id: o.id, name: o.name, country: o.country, ownership: o.ownership },
    };
  });
  return {
    ok: true,
    sample: true,
    generatedAt: new Date(now).toISOString(),
    items,
    candidates: 12,
    outlets: OUTLETS.map((o) => ({
      id: o.id,
      name: o.name,
      country: o.country,
      fetched: 20,
      used: items.filter((i) => i.outlet.id === o.id).length,
    })),
  };
}
