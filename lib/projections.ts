import type { Cadence } from "./database.types";

export const PERIODS_PER_YEAR: Record<Cadence, number> = {
  daily: 365,
  weekly: 52,
  monthly: 12,
};

export function yearlyProjectedSavings(
  plannedAmount: number | null,
  cadence: Cadence | null,
) {
  if (!plannedAmount || !cadence) return null;
  return roundMoney(plannedAmount * PERIODS_PER_YEAR[cadence]);
}

export function cadencePeriodLabel(cadence: Cadence) {
  return { daily: "day", weekly: "week", monthly: "month" }[cadence];
}

export function cadenceScheduleLabel(cadence: Cadence) {
  return {
    daily: "Daily savings",
    weekly: "Weekly savings",
    monthly: "Monthly savings",
  }[cadence];
}

export type TimeToTarget = {
  reached: boolean;
  periods: number;
  summary: string;
  calendarNote: string | null;
};

export function estimateTimeToTarget(
  remaining: number,
  plannedAmount: number,
  cadence: Cadence,
): TimeToTarget {
  if (remaining <= 0) {
    return {
      reached: true,
      periods: 0,
      summary: "You’ve already reached this target with confirmed savings.",
      calendarNote: null,
    };
  }

  const periods = Math.ceil(remaining / plannedAmount);
  const unit = cadencePeriodLabel(cadence);
  const summary = `About ${periods} ${pluralize(unit, periods)}`;
  return {
    reached: false,
    periods,
    summary,
    calendarNote: calendarNote(periods, cadence),
  };
}

function roundMoney(amount: number) {
  return Math.round(amount * 100) / 100;
}

function pluralize(word: string, count: number) {
  return count === 1 ? word : `${word}s`;
}

function calendarNote(periods: number, cadence: Cadence) {
  const days =
    cadence === "daily" ? periods : cadence === "weekly" ? periods * 7 : periods * 30;
  let years = Math.floor(days / 365);
  let months = Math.round((days - years * 365) / 30);

  if (months === 12) {
    years += 1;
    months = 0;
  }

  if (years === 0 && months === 0) return null;
  if (cadence === "monthly" && years === 0) return null;

  const parts = [
    years ? `${years} ${pluralize("year", years)}` : null,
    months ? `${months} ${pluralize("month", months)}` : null,
  ].filter(Boolean);

  return parts.length ? `roughly ${parts.join(" and ")}` : null;
}
