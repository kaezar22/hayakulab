import { getGeoNews } from "@/lib/geo/news";

// GET /api/geo — noticias de geopolítica enriquecidas (la tabla de /demos/enriquecimiento).
// Vercel guarda la respuesta una hora en su caché, así que DeepSeek se usa como mucho
// una vez por hora sin importar cuántas personas abran la demo.

export const dynamic = "force-dynamic";
export const maxDuration = 90;

export async function GET() {
  const result = await getGeoNews();
  if (!result.ok) {
    return Response.json({ error: result.message }, { status: 502, headers: { "Cache-Control": "no-store" } });
  }
  return Response.json(result, {
    headers: { "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=600" },
  });
}
