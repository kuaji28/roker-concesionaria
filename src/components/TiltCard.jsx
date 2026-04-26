import React, { useRef, useState } from 'react'

export default function TiltCard({ children, style, className, intensity = 1 }) {
  const ref = useRef(null)
  const [t, setT] = useState({ rx: 0, ry: 0, mx: 50, my: 50, hover: false })

  function handleMove(e) {
    const el = ref.current
    if (!el) return
    const r = el.getBoundingClientRect()
    const x = (e.clientX - r.left) / r.width
    const y = (e.clientY - r.top) / r.height
    setT({
      rx: (0.5 - y) * 10 * intensity,
      ry: (x - 0.5) * 12 * intensity,
      mx: x * 100,
      my: y * 100,
      hover: true,
    })
  }

  function handleLeave() {
    setT({ rx: 0, ry: 0, mx: 50, my: 50, hover: false })
  }

  return (
    <div
      ref={ref}
      className={className}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      style={{
        ...style,
        transform: `perspective(900px) rotateX(${t.rx}deg) rotateY(${t.ry}deg) scale(${t.hover ? 1.015 : 1})`,
        transition: 'transform .18s ease-out',
        transformStyle: 'preserve-3d',
        position: 'relative',
        willChange: 'transform',
      }}
    >
      {children}
      <div style={{
        position: 'absolute', inset: 0, borderRadius: 'inherit', pointerEvents: 'none',
        background: `radial-gradient(circle at ${t.mx}% ${t.my}%, rgba(255,255,255,.15), transparent 50%)`,
        opacity: t.hover ? 1 : 0,
        transition: 'opacity .25s',
        mixBlendMode: 'overlay',
      }} />
    </div>
  )
}
