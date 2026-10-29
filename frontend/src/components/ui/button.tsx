import { cn } from "../../lib/utils"
import type { ButtonHTMLAttributes } from "react"

type Variant = "primary" | "outline" | "ghost"

const variants: Record<Variant, string> = {
  primary:
    "bg-gradient-to-r from-[#1ea6da] to-[#736cf0] text-white shadow-sm hover:opacity-90 focus-visible:outline-[#1ea6da]",
  outline:
    "border border-[#1ea6da]/40 bg-transparent text-[#1ea6da] hover:bg-[#1ea6da]/10 focus-visible:outline-[#1ea6da]",
  ghost: "text-zinc-600 hover:bg-zinc-100 focus-visible:outline-zinc-400",
}

export function Button({
  className,
  variant = "primary",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant }) {
  return (
    <button
      className={cn(
        "inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium",
        "transition-colors focus-visible:outline-2 focus-visible:outline-offset-2",
        "disabled:pointer-events-none disabled:opacity-50",
        variants[variant],
        className,
      )}
      {...props}
    />
  )
}
