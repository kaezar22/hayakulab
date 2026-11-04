"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import QRCode from "qrcode";

// Simulación completa en el navegador: el celular del cliente y el tablero del bar
// comparten el mismo estado. En el sistema real esto viaja por Supabase Realtime.

type Item = { id: string; name: string; desc: string; price: number; cat: string };
type Status = "nuevo" | "preparando" | "listo" | "entregado";
type Order = {
  id: string;
  table: string;
  name: string;
  lines: { id: string; qty: number }[];
  status: Status;
  at: number;
  mine?: boolean;
  paid?: boolean;
};

const MENU: Item[] = [
  { id: "c1", cat: "Cervezas", name: "Cerveza artesanal rubia", desc: "Pinta 473 ml", price: 16000 },
  { id: "c2", cat: "Cervezas", name: "Cerveza roja", desc: "Pinta 473 ml", price: 17000 },
  { id: "c3", cat: "Cervezas", name: "Michelada", desc: "Limón, sal y la cerveza que elijas", price: 19000 },
  { id: "k1", cat: "Cócteles", name: "Mojito", desc: "Ron blanco, hierbabuena, limón", price: 28000 },
  { id: "k2", cat: "Cócteles", name: "Gin tonic de maracuyá", desc: "Ginebra, tónica, maracuyá", price: 32000 },
  { id: "k3", cat: "Cócteles", name: "Margarita", desc: "Tequila, triple sec, limón", price: 30000 },
  { id: "p1", cat: "Para picar", name: "Nachos de la casa", desc: "Guacamole, pico de gallo, queso", price: 26000 },
  { id: "p2", cat: "Para picar", name: "Alitas BBQ", desc: "10 unidades con papas", price: 34000 },
  { id: "p3", cat: "Para picar", name: "Empanadas", desc: "5 unidades con ají", price: 18000 },
  { id: "s1", cat: "Sin alcohol", name: "Limonada de coco", desc: "Vaso 400 ml", price: 12000 },
  { id: "s2", cat: "Sin alcohol", name: "Soda de frutos rojos", desc: "Vaso 400 ml", price: 11000 },
];
const byId = Object.fromEntries(MENU.map((m) => [m.id, m]));
const CATS = Array.from(new Set(MENU.map((m) => m.cat)));
const MY_TABLE = "7";

const cop = (n: number) => "$" + n.toLocaleString("es-CO");
const total = (o: { lines: { id: string; qty: number }[] }) =>
  o.lines.reduce((s, l) => s + byId[l.id].price * l.qty, 0);

const SEED = (): Order[] => {
  const now = Date.now();
  return [
    { id: "A-101", table: "3", name: "Laura", lines: [{ id: "c1", qty: 2 }, { id: "p1", qty: 1 }], status: "preparando", at: now - 6 * 60_000 },
    { id: "A-102", table: "Barra", name: "Andrés", lines: [{ id: "k2", qty: 1 }], status: "nuevo", at: now - 2 * 60_000 },
  ];
};

const BOTS = [
  { table: "12", name: "Camila", lines: [{ id: "k1", qty: 2 }, { id: "p3", qty: 1 }] },
  { table: "5", name: "Julián", lines: [{ id: "c3", qty: 3 }] },
  { table: "Terraza 2", name: "Sofía", lines: [{ id: "s1", qty: 1 }, { id: "p2", qty: 1 }] },
];

function beep() {
  try {
    const Ctx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    const ctx = new Ctx();
    [0, 0.18, 0.36].forEach((t, i) => {
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.frequency.value = [880, 1175, 1568][i];
      g.gain.setValueAtTime(0.0001, ctx.currentTime + t);
      g.gain.exponentialRampToValueAtTime(0.25, ctx.currentTime + t + 0.02);
      g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + t + 0.16);
      o.connect(g).connect(ctx.destination);
      o.start(ctx.currentTime + t);
      o.stop(ctx.currentTime + t + 0.18);
    });
    setTimeout(() => ctx.close(), 1000);
  } catch {
    /* sin audio, sigue funcionando */
  }
  try {
    navigator.vibrate?.([200, 100, 200]);
  } catch {
    /* no aplica */
  }
}

