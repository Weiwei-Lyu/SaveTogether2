import Link from "next/link";
import { CreatePlanForm, JoinPlanForm } from "@/components/groups/GroupForms";
import { ProgressBar } from "@/components/ProgressBar";
import { requireUser } from "@/lib/auth";
import { formatMoney, progressPercent } from "@/lib/format";
import { createClient } from "@/lib/supabase/server";
import { sumRecords } from "@/lib/totals";

export const dynamic = "force-dynamic";

export default async function GroupsPage() {
  await requireUser();
  const supabase = await createClient();
  const [{ data: plans }, { data: records }] = await Promise.all([
    supabase.from("group_plans").select("*").order("created_at"),
    supabase.from("savings_records").select("*").not("plan_id", "is", null),
  ]);

  const groupPlans = plans ?? [];
  const groupRecords = records ?? [];

  return (
    <div className="space-y-10">
      <div>
        <h1 className="font-serif text-4xl">Group Savings</h1>
        <p className="mt-2 max-w-2xl text-muted">
          Collaborative goals, not bank accounts. Members see each other’s
          confirmed contributions. Nothing here is added to your personal ledger.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="rounded-3xl bg-card p-6 shadow-sm">
          <h2 className="font-serif text-2xl">Create a group plan</h2>
          <p className="mt-2 mb-5 text-sm text-muted">
            You will get an invitation code to share with friends.
          </p>
          <CreatePlanForm />
        </section>
        <section className="rounded-3xl bg-card p-6 shadow-sm">
          <h2 className="font-serif text-2xl">Join with a code</h2>
          <p className="mt-2 mb-5 text-sm text-muted">
            Ask a friend for the 8-character invitation code.
          </p>
          <JoinPlanForm />
        </section>
      </div>

      <section className="space-y-4">
        <h2 className="font-serif text-2xl">Plans you belong to</h2>
        {groupPlans.length === 0 ? (
          <p className="rounded-3xl border border-dashed border-line p-8 text-muted">
            You are not in a group plan yet. Create one or enter a code above.
          </p>
        ) : (
          <div className="grid gap-4">
            {groupPlans.map((plan) => {
              const confirmed = sumRecords(
                groupRecords.filter((record) => record.plan_id === plan.id),
              );
              return (
                <Link
                  key={plan.id}
                  href={`/groups/${plan.id}`}
                  className="rounded-3xl bg-card p-6 shadow-sm hover:shadow"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <h3 className="text-xl font-medium">{plan.title}</h3>
                      <p className="mt-1 text-sm text-muted">
                        {plan.member_ids.length} member
                        {plan.member_ids.length === 1 ? "" : "s"} · invite {plan.invite_code}
                      </p>
                    </div>
                    <p className="text-lg font-medium">{formatMoney(confirmed)} confirmed</p>
                  </div>
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
