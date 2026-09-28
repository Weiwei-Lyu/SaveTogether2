import type { Cadence } from "@/lib/database.types";

export function formatMoney(amount: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(amount);
}

export function formatDate(value: string) {
  const date = new Date(`${value}T00:00:00`);
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

export function todayISO() {
  const now = new Date();
  const offset = now.getTimezoneOffset() * 60_000;
  return new Date(now.getTime() - offset).toISOString().slice(0, 10);
}

export function plannedProjection(
  plannedAmount: number | null,
  cadence: Cadence | null,
) {
  if (!plannedAmount || !cadence) return null;
  if (cadence === "daily") return plannedAmount * 365;
  if (cadence === "weekly") return plannedAmount * 52;
  return plannedAmount * 12;
}

export function cadenceLabel(cadence: Cadence) {
  return { daily: "day", weekly: "week", monthly: "month" }[cadence];
}

export function progressPercent(confirmed: number, target: number) {
  if (target <= 0) return 0;
  return Math.min(100, (confirmed / target) * 100);
}

export function remainingAmount(confirmed: number, target: number) {
  return Math.max(0, target - confirmed);
}

export function parseAmount(value: FormDataEntryValue | null) {
  if (typeof value !== "string") return null;
  const amount = Number.parseFloat(value);
  if (!Number.isFinite(amount) || amount <= 0) return null;
  return Math.round(amount * 100) / 100;
}

export function friendlyAuthError(message: string) {
  const lower = message.toLowerCase();
  if (lower.includes("email not confirmed")) {
    return "Please open the confirmation link in your email, then log in with your password.";
  }
  if (lower.includes("invalid login")) {
    return "That email or password did not match. Try again.";
  }
  if (lower.includes("already registered") || lower.includes("already been registered")) {
    return "An account with this email already exists. Try logging in.";
  }
  if (lower.includes("rate limit")) {
    return "Too many confirmation emails were sent recently. Please wait about an hour, then use Forgot Password instead of creating a new account.";
  }
  if (lower.includes("password")) {
    return "Use a password with at least 6 characters.";
  }
  return message;
}
