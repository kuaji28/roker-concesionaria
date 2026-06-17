import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'

const RL_CSS = `
.rl-boot{position:fixed;inset:0;z-index:9999;background:#0d0e11;display:flex;align-items:center;justify-content:center;cursor:pointer;--acc:#FDBA02;--acc-glow:rgba(253,186,2,.75);--acc-soft:rgba(253,186,2,.18)}
.rl-boot[data-reduce] *{animation-duration:.01ms !important;animation-iteration-count:1 !important;transition-duration:.01ms !important}
.rl-grid{position:fixed;inset:0;pointer-events:none;background-image:radial-gradient(rgba(255,255,255,.04) 1px,transparent 1px);background-size:36px 36px;-webkit-mask-image:radial-gradient(circle at 50% 48%,#000,transparent 70%);mask-image:radial-gradient(circle at 50% 48%,#000,transparent 70%);opacity:.5}
.rl-vig{position:fixed;inset:0;pointer-events:none;background:radial-gradient(circle at 50% 48%,transparent 50%,rgba(0,0,0,.6) 100%)}
.rl-stage{display:flex;flex-direction:column;align-items:center}
.rl-mark{position:relative;width:min(64vmin,340px);aspect-ratio:420/547}
.rl-mark>*{position:absolute}
.rl-glow{left:50%;top:49%;width:150%;height:150%;border-radius:50%;background:radial-gradient(circle,var(--acc-soft),transparent 62%);filter:blur(16px);animation:rlGlowPulse 4.6s ease-in-out 4.4s infinite}
.rl-finalflash{left:50%;top:49%;width:120%;height:120%;border-radius:50%;background:radial-gradient(circle,#fff,var(--acc) 34%,transparent 66%);mix-blend-mode:screen;animation:rlFinalFlash 1.5s ease-out 3.9s both}
.rl-bolt{inset:0;width:100%;height:100%;object-fit:contain;transform-origin:center center;animation:rlBoltDrop 1s cubic-bezier(.18,.86,.24,1) both}
.rl-orbit{inset:0;width:100%;height:100%;animation:rlOrbitLife 4.4s linear both}
.rl-orbit svg{width:100%;height:100%;overflow:visible}
.rl-atom{inset:0;width:100%;height:100%;object-fit:contain;transform-origin:center center;animation:rlAtomPop .6s cubic-bezier(.2,1.3,.3,1) 3.95s both}
.rl-flash{left:50%;top:49%;width:52%;height:52%;border-radius:50%;background:radial-gradient(circle,#fff,var(--acc) 36%,transparent 70%);animation:rlImpactFlash .78s ease-out .48s both}
.rl-shock{left:50%;top:49%;width:30%;height:30%;border-radius:50%;border:2px solid var(--acc);box-shadow:0 0 22px var(--acc-glow);animation:rlShock 1.05s cubic-bezier(.2,.7,.3,1) .5s both}
.rl-shock2{left:50%;top:49%;width:30%;height:30%;border-radius:50%;border:1.5px solid rgba(255,255,255,.6);animation:rlShock2 1.2s cubic-bezier(.2,.7,.3,1) .54s both}
.rl-word{width:min(76vmin,400px);height:auto;margin-top:26px;animation:rlWordIn .9s cubic-bezier(.16,1,.3,1) 4.35s both}
@keyframes rlBoltDrop{0%{opacity:0;transform:translateY(-300px) scale(2.6) rotate(-12deg);filter:blur(18px)}44%{opacity:1;filter:blur(0)}60%{transform:translateY(20px) scale(.88) rotate(3deg)}76%{transform:translateY(-9px) scale(1.07) rotate(-1.4deg)}90%{transform:translateY(3px) scale(.99) rotate(.4deg)}100%{opacity:1;transform:translateY(0) scale(1) rotate(0);filter:blur(0) drop-shadow(0 0 22px var(--acc-glow))}}
@keyframes rlImpactFlash{0%{opacity:0;transform:translate(-50%,-50%) scale(.25)}28%{opacity:1}100%{opacity:0;transform:translate(-50%,-50%) scale(2.9)}}
@keyframes rlShock{0%{opacity:0;transform:translate(-50%,-50%) scale(.2)}12%{opacity:.9}100%{opacity:0;transform:translate(-50%,-50%) scale(3.8)}}
@keyframes rlShock2{0%{opacity:0;transform:translate(-50%,-50%) scale(.2)}18%{opacity:.55}100%{opacity:0;transform:translate(-50%,-50%) scale(2.7)}}
@keyframes rlOrbitLife{0%{opacity:0}18%{opacity:0}27%{opacity:1}84%{opacity:1}97%{opacity:0}100%{opacity:0}}
@keyframes rlAtomPop{0%{opacity:0;transform:scale(1.16) rotate(-3deg)}55%{opacity:1}100%{opacity:1;transform:scale(1) rotate(0)}}
@keyframes rlFinalFlash{0%{opacity:0;transform:translate(-50%,-50%) scale(.4)}38%{opacity:.95}100%{opacity:0;transform:translate(-50%,-50%) scale(2.4)}}
@keyframes rlGlowPulse{0%,100%{opacity:.42;transform:translate(-50%,-50%) scale(1)}50%{opacity:.8;transform:translate(-50%,-50%) scale(1.12)}}
@keyframes rlWordIn{0%{opacity:0;transform:translateY(22px);filter:blur(8px)}100%{opacity:1;transform:translateY(0);filter:blur(0)}}
`

