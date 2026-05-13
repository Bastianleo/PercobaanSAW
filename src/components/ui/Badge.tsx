import type { ReactNode } from "react";


interface BadgeProps {
  children: ReactNode;
  color?: "blue" | "green" | "red" | "amber" | "gray";
  className?: string;
}

export function Badge({ children, color = "blue", className = "" }: BadgeProps) {
  const colors: Record<string, string> = {
    blue: "bg-blue-50 text-blue-700 border-blue-200",
    green: "bg-emerald-50 text-emerald-700 border-emerald-200",
    red: "bg-rose-50 text-rose-700 border-rose-200",
    amber: "bg-amber-50 text-amber-700 border-amber-200",
    gray: "bg-slate-50 text-slate-600 border-slate-200",
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium border ${colors[color]} ${className}`}
    >
      {children}
    </span>
  );
}