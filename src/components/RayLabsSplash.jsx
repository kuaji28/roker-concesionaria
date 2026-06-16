import React, { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'

// Boot/splash cinematográfico RAY LABS (estilo PS5) sobre el LOGO REAL, ANIMADO de verdad.
// Versión CarHub — sin framer-motion, sin BRAND import.
const ATOM = '/brand/raylabs-atom.svg'
const TEXT = '/brand/raylabs-text.svg'
const GOLD = '#FDBA02'
const BOLT_D = 'M 754.621094 550.9375 L 918.804688 256.414062 L 607.863281 617.722656 L 772.054688 617.722656 L 607.863281 912.246094 L 918.804688 550.9375 L 754.621094 550.9375 Z'

if (typeof window !== 'undefined') { try { [ATOM, TEXT].forEach(s => { const i = new Image(); i.src = s }) } catch {} }

// ¿Mostrar el splash en este arranque? PURA (sin efectos) → segura para useState initializer.
// Rutas públicas de CarHub (/p/, /login) no muestran el splash.
export function shouldShowBoot() {
  if (typeof window === 'undefined') return false
  const p = window.location.pathname
  if (p.startsWith('/p/') || p === '/login') return false
  if (new URLSearchParams(window.location.search).get('raylabsSplash') === '1') return true
  try { return window.sessionStorage.getItem('raylabs_startup_splash_seen_v4') !== '1' } catch { return true }
}

let _actx = null
function playBoot() {
  try {
    if (typeof window === 'undefined') return
    if (window.localStorage?.getItem('raylabs_splash_sound') === 'off') return
    const AC = window.AudioContext || window.webkitAudioContext
    if (!AC) return
    _actx = _actx || new AC()
    const ctx = _actx
    if (ctx.state === 'suspended') ctx.resume().catch(() => {})
    const master = ctx.createGain(); master.gain.value = 0.7; master.connect(ctx.destination)
    const t0 = ctx.currentTime + 0.05
    const ramp = (p, v, t) => p.exponentialRampToValueAtTime(Math.max(v, 0.00001), t)
    const sw = ctx.createOscillator(); sw.type = 'triangle'
    const lp = ctx.createBiquadFilter(); lp.type = 'lowpass'; const sg = ctx.createGain()
    sw.connect(lp); lp.connect(sg); sg.connect(master)
    sw.frequency.setValueAtTime(110, t0); ramp(sw.frequency, 540, t0 + 0.9)
    lp.frequency.setValueAtTime(300, t0); ramp(lp.frequency, 3200, t0 + 0.95)
    sg.gain.setValueAtTime(0.0001, t0); ramp(sg.gain, 0.16, t0 + 0.72); ramp(sg.gain, 0.0006, t0 + 1.25)
    sw.start(t0); sw.stop(t0 + 1.32)
    const bm = ctx.createOscillator(); bm.type = 'sine'; const bg = ctx.createGain()
    bm.connect(bg); bg.connect(master)
    bm.frequency.setValueAtTime(150, t0 + 0.95); ramp(bm.frequency, 54, t0 + 1.5)
    bg.gain.setValueAtTime(0.0001, t0 + 0.95); ramp(bg.gain, 0.22, t0 + 1.02); ramp(bg.gain, 0.0005, t0 + 1.7)
    bm.start(t0 + 0.95); bm.stop(t0 + 1.75)
    const zp = ctx.createOscillator(); zp.type = 'square'
    const hp = ctx.createBiquadFilter(); hp.type = 'highpass'; hp.frequency.value = 900; const zg = ctx.createGain()
    zp.connect(hp); hp.connect(zg); zg.connect(master)
    zp.frequency.setValueAtTime(2400, t0 + 1.0); ramp(zp.frequency, 700, t0 + 1.12)
    zg.gain.setValueAtTime(0.0001, t0 + 1.0); ramp(zg.gain, 0.06, t0 + 1.02); ramp(zg.gain, 0.0004, t0 + 1.18)
    zp.start(t0 + 1.0); zp.stop(t0 + 1.2)
    ;[[660, 0.08], [990, 0.05]].forEach(([f, peak]) => {
      const o = ctx.createOscillator(); o.type = 'sine'; const g = ctx.createGain()
      o.connect(g); g.connect(master)
      const ts = t0 + 1.42; o.frequency.value = f
      g.gain.setValueAtTime(0.0001, ts); ramp(g.gain, peak, ts + 0.04); ramp(g.gain, 0.0004, ts + 0.9)
      o.start(ts); o.stop(ts + 0.95)
    })
  } catch {}
}

export default function RayLabsSplash({ onDone, duration = 3600 }) {
  const [closing, setClosing] = useState(false)
  const reduce = typeof window !== 'undefined' && !!window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches

  useEffect(() => {
    try { window.sessionStorage.setItem('raylabs_startup_splash_seen_v4', '1') } catch {}
    if (!reduce) playBoot()
    const force = typeof window !== 'undefined' && new URLSearchParams(window.location.search).get('raylabsSplash') === '1'
    const ms = reduce ? 1100 : (force ? 9000 : duration)
    const t1 = setTimeout(() => setClosing(true), ms)
    const t2 = setTimeout(() => onDone && onDone(), ms + 480)
    return () => { clearTimeout(t1); clearTimeout(t2) }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (typeof document === 'undefined') return null
  const skip = () => { setClosing(true); setTimeout(() => onDone && onDone(), 480) }

  return createPortal(
    <div className={'rlb-boot' + (closing ? ' rlb-out' : '')} data-reduce={reduce ? '1' : '0'}
         onClick={skip} role="presentation" aria-label="RAY LABS">
      <style>{RLB_CSS}</style>
      <span className="rlb-rays" aria-hidden="true" />
      <span className="rlb-core" aria-hidden="true" />
      <span className="rlb-flash" aria-hidden="true" />
      <div className="rlb-logo-wrap">
        <img className="rlb-text" src={TEXT} alt="RAY LABS" draggable="false" />
        <img className="rlb-atom" src={ATOM} alt="" draggable="false" />
        <div className="rlb-orbits" aria-hidden="true">
          <div className="rlb-arm a1"><span className="rlb-dot" /></div>
          <div className="rlb-arm a2"><span className="rlb-dot" /></div>
          <div className="rlb-arm a3"><span className="rlb-dot" /></div>
        </div>
        <svg className="rlb-bolt" viewBox="0 0 1500 1500" aria-hidden="true"><path d={BOLT_D} fill={GOLD} /></svg>
      </div>
    </div>,
    document.body
  )
}

const RLB_CSS = `
@property --rev { syntax:'<percentage>'; inherits:false; initial-value:0%; }
.rlb-boot { position:fixed; inset:0; z-index:12000; overflow:hidden; cursor:pointer;
  height:var(--app-height,100dvh); background:#000;
  display:flex; align-items:center; justify-content:center;
  opacity:0; animation: rlbBootIn .4s ease forwards; }
.rlb-boot.rlb-out { animation: rlbBootOut .46s ease forwards; }
.rlb-core, .rlb-rays, .rlb-flash { position:absolute; left:50%; top:50%; transform:translate(-50%,-50%);
  pointer-events:none; mix-blend-mode:screen; }
.rlb-core { width:46vmin; height:46vmin; border-radius:50%; filter:blur(6px); opacity:0;
  background:radial-gradient(circle, rgba(255,255,255,.95), rgba(253,186,2,.55) 32%, rgba(253,186,2,0) 70%);
  animation: rlbCore 1.7s ease-out .05s both; }
.rlb-rays { width:170vmax; height:170vmax; opacity:0; border-radius:50%;
  background:repeating-conic-gradient(from 0deg, rgba(253,186,2,.12) 0deg 1.6deg, transparent 1.6deg 13deg);
  -webkit-mask:radial-gradient(circle,#000 6%,rgba(0,0,0,0) 40%); mask:radial-gradient(circle,#000 6%,rgba(0,0,0,0) 40%);
  animation: rlbRays 3.6s ease-out .2s both, rlbSpin 26s linear infinite; will-change:transform,opacity; }
.rlb-flash { width:140%; height:140%;
  background:radial-gradient(circle,#fff,rgba(255,255,255,.5) 20%,rgba(255,255,255,0) 56%);
  opacity:0; animation: rlbFlash .5s ease-out .5s both; }
.rlb-logo-wrap { position:relative; width:min(88vw,470px); aspect-ratio:1/1; }
.rlb-logo-wrap > * { position:absolute; }
.rlb-text { inset:0; width:100%; height:100%; object-fit:contain; opacity:0;
  animation: rlbFadeUp .9s cubic-bezier(.16,1,.3,1) 1.45s both; }
.rlb-atom { left:34.1%; top:23.6%; width:31.7%; height:34.4%; object-fit:contain; --rev:0%;
  -webkit-mask:conic-gradient(from -90deg, #000 var(--rev), transparent 0);
          mask:conic-gradient(from -90deg, #000 var(--rev), transparent 0);
  animation: rlbDraw 1.7s cubic-bezier(.3,0,.2,1) .75s both; }
.rlb-orbits { left:34.1%; top:23.6%; width:31.7%; height:34.4%; }
.rlb-arm { position:absolute; inset:0; transform:rotate(var(--base,0deg)); opacity:0; will-change:transform;
  animation: rlbOrbit 1.7s cubic-bezier(.3,0,.2,1) .75s forwards, rlbDotIO 1.7s ease .75s forwards; }
.rlb-arm.a1 { --base:0deg; } .rlb-arm.a2 { --base:120deg; } .rlb-arm.a3 { --base:240deg; }
/* ESTELA (cola de cometa): anillo conic que se desvanece DETRÁS del punto (transparente lejos
   → oro en la cabeza). Enmascarado a una línea fina; gira junto al brazo = el punto "arrastra
   la línea" mientras orbita. Esto es lo que pidió Roker. */
.rlb-arm::before { content:''; position:absolute; inset:0; border-radius:50%;
  background:conic-gradient(from 0deg,
    rgba(253,186,2,0) 0deg, rgba(253,186,2,0) 286deg,
    rgba(253,186,2,.12) 312deg, rgba(253,186,2,.5) 342deg, #FFE08A 358deg, #fff 360deg);
  -webkit-mask:radial-gradient(circle, transparent 0 46%, #000 48.4%, #000 49.6%, transparent 52%);
          mask:radial-gradient(circle, transparent 0 46%, #000 48.4%, #000 49.6%, transparent 52%);
  filter:drop-shadow(0 0 2px rgba(253,186,2,.65)); }
/* PUNTO = cabeza del cometa, en lo alto del anillo (12 h = 0deg del conic, alineado con la estela). */
.rlb-dot { position:absolute; left:50%; top:0; width:7%; aspect-ratio:1; margin-left:-3.5%; transform:translateY(-50%);
  border-radius:50%; background:radial-gradient(circle at 38% 34%, #fff, #FFE08A 58%, #FDBA02);
  box-shadow:0 0 7px #fff, 0 0 15px rgba(253,186,2,.95), 0 0 28px rgba(253,186,2,.55); }
.rlb-bolt { inset:0; width:100%; height:100%; overflow:visible; opacity:0;
  transform-box:fill-box; transform-origin:50% 0%;
  filter:drop-shadow(0 0 14px rgba(253,186,2,.9)) drop-shadow(0 0 30px rgba(253,186,2,.45));
  animation: rlbBolt .5s cubic-bezier(.2,.9,.25,1) .2s forwards, rlbFlick .1s steps(2) .62s 4, rlbBoltGlow 2.8s ease-in-out 1.0s both; }

@keyframes rlbBootIn { to { opacity:1 } }
@keyframes rlbBootOut { 0%{opacity:1; transform:scale(1)} 100%{opacity:0; transform:scale(1.04)} }
@keyframes rlbCore { 0%{opacity:0;transform:translate(-50%,-50%) scale(.3)} 45%{opacity:1} 100%{opacity:0;transform:translate(-50%,-50%) scale(1.45)} }
@keyframes rlbRays { 0%{opacity:0} 32%{opacity:.7} 100%{opacity:0} }
@keyframes rlbSpin { to{transform:rotate(360deg)} }
@keyframes rlbFlash { 0%{opacity:0} 16%{opacity:.95} 100%{opacity:0} }
@keyframes rlbDraw { to { --rev:100% } }
@keyframes rlbOrbit { from{transform:rotate(var(--base,0deg))} to{transform:rotate(calc(var(--base,0deg) + 600deg))} }
@keyframes rlbDotIO { 0%{opacity:0} 12%{opacity:1} 80%{opacity:1} 100%{opacity:0} }
@keyframes rlbFadeUp { 0%{opacity:0; transform:translateY(14px)} 100%{opacity:1; transform:none} }
@keyframes rlbBolt { 0%{opacity:0; transform:scaleY(.04)} 35%{opacity:1} 100%{opacity:1; transform:scaleY(1)} }
@keyframes rlbFlick { 0%,100%{filter:drop-shadow(0 0 14px rgba(253,186,2,.9)) drop-shadow(0 0 30px rgba(253,186,2,.45))}
  50%{filter:drop-shadow(0 0 22px #fff) drop-shadow(0 0 40px rgba(253,186,2,.9))} }
@keyframes rlbBoltGlow { 0%,100%{filter:drop-shadow(0 0 6px rgba(253,186,2,.5))} 50%{filter:drop-shadow(0 0 18px rgba(253,186,2,.85))} }

.rlb-boot[data-reduce="1"] .rlb-rays,
.rlb-boot[data-reduce="1"] .rlb-core,
.rlb-boot[data-reduce="1"] .rlb-flash,
.rlb-boot[data-reduce="1"] .rlb-orbits { display:none; }
.rlb-boot[data-reduce="1"] .rlb-atom { --rev:100%; -webkit-mask:none; mask:none; animation:rlbFadeUp .5s ease-out both; }
.rlb-boot[data-reduce="1"] .rlb-text { animation:rlbFadeUp .5s ease-out both; }
.rlb-boot[data-reduce="1"] .rlb-bolt { opacity:1; transform:none; animation:none; filter:drop-shadow(0 0 8px rgba(253,186,2,.6)); }
`
