export default function GHLogo({ size = 36 }) {
  const r = Math.round(size * 0.22)
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ display: 'block', flexShrink: 0 }}
    >
      <rect width="40" height="40" rx={r} fill="var(--c-accent)" />
      {/* G */}
      <text
        x="7"
        y="27"
        fontFamily="system-ui, -apple-system, sans-serif"
        fontWeight="800"
        fontSize="18"
        fill="white"
        letterSpacing="-0.5"
      >GH</text>
    </svg>
  )
}
