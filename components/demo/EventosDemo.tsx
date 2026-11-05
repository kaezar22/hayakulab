"use client";

import { useEffect, useMemo, useState } from "react";
import QRCode from "qrcode";

// Simulación en el navegador de QR Eventos: artista → seguidores → puerta.
// En el sistema real todo queda en Google Sheets y la puerta escanea con la cámara.

type Inv = { id: string; artista: string; red: string; usuario: string; evento: string; fecha: string; beneficio: string; mine?: boolean };
type Reg = { id: string; inv: string; artista: string; evento: string; nombre: string; email: string; checkin?: string; mine?: boolean };
type Result =
  | { estado: "OK" | "YA_INGRESO" | "OTRO_EVENTO"; reg: Reg; codigo: string }
  | { estado: "NO_EXISTE" | "INVALIDO"; codigo: string };

const EVENTO = "Noche Neón · Teatro Royal";
const OTRO_EVENTO = "Festival Sabana Sound";
const REDES = ["TikTok", "Instagram", "YouTube", "X / Twitter", "Otra"];
const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[A-Za-z]{2,}$/;
const ABC = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
const nuevoId = (n: number) => Array.from({ length: n }, () => ABC[Math.floor(Math.random() * ABC.length)]).join("");
const hora = () => new Date().toLocaleTimeString("es-CO", { hour: "2-digit", minute: "2-digit", hourCycle: "h23" });

const NOMBRES = ["Lucía Navarro", "Andrés Pérez", "Camila Rojas", "Julián Torres", "Sofía Herrera", "Mateo Díaz", "Valentina Cruz", "Santiago Mora", "Isabela Ruiz", "Tomás Vargas", "Mariana León", "Felipe Castro", "Daniela Ortiz", "Nicolás Ríos", "Paula Méndez", "Sebastián Gil"];

function seed(): { invs: Inv[]; regs: Reg[] } {
  const fecha = new Date(Date.now() + 9 * 86400000).toISOString().slice(0, 10);
  const invs: Inv[] = [
    { id: "VR7K2M", artista: "Valen Ríos", red: "Instagram", usuario: "@valenrios", evento: EVENTO, fecha, beneficio: "Cóctel de bienvenida" },
    { id: "TN4P8Q", artista: "MC Tano", red: "TikTok", usuario: "@mctano", evento: EVENTO, fecha, beneficio: "10% de descuento en consumo" },
    { id: "SB9X3L", artista: "Luna Beats", red: "TikTok", usuario: "@lunabeats", evento: OTRO_EVENTO, fecha, beneficio: "Entrada preferencial" },
  ];
  const regs: Reg[] = [];
  const plan: [string, number, number][] = [["VR7K2M", 9, 6], ["TN4P8Q", 6, 3], ["SB9X3L", 1, 0]];
  let k = 0;
  for (const [inv, total, entraron] of plan) {
    const i = invs.find((x) => x.id === inv)!;
    for (let j = 0; j < total; j++) {
      const nombre = NOMBRES[k++ % NOMBRES.length];
      regs.push({
        id: nuevoId(10),
        inv,
        artista: i.artista,
        evento: i.evento,
        nombre,
        email: nombre.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(" ", ".") + "@correo.com",
        checkin: j < entraron ? `${20 + Math.floor(j / 3)}:${String((j * 7) % 60).padStart(2, "0")}` : undefined,
      });
    }
  }
  return { invs, regs };
}

function QrImg({ text, size = 180 }: { text: string; size?: number }) {
  const [src, setSrc] = useState("");
  useEffect(() => {
    QRCode.toDataURL(text, { margin: 1, width: size * 2, color: { dark: "#150E48", light: "#FFFFFF" } }).then(setSrc).catch(() => {});
  }, [text, size]);
  // eslint-disable-next-line @next/next/no-img-element
  return src ? <img src={src} alt={`Código QR: ${text}`} width={size} height={size} className="ev-qr" /> : <div className="ev-qr" style={{ width: size, height: size }} />;
}

function download(dataText: string, name: string) {
  QRCode.toDataURL(dataText, { margin: 2, width: 640, color: { dark: "#150E48", light: "#FFFFFF" } }).then((url) => {
    const a = document.createElement("a");
    a.href = url;
    a.download = name;
    a.click();
  });
}