const ORBIT_SVG = `<svg viewBox="0 0 420 547" xmlns="http://www.w3.org/2000/svg">
<g transform="rotate(20 210 270)">
  <path id="eo1" d="M60 270 a150 58 0 1 0 300 0 a150 58 0 1 0 -300 0" fill="none" stroke="#fff" stroke-width="1.2" opacity=".14"/>
  <g style="filter:blur(2.6px)"><circle r="4.51" fill="#fff" opacity="0.416"><animateMotion dur="2.667s" begin="0.930s" repeatCount="indefinite"><mpath href="#eo1"/></animateMotion></circle><circle r="3.82" fill="#fff" opacity="0.334"><animateMotion dur="2.667s" begin="0.960s" repeatCount="indefinite"><mpath href="#eo1"/></animateMotion></circle><circle r="3.13" fill="#fff" opacity="0.255"><animateMotion dur="2.667s" begin="0.990s" repeatCount="indefinite"><mpath href="#eo1"/></animateMotion></circle><circle r="2.44" fill="#fff" opacity="0.181"><animateMotion dur="2.667s" begin="1.020s" repeatCount="indefinite"><mpath href="#eo1"/></animateMotion></circle><circle r="1.75" fill="#fff" opacity="0.111"><animateMotion dur="2.667s" begin="1.050s" repeatCount="indefinite"><mpath href="#eo1"/></animateMotion></circle><circle r="1.05" fill="#fff" opacity="0.048"><animateMotion dur="2.667s" begin="1.080s" repeatCount="indefinite"><mpath href="#eo1"/></animateMotion></circle></g>
  <circle r="5.2" fill="var(--acc)" style="filter:drop-shadow(0 0 9px var(--acc-glow))"><animateMotion dur="2.667s" begin="0.900s" repeatCount="indefinite"><mpath href="#eo1"/></animateMotion></circle>
  <circle r="2.2" fill="#fff"><animateMotion dur="2.667s" begin="0.900s" repeatCount="indefinite"><mpath href="#eo1"/></animateMotion></circle>
</g>
<g transform="rotate(85 210 270)">
  <path id="eo2" d="M60 270 a150 58 0 1 0 300 0 a150 58 0 1 0 -300 0" fill="none" stroke="#fff" stroke-width="1.2" opacity=".14"/>
  <g style="filter:blur(2.6px)"><circle r="4.51" fill="#fff" opacity="0.416"><animateMotion dur="3.167s" begin="1.030s" repeatCount="indefinite"><mpath href="#eo2"/></animateMotion></circle><circle r="3.82" fill="#fff" opacity="0.334"><animateMotion dur="3.167s" begin="1.060s" repeatCount="indefinite"><mpath href="#eo2"/></animateMotion></circle><circle r="3.13" fill="#fff" opacity="0.255"><animateMotion dur="3.167s" begin="1.090s" repeatCount="indefinite"><mpath href="#eo2"/></animateMotion></circle><circle r="2.44" fill="#fff" opacity="0.181"><animateMotion dur="3.167s" begin="1.120s" repeatCount="indefinite"><mpath href="#eo2"/></animateMotion></circle><circle r="1.75" fill="#fff" opacity="0.111"><animateMotion dur="3.167s" begin="1.150s" repeatCount="indefinite"><mpath href="#eo2"/></animateMotion></circle><circle r="1.05" fill="#fff" opacity="0.048"><animateMotion dur="3.167s" begin="1.180s" repeatCount="indefinite"><mpath href="#eo2"/></animateMotion></circle></g>
  <circle r="5.2" fill="var(--acc)" style="filter:drop-shadow(0 0 9px var(--acc-glow))"><animateMotion dur="3.167s" begin="1.000s" repeatCount="indefinite"><mpath href="#eo2"/></animateMotion></circle>
  <circle r="2.2" fill="#fff"><animateMotion dur="3.167s" begin="1.000s" repeatCount="indefinite"><mpath href="#eo2"/></animateMotion></circle>
</g>
<g transform="rotate(145 210 270)">
  <path id="eo3" d="M60 270 a150 58 0 1 0 300 0 a150 58 0 1 0 -300 0" fill="none" stroke="#fff" stroke-width="1.2" opacity=".14"/>
  <g style="filter:blur(2.6px)"><circle r="4.51" fill="#fff" opacity="0.416"><animateMotion dur="2.889s" begin="1.130s" repeatCount="indefinite"><mpath href="#eo3"/></animateMotion></circle><circle r="3.82" fill="#fff" opacity="0.334"><animateMotion dur="2.889s" begin="1.160s" repeatCount="indefinite"><mpath href="#eo3"/></animateMotion></circle><circle r="3.13" fill="#fff" opacity="0.255"><animateMotion dur="2.889s" begin="1.190s" repeatCount="indefinite"><mpath href="#eo3"/></animateMotion></circle><circle r="2.44" fill="#fff" opacity="0.181"><animateMotion dur="2.889s" begin="1.220s" repeatCount="indefinite"><mpath href="#eo3"/></animateMotion></circle><circle r="1.75" fill="#fff" opacity="0.111"><animateMotion dur="2.889s" begin="1.250s" repeatCount="indefinite"><mpath href="#eo3"/></animateMotion></circle><circle r="1.05" fill="#fff" opacity="0.048"><animateMotion dur="2.889s" begin="1.280s" repeatCount="indefinite"><mpath href="#eo3"/></animateMotion></circle></g>
  <circle r="5.2" fill="var(--acc)" style="filter:drop-shadow(0 0 9px var(--acc-glow))"><animateMotion dur="2.889s" begin="1.100s" repeatCount="indefinite"><mpath href="#eo3"/></animateMotion></circle>
  <circle r="2.2" fill="#fff"><animateMotion dur="2.889s" begin="1.100s" repeatCount="indefinite"><mpath href="#eo3"/></animateMotion></circle>
</g>
</svg>`

