export function LogoMark({ size = 32 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="40" height="40" rx="10" fill="#0A2540" />
      <path
        d="M9 20 C13 13, 19 13, 22 20 C25 27, 31 27, 34 20"
        stroke="white"
        strokeWidth="2.8"
        strokeLinecap="round"
        fill="none"
        opacity="0.65"
      />
      <path
        d="M6 24 C10 17, 17 17, 20 24 C23 31, 30 31, 34 24"
        stroke="white"
        strokeWidth="2.8"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  )
}

export function LogoMarkInverse({ size = 32 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M9 20 C13 13, 19 13, 22 20 C25 27, 31 27, 34 20"
        stroke="#635BFF"
        strokeWidth="2.8"
        strokeLinecap="round"
        fill="none"
        opacity="0.65"
      />
      <path
        d="M6 24 C10 17, 17 17, 20 24 C23 31, 30 31, 34 24"
        stroke="#635BFF"
        strokeWidth="2.8"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  )
}

export function LogoFull({
  className,
  textColor = 'text-gray-900',
}: {
  className?: string
  textColor?: string
}) {
  return (
    <div className={`flex items-center gap-2.5 ${className ?? ''}`}>
      <LogoMark size={30} />
      <span className={`font-bold text-[15px] tracking-tight ${textColor}`}>
        FileCurrent
      </span>
    </div>
  )
}

export function LogoFullInverse({ className }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2.5 ${className ?? ''}`}>
      <LogoMark size={30} />
      <span className="font-bold text-[15px] tracking-tight text-white">
        FileCurrent
      </span>
    </div>
  )
}
