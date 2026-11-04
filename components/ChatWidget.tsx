"use client";

import { useEffect, useRef, useState } from "react";
import { EMAIL } from "@/lib/site";

type Msg = { role: "user" | "assistant"; content: string };

const SUGGESTIONS = [
  "¿Qué procesos pueden automatizar?",
  "¿Cómo funciona el diagnóstico gratis?",
  "Tengo un bar, ¿cómo funcionan los pedidos por QR?",
  "Copiamos pedidos de WhatsApp a Excel a mano",
];

const ERROR = `No pude responder en este momento. Escríbenos a ${EMAIL}.`;

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [nudge, setNudge] = useState(false);
  const logRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const t = setTimeout(() => setNudge(true), 9000);
    const openChat = () => setOpen(true);
    window.addEventListener("hk-open-chat", openChat);
    return () => {
      clearTimeout(t);
      window.removeEventListener("hk-open-chat", openChat);
    };
  }, []);

  useEffect(() => {
    if (open) {
      setNudge(false);
      setTimeout(() => inputRef.current?.focus(), 80);
    }
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const scroll = () =>
    requestAnimationFrame(() => {
      const el = logRef.current;
      if (el) el.scrollTop = el.scrollHeight;
    });

  async function ask(question: string) {
    const q = question.trim();
    if (!q || busy) return;
    const history: Msg[] = [...messages, { role: "user", content: q }];
    setMessages([...history, { role: "assistant", content: "" }]);
    setInput("");
    setBusy(true);
    scroll();
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: history }),
      });
      if (!res.ok || !res.body) throw new Error(res.status === 429 ? await res.text() : ERROR);
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let answer = "";
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        answer += decoder.decode(value, { stream: true });
        setMessages([...history, { role: "assistant", content: answer }]);
        scroll();
      }
      if (!answer) throw new Error(ERROR);
    } catch (err) {
      const msg = err instanceof Error && err.message ? err.message : ERROR;
      setMessages([...history, { role: "assistant", content: msg }]);
    } finally {
      setBusy(false);
      scroll();
    }
  }

  return (
    <div className={`hk-chat ${open ? "open" : ""}`}>
      {open && (
        <div className="hk-chat-panel" role="dialog" aria-label="Asistente de Hayaku Lab">
          <div className="hk-chat-head">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo-mark.png" alt="" width={40} height={23} />
            <div>
              <b>Asistente Hayaku</b>
              <span>
                <i /> En línea · responde con IA
              </span>
            </div>
            <button className="hk-chat-x" onClick={() => setOpen(false)} aria-label="Cerrar chat">
              ×
            </button>
          </div>

          <div className="hk-chat-log" ref={logRef} aria-live="polite">
            <div className="hk-msg hk-msg-assistant">
              ¡Hola! 👋 Soy el asistente de Hayaku Lab. Cuéntame qué proceso de tu empresa te quita más tiempo, o pregúntame por nuestros servicios y demos.
            </div>
            {messages.map((m, i) => (
              <div key={i} className={`hk-msg hk-msg-${m.role}`}>
                {m.content || (
                  <span className="hk-typing" aria-label="Escribiendo">
                    <i />
                    <i />
                    <i />
                  </span>
                )}
              </div>
            ))}
            {messages.length === 0 && (
              <div className="hk-chips">
                {SUGGESTIONS.map((s) => (
                  <button key={s} type="button" onClick={() => ask(s)}>
                    {s}
                  </button>
                ))}
              </div>
            )}
          </div>

          <form
            className="hk-chat-form"
            onSubmit={(e) => {
              e.preventDefault();
              ask(input);
            }}
          >
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Escribe tu pregunta…"
              maxLength={600}
              aria-label="Escribe tu pregunta"
            />
            <button type="submit" disabled={busy || !input.trim()} aria-label="Enviar">
              <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
                <path d="M3 11.5 20.5 3 13 21l-2.2-7.3L3 11.5Z" fill="currentColor" />
              </svg>
            </button>
          </form>
        </div>
      )}

      {nudge && !open && (
        <button className="hk-chat-nudge" onClick={() => setOpen(true)}>
          ¿Qué proceso te gustaría automatizar? 💬
        </button>
      )}
      <button className="hk-chat-fab" onClick={() => setOpen((o) => !o)} aria-label={open ? "Cerrar chat" : "Abrir chat"} aria-expanded={open}>
        {open ? (
          <svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true">
            <path d="M6 6l12 12M18 6 6 18" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" width="26" height="26" aria-hidden="true">
            <path
              d="M4 5.5A2.5 2.5 0 0 1 6.5 3h11A2.5 2.5 0 0 1 20 5.5v8a2.5 2.5 0 0 1-2.5 2.5H10l-4.2 3.6c-.5.4-1.3.1-1.3-.6V16A2.5 2.5 0 0 1 4 13.5v-8Z"
              fill="currentColor"
            />
            <circle cx="8.5" cy="9.5" r="1.2" fill="#150E48" />
            <circle cx="12" cy="9.5" r="1.2" fill="#150E48" />
            <circle cx="15.5" cy="9.5" r="1.2" fill="#150E48" />
          </svg>
        )}
      </button>
    </div>
  );
}
