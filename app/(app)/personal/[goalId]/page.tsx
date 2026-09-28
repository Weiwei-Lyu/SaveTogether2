import Link from "next/link";
import { notFound } from "next/navigation";
import { ConfirmButton } from "@/components/ConfirmButton";
import { ProgressBar } from "@/components/ProgressBar";
import { GoalForm } from "@/components/personal/GoalForm";
import { PersonalRecordForm } from "@/components/personal/RecordForm";
import { PersonalRecordList } from "@/components/personal/RecordList";
import { deleteGoalAction } from "@/lib/actions/personal";
import { requireUser } from "@/lib/auth";
import { PlannedPathSummary } from "@/components/personal/PlannedPathSummary";
import {
  formatMoney,
  progressPercent,
  remainingAmount,
  todayISO,
} from "@/lib/format";
import { createClient } from "@/lib/supabase/server";
import { sumRecords } from "@/lib/totals";

export const dynamic = "force-dynamic";

export default async function PersonalGoalPage({
  params,
}: {
  params: Promise<{ goalId: string }>;
}) {
  const user = await requireUser();
  const { goalId } = await params;
  const supabase = await createClient();
  const { data: goal } = await supabase
    .from("private_goals")
    .select("*")
    .eq("id", goalId)
    .eq("user_id", user.id)
    .maybeSingle();

  if (!goal) notFound();

  const { data: records } = await supabase
    .from("savings_records")
    .select("*")
    .eq("private_goal_id", goal.id)
    .order("recorded_on", { ascending: false });

  const confirmed = sumRecords(records ?? []);
  const remaining = remainingAmount(confirmed, Number(goal.target_amount));

  return (
    <div className="space-y-8">
      <Link href="/personal" className="text-sm text-sage-dark hover:underline">
        Back to Personal Savings
      </Link>
      <div className="rounded-3xl bg-card p-6 shadow-sm">
        <h1 className="font-serif text-4xl">{goal.name}</h1>
        <p className="mt-2 text-sm text-muted">
          Target {formatMoney(Number(goal.target_amount))}. The numbers below are
          money you already recorded — not the planned path.
        </p>
        <dl className="mt-6 grid gap-4 sm:grid-cols-2">
          <div>
            <dt className="text-sm text-muted">Confirmed saved</dt>
            <dd className="mt-1 text-2xl">{formatMoney(confirmed)}</dd>
          </div>
          <div>
            <dt className="text-sm text-muted">Remaining</dt>
            <dd className="mt-1 text-2xl">{formatMoney(remaining)}</dd>
          </div>
        </dl>
        <div className="mt-6">
          <ProgressBar
            value={progressPercent(confirmed, Number(goal.target_amount))}
            label={`${goal.name} confirmed progress`}
          />
        </div>
        {goal.cadence && goal.planned_amount ? (
          <PlannedPathSummary
            plannedAmount={Number(goal.planned_amount)}
            cadence={goal.cadence}
            remaining={remaining}
            startDate={goal.start_date}
          />
        ) : (
          <p className="mt-4 text-sm text-muted">
            No planned path. Confirmed saved stays at {formatMoney(confirmed)} until you record a contribution.
          </p>
        )}
      </div>

      <section className="rounded-3xl bg-card p-6 shadow-sm">
        <h2 className="font-serif text-2xl">Record confirmed saved</h2>
        <p className="mt-2 mb-5 text-sm text-muted">
          Add money you already set aside somewhere else. Editing or deleting a
          record updates the totals above.
        </p>
        <PersonalRecordForm goalId={goal.id} today={todayISO()} />
        <div className="mt-8">
          <PersonalRecordList goalId={goal.id} records={records ?? []} today={todayISO()} />
        </div>
      </section>

      <section className="rounded-3xl bg-card p-6 shadow-sm">
        <h2 className="font-serif text-2xl">Edit goal</h2>
        <div className="mt-5">
          <GoalForm goal={goal} today={todayISO()} />
        </div>
        <div className="mt-6">
          <ConfirmButton
            action={deleteGoalAction}
            hidden={{ goalId: goal.id }}
            label="Delete this goal"
            confirmLabel="Delete goal"
            warning="Delete this personal goal and all of its confirmed records? Group plans are not affected."
          />
        </div>
      </section>
    </div>
  );
}
