import { cn } from "@/lib/utils";

interface BadgeProps {
  label: string;
  variant?: "default" | "accent" | "outline" | "muted";
  className?: string;
}

export const Badge = ({ label, variant = "default", className }: BadgeProps) => {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em]",
        variant === "default" && "bg-slate-900 text-white",
        variant === "accent" && "bg-[var(--accent)] text-white shadow-sm",
        variant === "muted" && "bg-white/70 text-slate-600 border border-slate-200",
        variant === "outline" && "border border-slate-200 text-slate-600",
        className
      )}
    >
      {label}
    </span>
  );
};
