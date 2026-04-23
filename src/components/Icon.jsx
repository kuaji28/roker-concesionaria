export default function Icon({ name, size = 18, className, style }) {
  return (
    <svg
      width={size} height={size}
      className={className}
      style={{ stroke: 'currentColor', strokeWidth: 1.5, fill: 'none', strokeLinecap: 'round', strokeLinejoin: 'round', flexShrink: 0, ...style }}
    >
      <use href={`#i-${name}`} />
    </svg>
  )
}