function ago(at: number, now: number) {
  const m = Math.max(0, Math.round((now - at) / 60_000));
  return m === 0 ? "ahora" : `hace ${m} min`;
}

export default function QrDemo() {
  const [orders, setOrders] = useState<Order[]>(SEED);
  const [cart, setCart] = useState<Record<string, number>>({});
  const [screen, setScreen] = useState<"menu" | "cart" | "status">("menu");
  const [name, setName] = useState("");
  const [err, setErr] = useState("");
  const [myId, setMyId] = useState<string | null>(null);
  const [help, setHelp] = useState<string[]>([]);
  const [view, setView] = useState<"cliente" | "bar">("cliente");
  const [now, setNow] = useState(() => Date.now());
  const [qr, setQr] = useState("");
  const [cat, setCat] = useState(CATS[0]);
  const botIdx = useRef(0);
  const seq = useRef(103);
  const prevMine = useRef<Status | null>(null);

  useEffect(() => {
    const url = `${window.location.origin}/demos/pedidos-qr`;
    QRCode.toDataURL(url, { margin: 1, width: 240, color: { dark: "#150E48", light: "#FFFFFF" } }).then(setQr).catch(() => {});
    const t = setInterval(() => setNow(Date.now()), 15_000);
    return () => clearInterval(t);
  }, []);

  // Otras mesas también piden, para que el tablero se sienta vivo.
  useEffect(() => {
    const t = setInterval(() => {
      if (document.hidden || botIdx.current >= BOTS.length) return;
      const b = BOTS[botIdx.current++];
      setOrders((o) => [...o, { id: `A-${seq.current++}`, ...b, status: "nuevo", at: Date.now() }]);
    }, 28_000);
    return () => clearInterval(t);
  }, []);

  const mine = orders.find((o) => o.id === myId) ?? null;

  useEffect(() => {
    if (mine?.status === "listo" && prevMine.current !== "listo") beep();
    prevMine.current = mine?.status ?? null;
  }, [mine?.status]);

  const cartLines = Object.entries(cart).filter(([, q]) => q > 0).map(([id, qty]) => ({ id, qty }));
  const cartCount = cartLines.reduce((s, l) => s + l.qty, 0);
  const cartTotal = total({ lines: cartLines });

  const add = (id: string, d: 1 | -1) => setCart((c) => ({ ...c, [id]: Math.max(0, (c[id] ?? 0) + d) }));

  function send() {
    if (!name.trim()) return setErr("Escribe tu nombre para que te encuentren.");
    if (!cartLines.length) return setErr("Agrega al menos un producto.");
    const id = `A-${seq.current++}`;
    setOrders((o) => [...o, { id, table: MY_TABLE, name: name.trim(), lines: cartLines, status: "nuevo", at: Date.now(), mine: true }]);
    setMyId(id);
    setCart({});
    setErr("");
    setScreen("status");
  }

  const move = (id: string, status: Status) => setOrders((o) => o.map((x) => (x.id === id ? { ...x, status } : x)));
  const togglePaid = (id: string) => setOrders((o) => o.map((x) => (x.id === id ? { ...x, paid: !x.paid } : x)));

  const cols: { key: Status; title: string }[] = [
    { key: "nuevo", title: "Nuevos" },
    { key: "preparando", title: "Preparando" },
    { key: "listo", title: "Listos" },
  ];
  const newCount = orders.filter((o) => o.status === "nuevo").length + help.length;
  const sales = useMemo(() => orders.reduce((s, o) => s + total(o), 0), [orders]);

  function reset() {
    setOrders(SEED());
    setMyId(null);
    setScreen("menu");
    setHelp([]);
    setName("");
    botIdx.current = 0;
  }

  const steps: { key: Status; label: string }[] = [
    { key: "nuevo", label: "Recibido" },
    { key: "preparando", label: "Preparando" },
    { key: "listo", label: "¡Listo!" },
  ];
  const stepIdx = mine ? Math.min(2, ["nuevo", "preparando", "listo", "entregado"].indexOf(mine.status)) : 0;

  return (
    <div className="qd">
      <div className="qd-switch" role="tablist">
        <button role="tab" aria-selected={view === "cliente"} className={view === "cliente" ? "on" : ""} onClick={() => setView("cliente")}>
          📱 Cliente · Mesa {MY_TABLE}
        </button>
        <button role="tab" aria-selected={view === "bar"} className={view === "bar" ? "on" : ""} onClick={() => setView("bar")}>
          🖥️ Tablero del bar {newCount > 0 && <i>{newCount}</i>}
        </button>
      </div>

      <div className="qd-grid">
        {/* ---------- Celular del cliente ---------- */}
        <div className={`qd-phone-col ${view === "cliente" ? "show" : ""}`}>
          <div className="qd-label">Lo que ve el cliente al escanear</div>
          <div className="qd-phone">
            <div className="qd-notch" />
            <div className="qd-screen">
              <div className="qd-bar-head">
                <div>
                  <b>Bar La Esquina</b>
                  <span>Mesa {MY_TABLE}</span>
                </div>
                <button
                  className="qd-help"
                  onClick={() => {
                    setHelp((h) => [...h, `Mesa ${MY_TABLE}`]);
                  }}
                  disabled={help.includes(`Mesa ${MY_TABLE}`)}
                >
                  {help.includes(`Mesa ${MY_TABLE}`) ? "Mesero en camino" : "🙋 Llamar mesero"}
                </button>
              </div>

              {screen === "menu" && (
                <>
                  <div className="qd-cats">
                    {CATS.map((c) => (
                      <button key={c} className={c === cat ? "on" : ""} onClick={() => setCat(c)}>
                        {c}
                      </button>
                    ))}
                  </div>
                  <div className="qd-items">
                    {MENU.filter((m) => m.cat === cat).map((m) => {
                      const q = cart[m.id] ?? 0;
                      return (
                        <div key={m.id} className={`qd-item ${q ? "on" : ""}`}>
                          <div>
                            <b>{m.name}</b>
                            <span>{m.desc}</span>
                            <em>{cop(m.price)}</em>
                          </div>
                          {q === 0 ? (
                            <button className="qd-add" onClick={() => add(m.id, 1)} aria-label={`Agregar ${m.name}`}>
                              +
                            </button>
                          ) : (
                            <div className="qd-step">
                              <button onClick={() => add(m.id, -1)} aria-label="Quitar">−</button>
                              <output>{q}</output>
                              <button onClick={() => add(m.id, 1)} aria-label="Agregar">+</button>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                  {mine && (
                    <button className="qd-track" onClick={() => setScreen("status")}>
                      Ver mi pedido {mine.id} →
                    </button>
                  )}
                  <button className="qd-cta" disabled={!cartCount} onClick={() => setScreen("cart")}>
                    {cartCount ? `Ver pedido · ${cartCount} · ${cop(cartTotal)}` : "Elige algo del menú"}
                  </button>
                </>
              )}

              {screen === "cart" && (
                <div className="qd-cart">
                  <button className="qd-back" onClick={() => setScreen("menu")}>
                    ← Seguir pidiendo
                  </button>
                  <h4>Tu pedido</h4>
                  {cartLines.map((l) => (
                    <div key={l.id} className="qd-line">
                      <span>
                        {l.qty} × {byId[l.id].name}
                      </span>
                      <b>{cop(byId[l.id].price * l.qty)}</b>
                    </div>
                  ))}
                  <div className="qd-line qd-total">
                    <span>Total</span>
                    <b>{cop(cartTotal)}</b>
                  </div>
                  <label className="qd-name">
                    <span>¿A nombre de quién?</span>
                    <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Tu nombre" maxLength={30} />
                  </label>
                  {err && <p className="qd-err">{err}</p>}
                  <p className="qd-note">Pagas en la barra o al mesero. (La pasarela de pago en línea se puede activar.)</p>
                  <button className="qd-cta" onClick={send}>
                    Enviar pedido al bar
                  </button>
                </div>
              )}

              {screen === "status" && mine && (
                <div className={`qd-status ${mine.status === "listo" ? "ready" : ""}`}>
                  <button className="qd-back" onClick={() => setScreen("menu")}>
                    ← Volver al menú
                  </button>
                  <div className="qd-big">
                    {mine.status === "listo" ? "🔔" : mine.status === "entregado" ? "✅" : "⏳"}
                    <b>
                      {mine.status === "nuevo" && "Pedido recibido"}
                      {mine.status === "preparando" && "Lo estamos preparando"}
                      {mine.status === "listo" && "¡Tu pedido está listo!"}
                      {mine.status === "entregado" && "Pedido entregado. ¡Salud!"}
                    </b>
                    <span>
                      {mine.status === "listo" ? "Acércate a la barra o espera al mesero." : `Pedido ${mine.id} · ${mine.name}`}
                    </span>
                  </div>
                  <ol className="qd-steps">
                    {steps.map((s, i) => (
                      <li key={s.key} className={i <= stepIdx ? "done" : ""}>
                        {s.label}
                      </li>
                    ))}
                  </ol>
                  <div className="qd-mini">
                    {mine.lines.map((l) => (
                      <div key={l.id}>
                        {l.qty} × {byId[l.id].name}
                      </div>
                    ))}
                  </div>
                  <p className="qd-hint">
                    👉 Ahora ve al <b>tablero del bar</b> y mueve el pedido a “Preparando” y luego a “Listo”: este celular sonará y vibrará.
                  </p>
                </div>
              )}
            </div>
          </div>
          {qr && (
            <div className="qd-qr">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={qr} alt="Código QR de la demo" width={96} height={96} />
              <p>
                <b>Así se ve el QR de cada mesa.</b> Escanéalo con tu celular para abrir esta demo allá.
              </p>
            </div>
          )}
        </div>

        {/* ---------- Tablero del bar ---------- */}
        <div className={`qd-board-col ${view === "bar" ? "show" : ""}`}>
          <div className="qd-label">Lo que ve el bar en su pantalla</div>
          <div className="qd-board">
            <div className="qd-board-head">
              <div>
                <b>Tablero de pedidos</b>
                <span>Se actualiza solo · sin recargar</span>
              </div>
              <div className="qd-kpis">
                <div>
                  <b>{orders.length}</b>
                  <span>pedidos</span>
                </div>
                <div>
                  <b>{cop(sales)}</b>
                  <span>vendido</span>
                </div>
              </div>
            </div>

            {help.length > 0 && (
              <div className="qd-alerts">
                {help.map((h, i) => (
                  <div key={h + i} className="qd-alert">
                    🙋 {h} pide un mesero
                    <button onClick={() => setHelp((x) => x.filter((_, j) => j !== i))}>Atendido</button>
                  </div>
                ))}
              </div>
            )}

            <div className="qd-cols">
              {cols.map((c) => {
                const list = orders.filter((o) => o.status === c.key).sort((a, b) => a.at - b.at);
                return (
                  <div key={c.key} className={`qd-col c-${c.key}`}>
                    <div className="qd-col-title">
                      {c.title} <i>{list.length}</i>
                    </div>
                    {list.length === 0 && <div className="qd-empty">—</div>}
                    {list.map((o) => (
                      <div key={o.id} className={`qd-card ${o.mine ? "mine" : ""}`}>
                        <div className="qd-card-top">
                          <b>Mesa {o.table}</b>
                          <span>{ago(o.at, now)}</span>
                        </div>
                        <div className="qd-who">
                          {o.name} · {o.id} {o.mine && <i>Tu pedido</i>}
                        </div>
                        <ul>
                          {o.lines.map((l) => (
                            <li key={l.id}>
                              <b>{l.qty}×</b> {byId[l.id].name}
                            </li>
                          ))}
                        </ul>
                        <div className="qd-card-foot">
                          <button className={`qd-paid ${o.paid ? "on" : ""}`} onClick={() => togglePaid(o.id)}>
                            {o.paid ? "Pagado" : "Por cobrar"} · {cop(total(o))}
                          </button>
                          {o.status === "nuevo" && <button className="qd-go" onClick={() => move(o.id, "preparando")}>Preparar →</button>}
                          {o.status === "preparando" && <button className="qd-go" onClick={() => move(o.id, "listo")}>Listo ✓</button>}
                          {o.status === "listo" && <button className="qd-go ghost" onClick={() => move(o.id, "entregado")}>Entregado</button>}
                        </div>
                      </div>
                    ))}
                  </div>
                );
              })}
            </div>
            <div className="qd-board-foot">
              <span>{orders.filter((o) => o.status === "entregado").length} entregados hoy</span>
              <button onClick={reset}>↺ Reiniciar demo</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
