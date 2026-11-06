"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import QRCode from "qrcode";
import { href, type Lang } from "@/lib/i18n";

// Simulación completa en el navegador: el celular del cliente y el tablero del bar
// comparten el mismo estado. En el sistema real esto viaja por Supabase Realtime.

type Cat = "beer" | "cocktails" | "snacks" | "soft";
type Item = { id: string; name: string; desc: string; price: number; cat: Cat; en: [string, string] };
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
  { id: "c1", cat: "beer", name: "Cerveza artesanal rubia", desc: "Pinta 473 ml", price: 16000, en: ["Craft blonde ale", "Pint, 16 oz"] },
  { id: "c2", cat: "beer", name: "Cerveza roja", desc: "Pinta 473 ml", price: 17000, en: ["Red ale", "Pint, 16 oz"] },
  { id: "c3", cat: "beer", name: "Michelada", desc: "Limón, sal y la cerveza que elijas", price: 19000, en: ["Michelada", "Lime, salt and your choice of beer"] },
  { id: "k1", cat: "cocktails", name: "Mojito", desc: "Ron blanco, hierbabuena, limón", price: 28000, en: ["Mojito", "White rum, mint, lime"] },
  { id: "k2", cat: "cocktails", name: "Gin tonic de maracuyá", desc: "Ginebra, tónica, maracuyá", price: 32000, en: ["Passion fruit gin & tonic", "Gin, tonic, passion fruit"] },
  { id: "k3", cat: "cocktails", name: "Margarita", desc: "Tequila, triple sec, limón", price: 30000, en: ["Margarita", "Tequila, triple sec, lime"] },
  { id: "p1", cat: "snacks", name: "Nachos de la casa", desc: "Guacamole, pico de gallo, queso", price: 26000, en: ["House nachos", "Guacamole, pico de gallo, cheese"] },
  { id: "p2", cat: "snacks", name: "Alitas BBQ", desc: "10 unidades con papas", price: 34000, en: ["BBQ wings", "10 pieces with fries"] },
  { id: "p3", cat: "snacks", name: "Empanadas", desc: "5 unidades con ají", price: 18000, en: ["Empanadas", "5 pieces with hot sauce"] },
  { id: "s1", cat: "soft", name: "Limonada de coco", desc: "Vaso 400 ml", price: 12000, en: ["Coconut lemonade", "13 oz glass"] },
  { id: "s2", cat: "soft", name: "Soda de frutos rojos", desc: "Vaso 400 ml", price: 11000, en: ["Berry soda", "13 oz glass"] },
];
const byId = Object.fromEntries(MENU.map((m) => [m.id, m]));
const CATS = Array.from(new Set(MENU.map((m) => m.cat)));
const MY_TABLE = "7";