// CarHub: skip splash on public catalogue pages and login
export function shouldShowBoot() {
  if (typeof window === 'undefined') return false
  const p = window.location.pathname
  if (p.startsWith('/p/') || p === '/login') return false
  if (new URLSearchParams(window.location.search).get('raylabsSplash') === '1') return true
  try { return !sessionStorage.getItem('raylabs_startup_splash_seen_v4') } catch { return false }
}

function playBoot() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)()
    const osc1 = ctx.createOscillator()
    const gain1 = ctx.createGain()
    osc1.type = 'triangle'
    osc1.frequency.setValueAtTime(120, ctx.currentTime)
    osc1.frequency.exponentialRampToValueAtTime(40, ctx.currentTime + 0.18)
    gain1.gain.setValueAtTime(0.5, ctx.currentTime)
    gain1.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.22)
    osc1.connect(gain1); gain1.connect(ctx.destination)
    osc1.start(ctx.currentTime); osc1.stop(ctx.currentTime + 0.22)

    const osc2 = ctx.createOscillator()
    const gain2 = ctx.createGain()
    osc2.type = 'sine'
    osc2.frequency.setValueAtTime(1800, ctx.currentTime + 0.05)
    osc2.frequency.exponentialRampToValueAtTime(3200, ctx.currentTime + 0.3)
    gain2.gain.setValueAtTime(0, ctx.currentTime + 0.05)
    gain2.gain.linearRampToValueAtTime(0.12, ctx.currentTime + 0.12)
    gain2.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.55)
    osc2.connect(gain2); gain2.connect(ctx.destination)
    osc2.start(ctx.currentTime + 0.05); osc2.stop(ctx.currentTime + 0.55)

    const osc3 = ctx.createOscillator()
    const gain3 = ctx.createGain()
    osc3.type = 'square'
    osc3.frequency.setValueAtTime(220, ctx.currentTime + 3.9)
    osc3.frequency.exponentialRampToValueAtTime(440, ctx.currentTime + 4.3)
    gain3.gain.setValueAtTime(0, ctx.currentTime + 3.9)
    gain3.gain.linearRampToValueAtTime(0.06, ctx.currentTime + 4.1)
    gain3.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 4.6)
    osc3.connect(gain3); gain3.connect(ctx.destination)
    osc3.start(ctx.currentTime + 3.9); osc3.stop(ctx.currentTime + 4.6)
  } catch {}
}

export default function RayLabsSplash({ onDone }) {
  const [visible, setVisible] = useState(shouldShowBoot)
  const reduce = typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

  function dismiss() {
    try { sessionStorage.setItem('raylabs_startup_splash_seen_v4', '1') } catch {}
    setVisible(false)
    onDone?.()
  }

  useEffect(() => {
    if (!visible) return
    playBoot()
    const t = setTimeout(dismiss, 5400)
    return () => clearTimeout(t)
  }, [visible])

  if (!visible) return null

  return createPortal(
    <div className="rl-boot" onClick={dismiss} data-reduce={reduce || undefined} role="dialog" aria-label="RAY LABS splash">
      <style>{RL_CSS}</style>
      <div className="rl-grid" />
      <div className="rl-vig" />
      <div className="rl-stage">
        <div className="rl-mark">
          <div className="rl-glow" />
          <div className="rl-finalflash" />
          <img className="rl-bolt" src="/brand/rl-bolt.png" alt="" draggable={false} />
          <div className="rl-orbit" dangerouslySetInnerHTML={{ __html: ORBIT_SVG }} />
          <img className="rl-atom" src="/brand/rl-atom.png" alt="" draggable={false} />
          <div className="rl-flash" />
          <div className="rl-shock" />
          <div className="rl-shock2" />
        </div>
        <img className="rl-word" src="/brand/rl-word.png" alt="RAY LABS" draggable={false} />
      </div>
    </div>,
    document.body
  )
}
