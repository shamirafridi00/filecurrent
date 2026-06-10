// FileCurrent logomark — white lightning bolt in a rounded #635BFF square.
// The bolt symbolizes "get paid, move forward" and stays legible at 16px.
const BOLT_PATH = 'M23.5 4.5 L10.5 22.5 L18 22.5 L16.5 35.5 L29.5 17.5 L22 17.5 Z'

export function LogoMark({ size = 32 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40"
      fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="40" height="40" rx="9" fill="#635BFF"/>
      <path d={BOLT_PATH} fill="white" />
    </svg>
  )
}

export function LogoMarkOnDark({ size = 32 }: { size?: number }) {
  // Same mark — the indigo square holds up on dark navy backgrounds.
  return <LogoMark size={size} />
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
        fontWeight: 600,
        fontSize: 15,
        letterSpacing: '-0.02em',
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
        fontWeight: 600,
        fontSize: 15,
        letterSpacing: '-0.02em',
        color: '#ffffff',
      }}>
        FileCurrent
      </span>
    </div>
  )
}
