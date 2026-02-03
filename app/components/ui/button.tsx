"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

type Variant = "solid" | "ghost";
type Size = "sm" | "md";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
}

const variantClasses: Record<Variant, string> = {
  solid:
    "bg-blue-600 text-white hover:bg-blue-500 disabled:bg-slate-600 disabled:text-white/60",
  ghost:
    "bg-transparent text-white hover:bg-white/10 disabled:text-white/50 disabled:bg-transparent",
};

const sizeClasses: Record<Size, string> = {
  sm: "h-9 px-3 text-sm",
  md: "h-11 px-4 text-sm",
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "solid", size = "md", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-colors border border-white/10 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:ring-offset-0 disabled:cursor-not-allowed",
          variantClasses[variant],
          sizeClasses[size],
          className
        )}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";

export default Button;
