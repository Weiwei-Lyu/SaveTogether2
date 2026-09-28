import type { ReactNode } from "react";

export function Feedback({
  error,
  success,
}: {
  error?: string;
  success?: string;
}) {
  if (!error && !success) return null;

  return (
    <p
      role="status"
      className={`rounded-xl px-3 py-2 text-sm ${
        error ? "bg-red-50 text-danger" : "bg-sage/10 text-sage-dark"
      }`}
    >
      {error ?? success}
    </p>
  );
}

export function Field({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <label className="block space-y-1.5">
      <span className="text-sm font-medium text-ink">{label}</span>
      {children}
    </label>
  );
}

export const fieldClass =
  "w-full rounded-xl border border-line bg-white px-3 py-2.5 text-ink outline-none focus:border-sage";

export const primaryButtonClass =
  "inline-flex items-center justify-center rounded-full bg-sage px-5 py-2.5 text-sm font-medium text-white hover:bg-sage-dark disabled:opacity-60";
