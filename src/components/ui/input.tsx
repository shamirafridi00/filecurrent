import * as React from "react"

import { cn } from "@/lib/utils"

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, onWheel, autoComplete, ...props }, ref) => {
    return (
      <input
        type={type}
        // Default browser autofill/history suggestions OFF app-wide — they
        // cluttered every business form. Auth fields opt back in explicitly
        // (login/signup pass autoComplete="email" / "current-password").
        autoComplete={autoComplete ?? "off"}
        className={cn(
          "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          className
        )}
        ref={ref}
        // Number inputs change value on mouse scroll by default — a frequent
        // source of accidental amount edits. Blur on wheel to disable it.
        onWheel={(e) => {
          if (type === "number") e.currentTarget.blur()
          onWheel?.(e)
        }}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }
