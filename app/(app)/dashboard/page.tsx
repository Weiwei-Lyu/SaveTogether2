import Link from "next/link";
import { ProgressBar } from "@/components/ProgressBar";
import { requireProfile } from "@/lib/auth";
import { PlannedPathSummary } from "@/components/personal/PlannedPathSummary";
import { formatDate, formatMoney, progressPercent, remainingAmount } from "@/lib/format";
import { createClient } from "@/lib/supabase/server";
import { latestRecord, sumRecords } from "@/lib/totals";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const { user, profile } = await requireProfile();
  const supabase = await createClient();

  const [{ data: goals }, { data: plans }, { data: privateRecords }, { data: groupRecords }] =
    await Promise.all([
      supabase.from("private_goals").select("*").eq("user_id", user.id).order("created_at"),
      supabase.from("group_plans").select("*").order("created_at"),
      supabase
        .from("savings_records")
        .select("*")
        .eq("user_id", user.id)
        .not("private_goal_id", "is", null),
      supabase.from("savings_records").select("*").not("plan_id", "is", null),
    ]);

  const personalGoals = goals ?? [];
  const groupPlans = plans ?? [];
  const myPrivateRecords = privateRecords ?? [];
  const allGroupRecords = groupRecords ?? [];

  const personalSaved = sumRecords(myPrivateRecords);
  const lastPersonal = latestRecord(myPrivateRecords);
  const lastGoal = lastPersonal
    ? personalGoals.find((goal) => goal.id === lastPersonal.private_goal_id)
    : null;

  return (
    <div className="space-y-10">
      <div>
        <p className="text-sm text-muted">Hello, {profile.display_name}</p>
        <h1 className="mt-1 font-serif text-4xl">Dashboard</h1>
        <p className="mt-2 max-w-2xl text-muted">
          Personal confirmed saved stays on the left. Group totals stay in their
          own section and never join your personal balance.
        </p>
      </div>

      <section className="rounded-3xl bg-card p-6 shadow-sm">
        <p className="text-sm font-medium text-sage-dark">Personally saved</p>
        <p className="mt-2 font-serif text-4xl">{formatMoney(personalSaved)}</p>
        <p className="mt-2 text-sm text-muted">
          Sum of your private confirmed records only.
        </p>
        <div className="mt-5 rounded-2xl bg-paper px-4 py-3 text-sm">
          {lastPersonal && lastGoal ? (
            <p>
              Last personal record: {formatMoney(Number(lastPersonal.amount))} toward{" "}
              <span className="font-medium">{lastGoal.name}</span> on{" "}
              {formatDate(lastPersonal.recorded_on)}
            </p>
          ) : (
            <p className="text-muted">
              You have not recorded a personal contribution yet.
            </p>
          )}
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex items-end justify-between gap-4">
          <h2 className="font-serif text-2xl">How close are your personal goals?</h2>
          <Link href="/personal" className="text-sm text-sage-dark hover:underline">
            Open Personal Savings
          </Link>
        </div>
        {personalGoals.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-line p-8">
            <p className="font-medium">Your private ledger is ready</p>
            <p className="mt-2 text-sm text-muted">
              Add a first goal to start tracking confirmed saved.
            </p>
            <Link
              href="/personal"
              className="mt-4 inline-flex rounded-full bg-sage px-4 py-2 text-sm text-white"
            >
              Add a personal goal
            </Link>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {personalGoals.map((goal) => {
              const confirmed = sumRecords(
                myPrivateRecords.filter((record) => record.private_goal_id === goal.id),
              );
              const remaining = remainingAmount(confirmed, Number(goal.target_amount));
              return (
                <Link
                  key={goal.id}
                  href={`/personal/${goal.id}`}
                  className="rounded-3xl bg-card p-5 shadow-sm hover:shadow"
                >
                  <p className="font-medium">{goal.name}</p>
                  <p className="mt-1 text-sm text-muted">
                    {formatMoney(confirmed)} confirmed of {formatMoney(Number(goal.target_amount))}
                  </p>
                  <div className="mt-4">
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
                      compact
                    />
                  ) : null}
                </Link>
              );
            })}
          </div>
        )}
      </section>

      <section className="space-y-4">
        <div className="flex items-end justify-between gap-4">
          <h2 className="font-serif text-2xl">Group plans</h2>
          <Link href="/groups" className="text-sm text-sage-dark hover:underline">
            Open Group Savings
          </Link>
        </div>
        {groupPlans.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-line p-8">
            <p className="font-medium">Save with friends in a separate pot</p>
            <p className="mt-2 text-sm text-muted">
              Create or join a group plan. Group totals never add to your personal saved number.
            </p>
            <Link
              href="/groups"
              className="mt-4 inline-flex rounded-full bg-sage px-4 py-2 text-sm text-white"
            >
              Create or join a plan
            </Link>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {groupPlans.map((plan) => {
              const confirmed = sumRecords(
                allGroupRecords.filter((record) => record.plan_id === plan.id),
              );
              return (
                <Link
                  key={plan.id}
                  href={`/groups/${plan.id}`}
                  className="rounded-3xl bg-card p-5 shadow-sm hover:shadow"
                >
                  <p className="font-medium">{plan.title}</p>
                  <p className="mt-1 text-sm text-muted">
                    Group confirmed {formatMoney(confirmed)} of{" "}
                    {formatMoney(Number(plan.target_amount))}
                  </p>
                  <div className="mt-4">
                    <ProgressBar
                      value={progressPercent(confirmed, Number(plan.target_amount))}
                      label={`${plan.title} group progress`}
                    />
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
