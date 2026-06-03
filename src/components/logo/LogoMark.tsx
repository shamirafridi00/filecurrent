export function LogoMark({ size = 32 }: { size?: number }) {
  const r = size / 40
  return (
    <svg width={size} height={size} viewBox="0 0 40 40"
      fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="40" height="40" rx={Math.round(8 * r + 0.5)}
        fill="#0A2540"/>
      <path
        d="M9 22.5 L16 31 Q19 35 23 27 L31 11"
        stroke="white"
        strokeWidth={3.8 * r}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  )
}

export function LogoMarkOnDark({ size = 32 }: { size?: number }) {
  const r = size / 40
  return (
    <svg width={size} height={size} viewBox="0 0 40 40"
      fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="40" height="40" rx={Math.round(8 * r + 0.5)}
        fill="#1A3A5C"/>
      <path
        d="M9 22.5 L16 31 Q19 35 23 27 L31 11"
        stroke="white"
        strokeWidth={3.8 * r}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  )
}

export function LogoFull({
  className,
  size = 30,
}: {
  className?: string
  size?: number
}) {
  return (
    <div className={`flex items-center gap-2.5 ${className ?? ''}`}>
      <LogoMark size={size} />
      <span style={{
        fontWeight: 700,
        fontSize: 15,
        letterSpacing: '-0.3px',
        color: '#0A2540',
      }}>
        FileCurrent
      </span>
    </div>
  )
}

export function LogoFullInverse({
  className,
  size = 30,
}: {
  className?: string
  size?: number
}) {
  return (
    <div className={`flex items-center gap-2.5 ${className ?? ''}`}>
      <LogoMarkOnDark size={size} />
      <span style={{
        fontWeight: 700,
        fontSize: 15,
        letterSpacing: '-0.3px',
        color: '#ffffff',
      }}>
        FileCurrent
      </span>
    </div>
  )
}