export default function EventosDemo() {
  const [data, setData] = useState(seed);
  const [tab, setTab] = useState<1 | 2 | 3>(1);
  const [origin, setOrigin] = useState("https://www.hayakulab.com");
  useEffect(() => setOrigin(window.location.origin), []);

  // --- Artista
  const [fa, setFa] = useState({ artista: "", red: "TikTok", usuario: "", email: "", beneficio: "10% de descuento en consumo" });
  const [errA, setErrA] = useState<string[]>([]);
  const [miInv, setMiInv] = useState<Inv | null>(null);

  // --- Seguidor
  const [fs, setFs] = useState({ nombre: "", email: "", celular: "", acepta: false });
  const [errS, setErrS] = useState<string[]>([]);
  const [miReg, setMiReg] = useState<{ reg: Reg; repetido: boolean } | null>(null);
  const [verPolitica, setVerPolitica] = useState(false);

  // --- Puerta
  const [codigo, setCodigo] = useState("");
  const [res, setRes] = useState<Result | null>(null);

  const inv = miInv ?? data.invs[1];

  function crearInvitacion() {
    const e: string[] = [];
    if (!fa.artista.trim()) e.push("Escribe tu nombre artístico.");
    if (!EMAIL_RE.test(fa.email.trim())) e.push("Escribe un correo válido.");
    setErrA(e);
    if (e.length) return;
    const fecha = new Date(Date.now() + 9 * 86400000).toISOString().slice(0, 10);
    const nueva: Inv = { id: nuevoId(6), artista: fa.artista.trim(), red: fa.red, usuario: fa.usuario.trim(), evento: EVENTO, fecha, beneficio: fa.beneficio.trim(), mine: true };
    setData((d) => ({ ...d, invs: [...d.invs, nueva] }));
    setMiInv(nueva);
    setMiReg(null);
  }

  function registrar() {
    const e: string[] = [];
    const cel = fs.celular.replace(/\D/g, "");
    if (!fs.nombre.trim()) e.push("Escribe tu nombre.");
    if (!EMAIL_RE.test(fs.email.trim())) e.push("Escribe un correo válido.");
    if (cel.length < 7 || cel.length > 15) e.push("Escribe un celular válido.");
    if (!fs.acepta) e.push("Debes aceptar la política de tratamiento de datos para registrarte.");
    setErrS(e);
    if (e.length) return;
    const email = fs.email.trim().toLowerCase();
    const existente = data.regs.find((r) => r.inv === inv.id && r.email === email);
    if (existente) {
      setMiReg({ reg: existente, repetido: true });
      return;
    }
    const reg: Reg = { id: nuevoId(10), inv: inv.id, artista: inv.artista, evento: inv.evento, nombre: fs.nombre.trim(), email, mine: true };
    setData((d) => ({ ...d, regs: [...d.regs, reg] }));
    setMiReg({ reg, repetido: false });
  }

  function simularSeguidores(n: number) {
    setData((d) => {
      const nuevos: Reg[] = Array.from({ length: n }, (_, j) => {
        const nombre = NOMBRES[(d.regs.length + j * 5) % NOMBRES.length];
        return { id: nuevoId(10), inv: inv.id, artista: inv.artista, evento: inv.evento, nombre, email: `${nuevoId(5).toLowerCase()}@correo.com` };
      });
      return { ...d, regs: [...d.regs, ...nuevos] };
    });
  }

  function validar(texto: string) {
    const limpio = texto.trim().toUpperCase();
    const m = limpio.match(/^(?:QREV:)?([A-Z0-9]{6,12})$/);
    if (!m) return setRes({ estado: "INVALIDO", codigo: texto });
    const c = m[1];
    const reg = data.regs.find((r) => r.id === c);
    if (!reg) return setRes({ estado: "NO_EXISTE", codigo: c });
    if (reg.evento !== EVENTO) return setRes({ estado: "OTRO_EVENTO", reg, codigo: c });
    if (reg.checkin) return setRes({ estado: "YA_INGRESO", reg, codigo: c });
    const h = hora();
    setData((d) => ({ ...d, regs: d.regs.map((r) => (r.id === c ? { ...r, checkin: h } : r)) }));
    setRes({ estado: "OK", reg: { ...reg, checkin: h }, codigo: c });
  }

  const resumen = useMemo(() => {
    const porArtista = data.invs
      .filter((i) => i.evento === EVENTO)
      .map((i) => {
        const rs = data.regs.filter((r) => r.inv === i.id);
        return { ...i, registrados: rs.length, ingresaron: rs.filter((r) => r.checkin).length };
      })
      .sort((a, b) => b.ingresaron - a.ingresaron || b.registrados - a.registrados);
    return porArtista;
  }, [data]);
  const totReg = resumen.reduce((s, r) => s + r.registrados, 0);
  const totIn = resumen.reduce((s, r) => s + r.ingresaron, 0);
  const maxReg = Math.max(1, ...resumen.map((r) => r.registrados));

  // Pases que el portero puede "escanear" con un clic
  const pases = useMemo(() => {
    const mios = data.regs.filter((r) => r.mine);
    const pendientes = data.regs.filter((r) => !r.mine && r.evento === EVENTO && !r.checkin).slice(0, 3);
    const yaEntro = data.regs.find((r) => !r.mine && r.evento === EVENTO && r.checkin);
    const otro = data.regs.find((r) => r.evento !== EVENTO);
    return [...mios, ...pendientes, ...(yaEntro ? [yaEntro] : []), ...(otro ? [otro] : [])];
  }, [data]);

  const tabs = [
    { n: 1 as const, t: "1 · Artista", s: "Crea su invitación" },
    { n: 2 as const, t: "2 · Seguidor", s: "Se registra y recibe su QR" },
    { n: 3 as const, t: "3 · Puerta", s: "Escanea y cuenta asistencia" },
  ];

  return (
    <div className="ev">
      <div className="dm-tabs ev-tabs" role="tablist">
        {tabs.map((x) => (
          <button key={x.n} role="tab" aria-selected={tab === x.n} className={`dm-tab ${tab === x.n ? "on" : ""}`} onClick={() => setTab(x.n)}>
            <b>{x.t}</b>
            <span>{x.s}</span>
          </button>
        ))}
      </div>

      {/* ---------------- 1 · Artista ---------------- */}
      {tab === 1 && (
        <div className="dm-panel ev-split">
          <div>
            <h3 className="ev-h">🎟️ Invita a tus seguidores</h3>
            <p className="dm-muted">Crea tu invitación para el evento. Te damos un link y un QR para compartir en TikTok o Instagram. Cada seguidor que se registre queda contado a tu nombre.</p>
            <div className="ev-form">
              <label className="dm-field">
                <span>Nombre artístico *</span>
                <input value={fa.artista} onChange={(e) => setFa({ ...fa, artista: e.target.value })} placeholder="Ej: DJ Kaori" maxLength={40} />
              </label>
              <div className="ev-row">
                <label className="dm-field">
                  <span>Red social</span>
                  <select value={fa.red} onChange={(e) => setFa({ ...fa, red: e.target.value })}>
                    {REDES.map((r) => (
                      <option key={r}>{r}</option>
                    ))}
                  </select>
                </label>
                <label className="dm-field">
                  <span>Usuario</span>
                  <input value={fa.usuario} onChange={(e) => setFa({ ...fa, usuario: e.target.value })} placeholder="@tu_usuario" maxLength={30} />
                </label>
              </div>
              <label className="dm-field">
                <span>Tu correo *</span>
                <input value={fa.email} onChange={(e) => setFa({ ...fa, email: e.target.value })} placeholder="tu@correo.com" maxLength={60} />
              </label>
              <label className="dm-field">
                <span>Evento</span>
                <input value={EVENTO} disabled />
              </label>
              <label className="dm-field">
                <span>Beneficio para tus seguidores</span>
                <input value={fa.beneficio} onChange={(e) => setFa({ ...fa, beneficio: e.target.value })} maxLength={60} />
              </label>
              {errA.map((e) => (
                <p key={e} className="ev-err">{e}</p>
              ))}
              <button className="hk-btn hk-btn-primary" onClick={crearInvitacion}>Generar mi QR</button>
            </div>
          </div>
          <div className="ev-out">
            {miInv ? (
              <div className="ev-card ev-pop">
                <p className="ev-ok">¡Listo, {miInv.artista}! Comparte este link o este QR.</p>
                <QrImg text={`${origin}/demos/qr-eventos?a=${miInv.id}`} size={190} />
                <code className="ev-link">{origin.replace(/^https?:\/\//, "")}/?a={miInv.id}</code>
                <div className="ev-actions">
                  <button className="hk-btn hk-btn-sm" onClick={() => download(`${origin}/demos/qr-eventos?a=${miInv.id}`, `qr_${miInv.artista.replace(/\s+/g, "_")}.png`)}>↓ Descargar QR</button>
                  <button className="hk-btn hk-btn-cyan hk-btn-sm" onClick={() => setTab(2)}>Abrir como seguidor →</button>
                </div>
                <small>Código de tu invitación: <b>{miInv.id}</b>. Con él sabremos cuántas personas llegaron por ti.</small>
              </div>
            ) : (
              <div className="ev-card ev-empty">
                <div className="ev-ghost-qr" aria-hidden="true" />
                <p>Aquí aparecerá tu link y tu QR para compartir.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ---------------- 2 · Seguidor ---------------- */}
      {tab === 2 && (
        <div className="dm-panel ev-split">
          <div>
            <div className="ev-invite">
              <span className="ev-tagline">Invitación de {inv.artista}{inv.usuario ? ` (${inv.usuario})` : ""}</span>
              <h3>{inv.evento}</h3>
              <span>📅 {inv.fecha}</span>
              {inv.beneficio && <div className="ev-benefit">🎁 Tu beneficio: <b>{inv.beneficio}</b></div>}
            </div>
            {!miInv && <p className="ev-note">Estás viendo la invitación de ejemplo de MC Tano. Crea la tuya en la pestaña “Artista” para verla aquí.</p>}
            {!miReg ? (
              <div className="ev-form">
                <p className="dm-muted">Regístrate para recibir tu QR personal. Lo mostrarás en la entrada del evento.</p>
                <label className="dm-field">
                  <span>Nombre completo *</span>
                  <input value={fs.nombre} onChange={(e) => setFs({ ...fs, nombre: e.target.value })} maxLength={50} />
                </label>
                <div className="ev-row">
                  <label className="dm-field">
                    <span>Correo electrónico *</span>
                    <input value={fs.email} onChange={(e) => setFs({ ...fs, email: e.target.value })} maxLength={60} />
                  </label>
                  <label className="dm-field">
                    <span>Celular *</span>
                    <input value={fs.celular} onChange={(e) => setFs({ ...fs, celular: e.target.value })} placeholder="300 123 4567" maxLength={20} inputMode="tel" />
                  </label>
                </div>
                <button type="button" className="ev-linkbtn" onClick={() => setVerPolitica((v) => !v)}>
                  {verPolitica ? "▾" : "▸"} Leer la política de tratamiento de datos
                </button>
                {verPolitica && (
                  <div className="ev-politica">
                    Tus datos (nombre, correo y celular) se usan solo para enviarte tu QR, validar tu ingreso al evento, aplicar tu beneficio y contar la asistencia por artista, conforme a la Ley 1581 de 2012. Puedes consultar, actualizar o pedir que se eliminen tus datos en cualquier momento. <i>(Texto de ejemplo para la demo.)</i>
                  </div>
                )}
                <label className="ev-check">
                  <input type="checkbox" checked={fs.acepta} onChange={(e) => setFs({ ...fs, acepta: e.target.checked })} />
                  <span>Autorizo el tratamiento de mis datos personales según la política de tratamiento de datos. *</span>
                </label>
                {errS.map((e) => (
                  <p key={e} className="ev-err">{e}</p>
                ))}
                <button className="hk-btn hk-btn-primary" onClick={registrar}>Obtener mi QR</button>
              </div>
            ) : (
              <div className="ev-again">
                <button className="hk-btn hk-btn-sm" onClick={() => { setMiReg(null); setFs({ nombre: "", email: "", celular: "", acepta: false }); }}>
                  + Registrar otro seguidor
                </button>
                <button className="hk-btn hk-btn-sm hk-btn-ghost" onClick={() => simularSeguidores(5)}>Simular 5 seguidores más</button>
              </div>
            )}
          </div>
          <div className="ev-out">
            {miReg ? (
              <div className="ev-card ev-ticket ev-pop">
                {miReg.repetido ? <p className="ev-info">Ya estabas registrado con este correo. Este es tu QR.</p> : <p className="ev-ok">¡Listo, {miReg.reg.nombre.split(" ")[0]}! Este es tu QR personal.</p>}
                {!miReg.repetido && <p className="ev-mail">📧 También te lo enviamos a <b>{miReg.reg.email}</b>.</p>}
                <QrImg text={`QREV:${miReg.reg.id}`} size={190} />
                <span className="ev-code">Código: <b>{miReg.reg.id}</b></span>
                <div className="ev-actions">
                  <button className="hk-btn hk-btn-sm" onClick={() => download(`QREV:${miReg.reg.id}`, `mi_qr_${miReg.reg.id}.png`)}>↓ Descargar mi QR</button>
                  <button className="hk-btn hk-btn-cyan hk-btn-sm" onClick={() => setTab(3)}>Ir a la puerta →</button>
                </div>
                <small>Es personal: solo sirve para un ingreso.</small>
              </div>
            ) : (
              <div className="ev-card ev-empty">
                <div className="ev-ghost-qr" aria-hidden="true" />
                <p>Aquí aparecerá el QR personal del seguidor.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ---------------- 3 · Puerta ---------------- */}
      {tab === 3 && (
        <div className="dm-panel">
          <div className="ev-door">
            <div>
              <h3 className="ev-h">🚪 Puerta · {EVENTO}</h3>
              <p className="dm-muted">En el evento, el portero escanea con la cámara del celular. Aquí toca un pase para “escanearlo”, o escribe un código.</p>
              <div className="ev-passes">
                {pases.map((r) => (
                  <button key={r.id} className={`ev-pass ${r.mine ? "mine" : ""} ${r.checkin ? "used" : ""}`} onClick={() => validar(`QREV:${r.id}`)}>
                    <QrImg text={`QREV:${r.id}`} size={54} />
                    <span>
                      <b>{r.nombre}</b>
                      <small>{r.artista}{r.evento !== EVENTO ? " · otro evento" : ""}</small>
                      {r.mine && <i>Tuyo</i>}
                    </span>
                  </button>
                ))}
              </div>
              <form className="ev-manual" onSubmit={(e) => { e.preventDefault(); if (codigo.trim()) { validar(codigo); setCodigo(""); } }}>
                <input value={codigo} onChange={(e) => setCodigo(e.target.value)} placeholder="Código del QR, ej. F5MZJ7PVHP" maxLength={20} aria-label="Código del QR" />
                <button className="hk-btn hk-btn-primary hk-btn-sm" type="submit">Validar</button>
              </form>
            </div>

            <div className={`ev-result ${res ? "r-" + res.estado : ""}`} aria-live="polite">
              {!res && (
                <>
                  <div className="ev-scan" aria-hidden="true"><i /></div>
                  <p>Esperando un QR…</p>
                </>
              )}
              {res?.estado === "OK" && (
                <>
                  <b>✅ Bienvenido/a, {res.reg.nombre}</b>
                  <span>Viene por <strong>{res.reg.artista}</strong> · código {res.codigo}</span>
                </>
              )}
              {res?.estado === "YA_INGRESO" && (
                <>
                  <b>⛔ Este QR ya ingresó</b>
                  <span>{res.reg.nombre} ({res.reg.artista}) entró a las <strong>{res.reg.checkin}</strong>.</span>
                </>
              )}
              {res?.estado === "OTRO_EVENTO" && (
                <>
                  <b>⚠️ QR de otro evento</b>
                  <span>{res.reg.nombre} está registrado para <strong>{res.reg.evento}</strong>.</span>
                </>
              )}
              {res?.estado === "NO_EXISTE" && (
                <>
                  <b>❌ Código no encontrado</b>
                  <span><code>{res.codigo}</code> no está registrado.</span>
                </>
              )}
              {res?.estado === "INVALIDO" && <b>❌ Este QR no es de QR Eventos</b>}
            </div>
          </div>

          <div className="ev-summary">
            <div className="ev-sum-head">
              <h4>Asistencia por artista</h4>
              <div className="ev-metrics">
                <div><b>{totIn}</b><span>Ingresaron</span></div>
                <div><b>{totReg}</b><span>Registrados</span></div>
              </div>
            </div>
            <div className="ev-bars">
              {resumen.map((r) => (
                <div key={r.id} className={`ev-bar ${r.mine ? "mine" : ""}`}>
                  <span className="ev-bar-name">{r.artista} {r.mine && <i>Tú</i>}<small>{r.red}</small></span>
                  <div className="ev-bar-track">
                    <div className="reg" style={{ width: `${(r.registrados / maxReg) * 100}%` }} />
                    <div className="in" style={{ width: `${(r.ingresaron / maxReg) * 100}%` }} />
                  </div>
                  <span className="ev-bar-num"><b>{r.ingresaron}</b> / {r.registrados}</span>
                </div>
              ))}
            </div>
            <div className="ev-legend"><span className="in" /> Ingresaron <span className="reg" /> Registrados</div>
          </div>
          <div className="dm-bottom">
            <button className="hk-btn hk-btn-ghost" onClick={() => { setData(seed()); setMiInv(null); setMiReg(null); setRes(null); setTab(1); }}>↺ Reiniciar demo</button>
          </div>
        </div>
      )}
    </div>
  );
}
