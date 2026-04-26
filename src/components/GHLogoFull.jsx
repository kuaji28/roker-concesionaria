/**
 * GHLogoFull — logo vectorial GH Cars (silueta + texto integrado)
 * Usa currentColor → se adapta a dark/light mode automáticamente.
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
      {/* ── Texto GH (grande, itálica) y CARS — se pinta primero ─ */}
      <text
        x="5" y="230"
        fontFamily="'Arial Black','Impact','Arial Bold',sans-serif"
        fontWeight="900"
        fontStyle="italic"
        fontSize="100"
        fill="currentColor"
        letterSpacing="-5"
      >GH</text>
      <text
        x="200" y="228"
        fontFamily="'Arial','Helvetica Neue',sans-serif"
        fontWeight="700"
        fontSize="72"
        fill="currentColor"
        letterSpacing="4"
      >CARS</text>

      {/* ── Silueta del auto — pintada ENCIMA del texto ─────────── */}

      {/* Perfil superior (capot → parabrisas → techo → luneta → baúl) */}
      <path
        d="
          M 2 175
          C 8 168 16 160 26 152
          L 42 142
          L 62 134
          L 80 128
          C 90 110 105 95 120 86
          C 132 79 146 76 162 75
          L 218 74
          C 232 74 244 77 254 83
          C 264 89 272 98 278 110
          L 292 132
          C 302 148 312 163 320 175
        "
        stroke="currentColor"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />

      {/* Línea inferior del cuerpo (umbral de puertas) */}
      <path
        d="M 2 175 L 320 175"
        stroke="currentColor"
        strokeWidth="3.5"
        strokeLinecap="round"
        fill="none"
      />

      {/* Ventanilla lateral / interior de techo */}
      <path
        d="
          M 82 128
          L 100 105
          C 112 94 128 88 148 87
          L 210 86
          C 224 86 236 89 246 96
          L 274 115
        "
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        opacity="0.9"
      />

      {/* Arco rueda delantera */}
      <path
        d="M 36 175 C 36 155 72 155 72 175"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        fill="none"
      />

      {/* Arco rueda trasera */}
      <path
        d="M 254 175 C 254 155 290 155 290 175"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  )
}
