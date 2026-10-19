import type { ComponentProps, ReactNode } from "react";

export function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <section className={`rounded-3xl bg-white/10 p-6 shadow-xl backdrop-blur ${className}`}>{children}</section>;
}

export function Field({ label, hint, ...props }: ComponentProps<"input"> & { label: string; hint?: string }) {
  return (
    <label className="flex flex-col gap-1 text-left">
      <span className="font-semibold">{label}</span>
      <input
        {...props}
        className="rounded-xl border border-white/20 bg-white/90 px-4 py-3 text-lg text-night outline-none focus:ring-4 focus:ring-legendary/60"
      />
      {hint && <span className="text-sm text-violet-200">{hint}</span>}
    </label>
  );
}

export function Button({ variant = "primary", className = "", ...props }: ComponentProps<"button"> & { variant?: "primary" | "secondary" | "ghost" }) {
  const styles = {
    primary: "bg-legendary text-night hover:brightness-110",
    secondary: "bg-epic text-white hover:brightness-110",
    ghost: "bg-white/10 text-white hover:bg-white/20",
  }[variant];
  return (
    <button
      {...props}
      className={`rounded-2xl px-6 py-3 text-lg font-bold shadow transition disabled:opacity-50 ${styles} ${className}`}
    />
  );
}

export function Alert({ tone, children }: { tone: "error" | "success"; children: ReactNode }) {
  const styles = tone === "error" ? "bg-red-500/20 text-red-100" : "bg-emerald-500/20 text-emerald-100";
  return <p role={tone === "error" ? "alert" : "status"} className={`rounded-xl px-4 py-3 ${styles}`}>{children}</p>;
}
