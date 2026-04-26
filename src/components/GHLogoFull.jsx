/**
 * GHLogoFull — logo vectorial completo de GH Cars
 * Usa currentColor para adaptarse a dark/light mode.
 * Usar en Login, HomePublica, CatalogoPublico (headers grandes).
 * Para sidebar/topbar usar GHLogo.jsx (icono cuadrado compacto).
 */
export default function GHLogoFull({ width = 220, style }) {
  return (
    <svg
      width={width}
      viewBox="0 0 260 110"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ display: 'block', ...style }}
    >
      {/* ── Silueta del auto ─────────────────────────────────── */}
      {/* Perfil exterior — carrocería */}
      <path
        d="
          M 4 72
          L 14 62
          L 28 55
          C 44 45 62 38 82 33
          L 108 28
          C 124 26 138 25 158 25
          C 174 25 186 26 198 30
          C 210 34 218 41 224 50
          L 234 65
          L 240 72
        "
        stroke="currentColor"
        strokeWidth="2.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      {/* Ventanilla lateral */}
      <path
        d="
          M 48 54
          L 62 40
          C 74 33 92 30 112 29
          L 152 28
          C 168 28 178 30 188 36
          L 200 46
        "
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.55"
        fill="none"
      />
      {/* ── Texto GH ─────────────────────────────────────────── */}
      <text
        x="4"
        y="100"
        fontFamily="'Arial Black', 'Arial Bold', 'Helvetica Neue', sans-serif"
        fontWeight="900"
        fontSize="40"
        fill="currentColor"
        letterSpacing="-1"
        fontStyle="italic"
      >GH</text>
      {/* ── Texto CARS ───────────────────────────────────────── */}
      <text
        x="96"
        y="100"
        fontFamily="'Arial', 'Helvetica Neue', sans-serif"
        fontWeight="700"
        fontSize="32"
        fill="currentColor"
        letterSpacing="3"
      >CARS</text>
    </svg>
  )
}
