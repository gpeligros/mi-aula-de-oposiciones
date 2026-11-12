import * as React from "react";
import { cn } from "@/lib/utils";

export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(({ className, ...p }, ref) => (
  <input ref={ref} className={cn("flex h-11 w-full rounded-lg border border-input bg-card px-3 text-base placeholder:text-muted-foreground disabled:opacity-50", className)} {...p} />
));
Input.displayName = "Input";

export const Select = React.forwardRef<HTMLSelectElement, React.SelectHTMLAttributes<HTMLSelectElement>>(({ className, ...p }, ref) => (
  <select ref={ref} className={cn("flex h-11 w-full rounded-lg border border-input bg-card px-3 text-base", className)} {...p} />
));
Select.displayName = "Select";
