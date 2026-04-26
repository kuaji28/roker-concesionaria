/**
 * GHLogoFull — logo vectorial GH Cars (auto deportivo + GH CARS)
 * Usa currentColor → se adapta a dark/light mode automáticamente.
 * Basado en el logo real: coupe deportivo de perfil + "GH" bold italic + "CARS" regular.
 */
export default function GHLogoFull({ width = 240, style }) {
  return (
    <svg
      width={width}
      viewBox="0 0 400 270"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ display: 'block', ...style }}
    >
      {/* ── Texto — se dibuja PRIMERO para que el auto quede encima ─ */}
      <text
        x="4" y="258"
        fontFamily="'Arial Black','Arial Bold',sans-serif"
        fontWeight="900"
        fontStyle="italic"
        fontSize="102"
        fill="currentColor"
        letterSpacing="-4"
      >GH</text>
      <text
        x="198" y="252"
        fontFamily="'Arial','Helvetica Neue',sans-serif"
        fontWeight="600"
        fontSize="72"
        fill="currentColor"
        letterSpacing="6"
      >CARS</text>

      {/* ── Auto deportivo — perfil lateral (coupe moderno) ────────── */}

      {/* Silueta principal: capó → parabrisas → techo → luneta → baúl */}
      <path
        d="
          M 8 192
          L 8 164
          C 14 144 28 126 52 114
          L 84 102
          C 100 86 118 76 140 70
          L 168 58
          C 186 52 206 50 228 50
          L 258 50
          C 278 50 296 56 312 68
          C 324 80 332 100 334 126
          L 336 162
          C 336 180 334 190 330 194
        "
        stroke="currentColor"
        strokeWidth="5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />

      {/* Línea inferior con arcos de ruedas */}
      <path d="M 8 192 L 42 192" stroke="currentColor" strokeWidth="5" strokeLinecap="round" fill="none" />
      <path d="M 42 192 A 34 20 0 0 1 110 192" stroke="currentColor" strokeWidth="5" strokeLinecap="round" fill="none" />
      <path d="M 110 192 L 246 192" stroke="currentColor" strokeWidth="5" strokeLinecap="round" fill="none" />
      <path d="M 246 192 A 34 20 0 0 1 314 192" stroke="currentColor" strokeWidth="5" strokeLinecap="round" fill="none" />
      <path d="M 314 192 L 330 192" stroke="currentColor" strokeWidth="5" strokeLinecap="round" fill="none" />

      {/* Habitáculo / ventanilla lateral */}
      <path
        d="
          M 144 72
          L 170 59
          C 188 52 208 50 230 50
          L 258 50
          C 276 50 294 56 310 68
          L 326 108
          C 294 122 258 128 226 128
          C 192 128 160 122 140 110
          Z
        "
        stroke="currentColor"
        strokeWidth="3"
        strokeLinejoin="round"
        fill="none"
      />

      {/* Línea de capó (detalle deportivo) */}
      <path
        d="M 52 114 C 68 106 84 102 100 98"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        fill="none"
      />

      {/* Línea de cintura / body line */}
      <path
        d="M 8 164 C 40 160 80 156 120 154 C 180 152 240 152 300 156 L 334 162"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        fill="none"
        opacity="0.5"
      />
    </svg>
  )
}
