import Link from "next/link";
import { GoalForm } from "@/components/personal/GoalForm";
import { ProgressBar } from "@/components/ProgressBar";
import { requireUser } from "@/lib/auth";
import {
  cadenceLabel,
  formatMoney,
  plannedProjection,
  progressPercent,
  remainingAmount,
  todayISO,
} from "@/lib/format";
import { createClient } from "@/lib/supabase/server";
import { sumRecords } from "@/lib/totals";

export const dynamic = "force-dynamic";

export default async function PersonalPage() {
  const user = await requireUser();
  const supabase = await createClient();
  const [{ data: goals }, { data: records }] = await Promise.all([
    supabase.from("private_goals").select("*").eq("user_id", user.id).order("created_at"),
    supabase
      .from("savings_records")
      .select("*")
      .eq("user_id", user.id)
      .not("private_goal_id", "is", null),
  ]);

  const personalGoals = goals ?? [];
  const privateRecords = records ?? [];

  return (
    <div className="space-y-10">
      <div>
        <h1 className="font-serif text-4xl">Personal Savings</h1>
        <p className="mt-2 max-w-2xl text-muted">
          Only you can see these goals. Confirmed saved, remaining, and progress
          use records you add by hand — never the planned path.
        </p>
      </div>

      <section className="rounded-3xl bg-card p-6 shadow-sm">
        <h2 className="font-serif text-2xl">Add a goal</h2>
        <p className="mt-2 mb-5 text-sm text-muted">
          Example: a $1,000 vacation with $10 each week can show a $520 yearly
          projection while confirmed saved stays $0.
        </p>
        <GoalForm today={todayISO()} />
      </section>

      <section className="space-y-4">
        <h2 className="font-serif text-2xl">Your goals</h2>
        {personalGoals.length === 0 ? (
          <p className="rounded-3xl border border-dashed border-line p-8 text-muted">
            Add a first goal above. Your private ledger starts empty on purpose.
          </p>
        ) : (
          <div className="grid gap-4">
            {personalGoals.map((goal) => {
              const confirmed = sumRecords(
                privateRecords.filter((record) => record.private_goal_id === goal.id),
              );
              const projection = plannedProjection(goal.planned_amount, goal.cadence);
              return (
                <Link
                  key={goal.id}
                  href={`/personal/${goal.id}`}
                  className="rounded-3xl bg-card p-6 shadow-sm hover:shadow"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <h3 className="text-xl font-medium">{goal.name}</h3>
                      <p className="mt-1 text-sm text-muted">
                        Target {formatMoney(Number(goal.target_amount))} · remaining{" "}
                        {formatMoney(remainingAmount(confirmed, Number(goal.target_amount)))}
                      </p>
                    </div>
                    <p className="text-lg font-medium">{formatMoney(confirmed)} confirmed</p>
                  </div>
                  <div className="mt-4">
                    <ProgressBar
                      value={progressPercent(confirmed, Number(goal.target_amount))}
                      label={`${goal.name} confirmed progress`}
                    />
                  </div>
                  {projection !== null && goal.cadence && goal.planned_amount ? (
                    <p className="mt-3 text-sm text-muted">
                      Planned path {formatMoney(Number(goal.planned_amount))} /{" "}
                      {cadenceLabel(goal.cadence)} from {goal.start_date} · one-year
                      projection {formatMoney(projection)}
                    </p>
                  ) : (
                    <p className="mt-3 text-sm text-muted">No planned path on this goal.</p>
                  )}
                </Link>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
