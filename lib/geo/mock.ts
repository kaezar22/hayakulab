// Datos ficticios para desarrollar sin conexión (GEO_MOCK=1).

import type { GeoItem, GeoNews } from "./news";
import { OUTLETS } from "./outlets";

const SAMPLE: Omit<GeoItem, "id" | "outlet" | "date" | "url">[] = [
  { title: "Ministers meet to discuss tariff truce", summary: "Delegaciones de dos potencias se reúnen para extender una tregua arancelaria que vence este mes.", summaryEn: "Delegations from two powers meet to extend a tariff truce that expires this month.", summaryZh: "两个大国的代表团会面，商讨延长本月到期的关税休战。", people: ["Ministra A"], countries: ["US", "CN"], topic: "comercio", subtopic: "Tregua arancelaria", subtopicEn: "Tariff truce", subtopicZh: "关税休战", tone: "neutral", risk: "disminuye" },
  { title: "Missile strikes hit energy grid", summary: "Un ataque con misiles dañó la red eléctrica de varias ciudades y dejó a miles sin luz.", summaryEn: "A missile attack damaged the power grid in several cities and left thousands without electricity.", summaryZh: "导弹袭击破坏了多座城市的电网，数千人断电。", people: [], countries: ["UA", "RU"], topic: "conflicto", subtopic: "Guerra en Ucrania", subtopicEn: "War in Ukraine", subtopicZh: "乌克兰战争", tone: "negativo", risk: "aumenta" },
  { title: "OPEC+ weighs output change", summary: "Los productores evalúan modificar sus cuotas de producción ante la caída del precio del crudo.", summaryEn: "Producers are weighing changes to output quotas as crude prices fall.", summaryZh: "随着原油价格下跌，产油国正在考虑调整产量配额。", people: [], countries: ["SA", "RU"], topic: "energia", subtopic: "Cuotas de petróleo", subtopicEn: "Oil quotas", subtopicZh: "石油配额", tone: "neutral", risk: "neutral" },
  { title: "New sanctions package announced", summary: "El bloque anunció un nuevo paquete de sanciones contra bancos y navieras.", summaryEn: "The bloc announced a new sanctions package targeting banks and shipping companies.", summaryZh: "该集团宣布针对银行和航运公司的新一轮制裁。", people: ["Comisaria B"], countries: ["EU", "IR"], topic: "sanciones", subtopic: "Sanciones financieras", subtopicEn: "Financial sanctions", subtopicZh: "金融制裁", tone: "negativo", risk: "aumenta" },
  { title: "Leaders sign border agreement", summary: "Dos gobiernos firmaron un acuerdo para reabrir pasos fronterizos y reforzar la cooperación.", summaryEn: "Two governments signed an agreement to reopen border crossings and step up cooperation.", summaryZh: "两国政府签署协议，重新开放边境口岸并加强合作。", people: ["Presidente C", "Presidenta D"], countries: ["CO", "VE"], topic: "diplomacia", subtopic: "Acuerdo fronterizo", subtopicEn: "Border agreement", subtopicZh: "边境协议", tone: "positivo", risk: "disminuye" },
  { title: "Central bank holds rates amid uncertainty", summary: "El banco central mantuvo su tasa y advirtió sobre el efecto de las tensiones comerciales.", summaryEn: "The central bank held its rate and warned about the impact of trade tensions.", summaryZh: "央行维持利率不变，并警告贸易紧张局势的影响。", people: [], countries: ["BR"], topic: "economia", subtopic: "Tasas de interés", subtopicEn: "Interest rates", subtopicZh: "利率", tone: "neutral", risk: "neutral" },
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