const TX = {
  es: {
    cats: { beer: "Cervezas", cocktails: "Cócteles", snacks: "Para picar", soft: "Sin alcohol" } as Record<Cat, string>,
    tables: { Barra: "Barra", "Terraza 2": "Terraza 2" } as Record<string, string>,
    table: "Mesa", now: "ahora", ago: (m: number) => `hace ${m} min`,
    tabClient: "📱 Cliente · Mesa", tabBar: "🖥️ Tablero del bar",
    clientLabel: "Lo que ve el cliente al escanear", barLabel: "Lo que ve el bar en su pantalla",
    waiterComing: "Mesero en camino", callWaiter: "🙋 Llamar mesero",
    add: "Agregar", remove: "Quitar",
    viewMine: "Ver mi pedido", viewCart: "Ver pedido", pick: "Elige algo del menú",
    keepOrdering: "← Seguir pidiendo", yourOrder: "Tu pedido", total: "Total",
    whose: "¿A nombre de quién?", namePh: "Tu nombre",
    errName: "Escribe tu nombre para que te encuentren.", errEmpty: "Agrega al menos un producto.",
    payNote: "Pagas en la barra o al mesero. (La pasarela de pago en línea se puede activar.)",
    send: "Enviar pedido al bar", backMenu: "← Volver al menú",
    st: { nuevo: "Pedido recibido", preparando: "Lo estamos preparando", listo: "¡Tu pedido está listo!", entregado: "Pedido entregado. ¡Salud!" } as Record<Status, string>,
    readyHint: "Acércate a la barra o espera al mesero.", orderWord: "Pedido",
    steps: ["Recibido", "Preparando", "¡Listo!"],
    hint: ["👉 Ahora ve al ", "tablero del bar", " y mueve el pedido a “Preparando” y luego a “Listo”: este celular sonará y vibrará."],
    qrAlt: "Código QR de la demo", qrTitle: "Así se ve el QR de cada mesa.", qrText: " Escanéalo con tu celular para abrir esta demo allá.",
    board: "Tablero de pedidos", boardSub: "Se actualiza solo · sin recargar", orders: "pedidos", sold: "vendido",
    callsWaiter: "pide un mesero", attended: "Atendido",
    cols: { nuevo: "Nuevos", preparando: "Preparando", listo: "Listos" } as Record<string, string>,
    mine: "Tu pedido", paid: "Pagado", unpaid: "Por cobrar", prepare: "Preparar →", ready: "Listo ✓", delivered: "Entregado",
    deliveredToday: "entregados hoy", reset: "↺ Reiniciar demo",
  },
  en: {
    cats: { beer: "Beer", cocktails: "Cocktails", snacks: "Snacks", soft: "Non-alcoholic" } as Record<Cat, string>,
    tables: { Barra: "Bar counter", "Terraza 2": "Patio 2" } as Record<string, string>,
    table: "Table", now: "now", ago: (m: number) => `${m} min ago`,
    tabClient: "📱 Guest · Table", tabBar: "🖥️ Bar board",
    clientLabel: "What the guest sees after scanning", barLabel: "What the bar sees on its screen",
    waiterComing: "Waiter on the way", callWaiter: "🙋 Call waiter",
    add: "Add", remove: "Remove",
    viewMine: "View my order", viewCart: "View order", pick: "Pick something from the menu",
    keepOrdering: "← Keep ordering", yourOrder: "Your order", total: "Total",
    whose: "Name for the order", namePh: "Your name",
    errName: "Type your name so they can find you.", errEmpty: "Add at least one item.",
    payNote: "Pay at the bar or to the waiter. (Online payment can be enabled.)",
    send: "Send order to the bar", backMenu: "← Back to menu",
    st: { nuevo: "Order received", preparando: "We're preparing it", listo: "Your order is ready!", entregado: "Order delivered. Cheers!" } as Record<Status, string>,
    readyHint: "Head to the bar or wait for the waiter.", orderWord: "Order",
    steps: ["Received", "Preparing", "Ready!"],
    hint: ["👉 Now go to the ", "bar board", " and move the order to “Preparing” and then “Ready”: this phone will ring and vibrate."],
    qrAlt: "Demo QR code", qrTitle: "This is what each table's QR code looks like.", qrText: " Scan it with your phone to open this demo there.",
    board: "Order board", boardSub: "Updates on its own · no reloading", orders: "orders", sold: "sold",
    callsWaiter: "is calling a waiter", attended: "Done",
    cols: { nuevo: "New", preparando: "Preparing", listo: "Ready" } as Record<string, string>,
    mine: "Your order", paid: "Paid", unpaid: "Unpaid", prepare: "Prepare →", ready: "Ready ✓", delivered: "Delivered",
    deliveredToday: "delivered today", reset: "↺ Reset demo",
  },
};

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



