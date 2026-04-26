/**
 * GHLogo — ícono compacto de GH Cars para sidebar y nav.
 * Auto deportivo de perfil en outline, sin fondo de color.
 * Usa currentColor → se adapta a dark/light mode.
 */
export default function GHLogo({ size = 36, style }) {
  // Aspect ratio del logo: 44:28 (ancho:alto)
  const w = Math.round(size * 44 / 28)
  const h = size
  return (
    <svg
      width={w}
      height={h}
      viewBox="0 0 44 28"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ display: 'block', flexShrink: 0, ...style }}
    >
      {/* Silueta auto deportivo compacta */}
      <path
        d="
          M 1 22
          L 1 18
          C 2 15 4.5 12.5 8 11
          L 13 9
          C 15 7 17.5 6 20.5 6
          L 27 6
          C 30 6 33 7 35.5 9.5
          C 37.5 12 39 15.5 39.5 19
          L 40 22
        "
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />

      {/* Línea inferior con arcos de ruedas */}
      <path d="M 1 22 L 5 22" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" fill="none" />
      <path d="M 5 22 A 4.5 2.8 0 0 1 14 22" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" fill="none" />
      <path d="M 14 22 L 28 22" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" fill="none" />
      <path d="M 28 22 A 4.5 2.8 0 0 1 37 22" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" fill="none" />
      <path d="M 37 22 L 40 22" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" fill="none" />

      {/* Ventanilla */}
      <path
        d="M 14.5 9.5 L 20.5 6 L 27 6 C 30 6 33 7 35.5 9.5 L 37 14
           C 31 16 24 17 18 15.5 Z"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  )
}
