import { formatDate, formatMoney } from "@/lib/format";
import {
  cadencePeriodLabel,
  cadenceScheduleLabel,
  estimateTimeToTarget,
  yearlyProjectedSavings,
  type TimeToTarget,
} from "@/lib/projections";
import type { Cadence } from "@/lib/database.types";

export function PlannedPathSummary({
  plannedAmount,
  cadence,
  remaining,
  startDate,
  compact = false,
}: {
  plannedAmount: number;
  cadence: Cadence;
  remaining: number;
  startDate?: string | null;
  compact?: boolean;
}) {
  const projection = yearlyProjectedSavings(plannedAmount, cadence);
  if (projection === null) return null;

  const timing = estimateTimeToTarget(remaining, plannedAmount, cadence);
  const period = cadencePeriodLabel(cadence);
  const schedule = cadenceScheduleLabel(cadence);

  if (compact) {
    return (
      <div className="mt-4 rounded-2xl bg-paper px-4 py-3">
        <p className="text-xs font-medium tracking-wide text-sage-dark uppercase">
          Projected Savings in 1 Year
        </p>
        <p className="mt-1 text-2xl font-medium">{formatMoney(projection)}</p>
        <p className="mt-2 text-sm text-muted">
          {schedule}: {formatMoney(plannedAmount)} / {period}
        </p>
        <p className="mt-1 text-sm text-muted">{timingLine(timing, remaining)}</p>
        <p className="mt-2 text-xs text-muted">
          Projection only — confirmed savings stay separate.
        </p>
      </div>
    );
  }

  return (
    <div className="mt-6 rounded-2xl border border-line bg-paper p-5">
      <p className="text-sm font-medium text-sage-dark">Planned path — not saved yet</p>
      <p className="mt-1 text-sm text-muted">
        This calculator does not change confirmed savings or the progress bar.
        {startDate ? ` Started ${formatDate(startDate)}.` : ""}
      </p>
      <dl className="mt-5 grid gap-5 sm:grid-cols-2">
        <div>
          <dt className="text-sm text-muted">{schedule}</dt>
          <dd className="mt-1 text-xl">
            {formatMoney(plannedAmount)} / {period}
          </dd>
        </div>
        <div>
          <dt className="text-sm text-muted">Projected Savings in 1 Year</dt>
          <dd className="mt-1 font-serif text-4xl">{formatMoney(projection)}</dd>
        </div>
      </dl>
      <div className="mt-5">
        <p className="text-sm font-medium text-ink">Time to reach target</p>
        <p className="mt-1 text-xl">{timing.summary}</p>
        {!timing.reached ? (
          <p className="mt-1 text-sm text-muted">
            {timing.calendarNote ? `${capitalize(timing.calendarNote)} ` : ""}
            at {formatMoney(plannedAmount)} / {period} to cover the remaining{" "}
            {formatMoney(remaining)}.
          </p>
        ) : null}
      </div>
    </div>
  );
}

function capitalize(text: string) {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

function timingLine(timing: TimeToTarget, remaining: number) {
  if (timing.reached) return timing.summary;
  const calendar = timing.calendarNote ? ` (${timing.calendarNote})` : "";
  return `${timing.summary}${calendar} at this planned rate to cover the remaining ${formatMoney(remaining)}.`;
}
