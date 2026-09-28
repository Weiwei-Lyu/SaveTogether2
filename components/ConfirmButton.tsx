"use client";

import { useState } from "react";

export function ConfirmButton({
  action,
  hidden,
  label,
  confirmLabel,
  warning,
  tone = "danger",
}: {
  action: (formData: FormData) => void | Promise<void>;
  hidden?: Record<string, string>;
  label: string;
  confirmLabel: string;
  warning: string;
  tone?: "danger" | "muted";
}) {
  const [open, setOpen] = useState(false);
  const buttonClass =
    tone === "danger"
      ? "text-danger hover:underline"
      : "text-muted hover:text-ink hover:underline";

  return (
    <div>
      <button type="button" className={`text-sm ${buttonClass}`} onClick={() => setOpen(true)}>
        {label}
      </button>
      {open ? (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-ink/30 p-4 sm:items-center">
          <div className="w-full max-w-md rounded-2xl bg-card p-6 shadow-xl">
            <p className="text-base leading-relaxed text-ink">{warning}</p>
            <div className="mt-5 flex flex-wrap justify-end gap-3">
              <button
                type="button"
                className="rounded-full px-4 py-2 text-sm text-muted hover:bg-paper"
                onClick={() => setOpen(false)}
              >
                Keep it
              </button>
              <form action={action}>
                {Object.entries(hidden ?? {}).map(([name, value]) => (
                  <input key={name} type="hidden" name={name} value={value} />
                ))}
                <button
                  type="submit"
                  className="rounded-full bg-danger px-4 py-2 text-sm font-medium text-white"
                >
                  {confirmLabel}
                </button>
              </form>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
