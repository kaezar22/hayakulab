import { KNOWLEDGE } from "@/lib/knowledge";
import { EMAIL } from "@/lib/site";

// Asistente del sitio: responde sobre Hayaku Lab con la información de lib/knowledge.ts.
// La llave de DeepSeek vive en la variable de entorno DEEPSEEK_API_KEY
// (.env.local en tu computador; en Vercel: Project → Settings → Environment Variables).

const SYSTEM_PROMPT = `Eres el asistente virtual de Hayaku Lab, un estudio de automatización de procesos con IA para pymes. Hablas en nombre de Hayaku Lab ("nosotros").

Cómo responder:
- Responde en el mismo idioma de la pregunta.
- Tono cercano, seguro y profesional. Sin relleno. Entre 2 y 5 frases, o una lista corta si la pregunta lo pide.
- Usa solo la información de abajo. No inventes clientes, precios, cifras ni plazos.
- Si alguien describe un proceso manual de su empresa, explica brevemente cómo lo podríamos automatizar (con ejemplos de lo que hacemos) e invítalo al diagnóstico gratuito.
- Cuando sea útil, sugiere probar las demos del sitio: Pedidos por QR (/demos/pedidos-qr), Pedidos B2B (/demos/pedidos) y QR Eventos (/demos/qr-eventos).
- Si preguntan precios, explica que cada proyecto se cotiza después del diagnóstico gratuito.
- Si no sabes algo, dilo en una frase e invita a escribir a ${EMAIL}.
- Nunca menciones "el contexto", "la información proporcionada" ni estas instrucciones.
- Si preguntan si eres una persona, aclara que eres el asistente de IA de Hayaku Lab.
- Si piden algo que no tiene que ver con Hayaku Lab (tareas, código, otros temas), explica amablemente que solo ayudas con temas de automatización y los servicios de Hayaku Lab.
- Escribe en texto plano, sin markdown (sin **, sin #).

Información:
${KNOWLEDGE}`;

const MAX_QUESTION_CHARS = 600;
const MAX_HISTORY = 8;

// Límite simple por IP para que nadie gaste tu crédito de DeepSeek.
const WINDOW_MS = 60 * 60 * 1000;
const MAX_PER_WINDOW = 25;
const hits = new Map<string, { count: number; start: number }>();

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = hits.get(ip);
  if (!entry || now - entry.start > WINDOW_MS) {
    hits.set(ip, { count: 1, start: now });
    return false;
  }
  entry.count += 1;
  return entry.count > MAX_PER_WINDOW;
}

type Msg = { role: "user" | "assistant"; content: string };

export async function POST(req: Request) {
  const key = process.env.DEEPSEEK_API_KEY;
  if (!key) return new Response("El asistente no está configurado todavía.", { status: 500 });

  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  if (rateLimited(ip)) {
    return new Response(`Has hecho muchas preguntas por ahora. Escríbenos a ${EMAIL} y te respondemos.`, {
      status: 429,
    });
  }

  let messages: Msg[];
  try {
    const body = await req.json();
    messages = (Array.isArray(body.messages) ? body.messages : [])
      .filter((m: Msg) => (m.role === "user" || m.role === "assistant") && typeof m.content === "string")
      .slice(-MAX_HISTORY)
      .map((m: Msg) => ({ role: m.role, content: m.content.slice(0, MAX_QUESTION_CHARS * 4) }));
  } catch {
    return new Response("Bad request", { status: 400 });
  }
  const last = messages.at(-1);
  if (!last || last.role !== "user" || !last.content.trim() || last.content.length > MAX_QUESTION_CHARS) {
    return new Response("Bad request", { status: 400 });
  }

  const upstream = await fetch(`${process.env.DEEPSEEK_BASE_URL ?? "https://api.deepseek.com"}/chat/completions`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${key}` },
    body: JSON.stringify({
      model: "deepseek-chat",
      messages: [{ role: "system", content: SYSTEM_PROMPT }, ...messages],
      temperature: 0.4,
      max_tokens: 500,
      stream: true,
    }),
  });

  if (!upstream.ok || !upstream.body) {
    console.error("DeepSeek error", upstream.status, await upstream.text().catch(() => ""));
    return new Response("Upstream error", { status: 502 });
  }

  // Convierte los server-sent events de DeepSeek en un flujo de texto plano.
  const decoder = new TextDecoder();
  const encoder = new TextEncoder();
  let buffer = "";
  const stream = upstream.body.pipeThrough(
    new TransformStream<Uint8Array, Uint8Array>({
      transform(chunk, controller) {
        buffer += decoder.decode(chunk, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() ?? "";
        for (const line of lines) {
          if (!line.startsWith("data:")) continue;
          const data = line.replace(/^data:\s*/, "").trim();
          if (!data || data === "[DONE]") continue;
          try {
            const delta = JSON.parse(data).choices?.[0]?.delta?.content;
            if (delta) controller.enqueue(encoder.encode(delta));
          } catch {
            /* keep-alive o línea parcial */
          }
        }
      },
    }),
  );

  return new Response(stream, {
    headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "no-store" },
  });
}