export default function QrDemo({ lang = "es" }: { lang?: Lang }) {
  const t = TX[lang];
  const itemName = (id: string) => (lang === "en" ? byId[id].en[0] : byId[id].name);
  const itemDesc = (id: string) => (lang === "en" ? byId[id].en[1] : byId[id].desc);
  const tableName = (x: string) => t.tables[x] ?? `${t.table} ${x}`;
  const ago = (at: number, nowMs: number) => {
    const m = Math.max(0, Math.round((nowMs - at) / 60_000));
    return m === 0 ? t.now : t.ago(m);
  };
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
    const url = `${window.location.origin}${href(lang, "/demos/pedidos-qr")}`;
    QRCode.toDataURL(url, { margin: 1, width: 240, color: { dark: "#150E48", light: "#FFFFFF" } }).then(setQr).catch(() => {});
    const iv = setInterval(() => setNow(Date.now()), 15_000);
    return () => clearInterval(iv);
  }, [lang]);

  // Otras mesas también piden, para que el tablero se sienta vivo.
  useEffect(() => {
    const iv = setInterval(() => {
      if (document.hidden || botIdx.current >= BOTS.length) return;
      const b = BOTS[botIdx.current++];
      setOrders((o) => [...o, { id: `A-${seq.current++}`, ...b, status: "nuevo", at: Date.now() }]);
    }, 28_000);
    return () => clearInterval(iv);
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
    if (!name.trim()) return setErr(t.errName);
    if (!cartLines.length) return setErr(t.errEmpty);
    const id = `A-${seq.current++}`;
    setOrders((o) => [...o, { id, table: MY_TABLE, name: name.trim(), lines: cartLines, status: "nuevo", at: Date.now(), mine: true }]);
    setMyId(id);
    setCart({});
    setErr("");
    setScreen("status");
  }

  const move = (id: string, status: Status) => setOrders((o) => o.map((x) => (x.id === id ? { ...x, status } : x)));
  const togglePaid = (id: string) => setOrders((o) => o.map((x) => (x.id === id ? { ...x, paid: !x.paid } : x)));

  const cols: { key: Status; title: string }[] = (["nuevo", "preparando", "listo"] as Status[]).map((key) => ({ key, title: t.cols[key] }));
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

  const steps: { key: Status; label: string }[] = (["nuevo", "preparando", "listo"] as Status[]).map((key, i) => ({ key, label: t.steps[i] }));
  const stepIdx = mine ? Math.min(2, ["nuevo", "preparando", "listo", "entregado"].indexOf(mine.status)) : 0;

  return (
    <div className="qd">
      <div className="qd-switch" role="tablist">
        <button role="tab" aria-selected={view === "cliente"} className={view === "cliente" ? "on" : ""} onClick={() => setView("cliente")}>
          {t.tabClient} {MY_TABLE}
        </button>
        <button role="tab" aria-selected={view === "bar"} className={view === "bar" ? "on" : ""} onClick={() => setView("bar")}>
          {t.tabBar} {newCount > 0 && <i>{newCount}</i>}
        </button>
      </div>

      <div className="qd-grid">
        {/* ---------- Celular del cliente ---------- */}
        <div className={`qd-phone-col ${view === "cliente" ? "show" : ""}`}>
          <div className="qd-label">{t.clientLabel}</div>
          <div className="qd-phone">
            <div className="qd-notch" />
            <div className="qd-screen">
              <div className="qd-bar-head">
                <div>
                  <b>Bar La Esquina</b>
                  <span>{tableName(MY_TABLE)}</span>
                </div>
                <button
                  className="qd-help"
                  onClick={() => {
                    setHelp((h) => [...h, tableName(MY_TABLE)]);
                  }}
                  disabled={help.includes(tableName(MY_TABLE))}
                >
                  {help.includes(tableName(MY_TABLE)) ? t.waiterComing : t.callWaiter}
                </button>
              </div>

              {screen === "menu" && (
                <>
                  <div className="qd-cats">
                    {CATS.map((c) => (
                      <button key={c} className={c === cat ? "on" : ""} onClick={() => setCat(c)}>
                        {t.cats[c]}
                      </button>
                    ))}
                  </div>
                  <div className="qd-items">
                    {MENU.filter((m) => m.cat === cat).map((m) => {
                      const q = cart[m.id] ?? 0;
                      return (
                        <div key={m.id} className={`qd-item ${q ? "on" : ""}`}>
                          <div>
                            <b>{itemName(m.id)}</b>
                            <span>{itemDesc(m.id)}</span>
                            <em>{cop(m.price)}</em>
                          </div>
                          {q === 0 ? (
                            <button className="qd-add" onClick={() => add(m.id, 1)} aria-label={`${t.add} ${itemName(m.id)}`}>
                              +
                            </button>
                          ) : (
                            <div className="qd-step">
                              <button onClick={() => add(m.id, -1)} aria-label={t.remove}>−</button>
                              <output>{q}</output>
                              <button onClick={() => add(m.id, 1)} aria-label={t.add}>+</button>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                  {mine && (
                    <button className="qd-track" onClick={() => setScreen("status")}>
                      {t.viewMine} {mine.id} →
                    </button>
                  )}
                  <button className="qd-cta" disabled={!cartCount} onClick={() => setScreen("cart")}>
                    {cartCount ? `${t.viewCart} · ${cartCount} · ${cop(cartTotal)}` : t.pick}
                  </button>
                </>
              )}

              {screen === "cart" && (
                <div className="qd-cart">
                  <button className="qd-back" onClick={() => setScreen("menu")}>
                    {t.keepOrdering}
                  </button>
                  <h4>{t.yourOrder}</h4>
                  {cartLines.map((l) => (
                    <div key={l.id} className="qd-line">
                      <span>
                        {l.qty} × {itemName(l.id)}
                      </span>
                      <b>{cop(byId[l.id].price * l.qty)}</b>
                    </div>
                  ))}
                  <div className="qd-line qd-total">
                    <span>{t.total}</span>
                    <b>{cop(cartTotal)}</b>
                  </div>
                  <label className="qd-name">
                    <span>{t.whose}</span>
                    <input value={name} onChange={(e) => setName(e.target.value)} placeholder={t.namePh} maxLength={30} />
                  </label>
                  {err && <p className="qd-err">{err}</p>}
                  <p className="qd-note">{t.payNote}</p>
                  <button className="qd-cta" onClick={send}>
                    {t.send}
                  </button>
                </div>
              )}

              {screen === "status" && mine && (
                <div className={`qd-status ${mine.status === "listo" ? "ready" : ""}`}>
                  <button className="qd-back" onClick={() => setScreen("menu")}>
                    {t.backMenu}
                  </button>
                  <div className="qd-big">
                    {mine.status === "listo" ? "🔔" : mine.status === "entregado" ? "✅" : "⏳"}
                    <b>
                      {t.st[mine.status]}
                    </b>
                    <span>
                      {mine.status === "listo" ? t.readyHint : `${t.orderWord} ${mine.id} · ${mine.name}`}
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
                        {l.qty} × {itemName(l.id)}
                      </div>
                    ))}
                  </div>
                  <p className="qd-hint">
                    {t.hint[0]}<b>{t.hint[1]}</b>{t.hint[2]}
                  </p>
                </div>
              )}
            </div>
          </div>
          {qr && (
            <div className="qd-qr">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={qr} alt={t.qrAlt} width={96} height={96} />
              <p>
                <b>{t.qrTitle}</b>{t.qrText}
              </p>
            </div>
          )}
        </div>

        {/* ---------- Tablero del bar ---------- */}
        <div className={`qd-board-col ${view === "bar" ? "show" : ""}`}>
          <div className="qd-label">{t.barLabel}</div>
          <div className="qd-board">
            <div className="qd-board-head">
              <div>
                <b>{t.board}</b>
                <span>{t.boardSub}</span>
              </div>
              <div className="qd-kpis">
                <div>
                  <b>{orders.length}</b>
                  <span>{t.orders}</span>
                </div>
                <div>
                  <b>{cop(sales)}</b>
                  <span>{t.sold}</span>
                </div>
              </div>
            </div>

            {help.length > 0 && (
              <div className="qd-alerts">
                {help.map((h, i) => (
                  <div key={h + i} className="qd-alert">
                    🙋 {h} {t.callsWaiter}
                    <button onClick={() => setHelp((x) => x.filter((_, j) => j !== i))}>{t.attended}</button>
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
                          <b>{tableName(o.table)}</b>
                          <span>{ago(o.at, now)}</span>
                        </div>
                        <div className="qd-who">
                          {o.name} · {o.id} {o.mine && <i>{t.mine}</i>}
                        </div>
                        <ul>
                          {o.lines.map((l) => (
                            <li key={l.id}>
                              <b>{l.qty}×</b> {itemName(l.id)}
                            </li>
                          ))}
                        </ul>
                        <div className="qd-card-foot">
                          <button className={`qd-paid ${o.paid ? "on" : ""}`} onClick={() => togglePaid(o.id)}>
                            {o.paid ? t.paid : t.unpaid} · {cop(total(o))}
                          </button>
                          {o.status === "nuevo" && <button className="qd-go" onClick={() => move(o.id, "preparando")}>{t.prepare}</button>}
                          {o.status === "preparando" && <button className="qd-go" onClick={() => move(o.id, "listo")}>{t.ready}</button>}
                          {o.status === "listo" && <button className="qd-go ghost" onClick={() => move(o.id, "entregado")}>{t.delivered}</button>}
                        </div>
                      </div>
                    ))}
                  </div>
                );
              })}
            </div>
            <div className="qd-board-foot">
              <span>{orders.filter((o) => o.status === "entregado").length} {t.deliveredToday}</span>
              <button onClick={reset}>{t.reset}</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
