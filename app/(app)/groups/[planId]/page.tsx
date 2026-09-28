import Link from "next/link";
import { notFound } from "next/navigation";
import { ConfirmButton } from "@/components/ConfirmButton";
import { EditPlanForm, GroupRecordForm } from "@/components/groups/GroupForms";
import { GroupRecordList } from "@/components/groups/GroupRecordList";
import { Feedback } from "@/components/Feedback";
import { ProgressBar } from "@/components/ProgressBar";
import { deletePlanAction, leavePlanAction } from "@/lib/actions/groups";
import { requireUser } from "@/lib/auth";
import { formatMoney, progressPercent, todayISO } from "@/lib/format";
import { createClient } from "@/lib/supabase/server";
import { sumRecords } from "@/lib/totals";

export const dynamic = "force-dynamic";

export default async function GroupPlanPage({
  params,
  searchParams,
}: {
  params: Promise<{ planId: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  const user = await requireUser();
  const { planId } = await params;
  const { error } = await searchParams;
  const supabase = await createClient();
  const { data: plan } = await supabase
    .from("group_plans")
    .select("*")
    .eq("id", planId)
    .maybeSingle();

  if (!plan) notFound();

  const [{ data: records }, { data: profiles }] = await Promise.all([
    supabase
      .from("savings_records")
      .select("*")
      .eq("plan_id", plan.id)
      .order("recorded_on", { ascending: false }),
    supabase.from("profiles").select("id, display_name"),
  ]);

  const history = records ?? [];
  const names = Object.fromEntries(
    (profiles ?? []).map((profile) => [profile.id, profile.display_name]),
  );
  const confirmed = sumRecords(history);
  const isCreator = plan.creator_id === user.id;
  const contributorIds = Array.from(
    new Set([...plan.member_ids, ...history.map((record) => record.user_id)]),
  );

  return (
    <div className="space-y-8">
      <Link href="/groups" className="text-sm text-sage-dark hover:underline">
        Back to Group Savings
      </Link>
      {error ? <Feedback error={error} /> : null}

      <section className="rounded-3xl bg-card p-6 shadow-sm">
        <h1 className="font-serif text-4xl">{plan.title}</h1>
        {plan.description ? (
          <p className="mt-3 max-w-2xl leading-relaxed text-muted">{plan.description}</p>
        ) : null}
        <p className="mt-4 text-sm">
          Invitation code{" "}
          <span className="rounded-full bg-paper px-3 py-1 font-medium tracking-wide">
            {plan.invite_code}
          </span>
        </p>
        <dl className="mt-6 grid gap-4 sm:grid-cols-2">
          <div>
            <dt className="text-sm text-muted">Combined confirmed saved</dt>
            <dd className="mt-1 text-2xl">{formatMoney(confirmed)}</dd>
          </div>
          <div>
            <dt className="text-sm text-muted">Shared target</dt>
            <dd className="mt-1 text-2xl">{formatMoney(Number(plan.target_amount))}</dd>
          </div>
        </dl>
        <div className="mt-6">
          <ProgressBar
            value={progressPercent(confirmed, Number(plan.target_amount))}
            label={`${plan.title} group progress`}
          />
        </div>
      </section>

      <section className="rounded-3xl bg-card p-6 shadow-sm">
        <h2 className="font-serif text-2xl">Members</h2>
        <p className="mt-2 mb-5 text-sm text-muted">
          Everyone in this plan can see each member’s confirmed total. People
          who left still appear if they have history, with access already revoked.
        </p>
        <ul className="divide-y divide-line">
          {contributorIds.map((memberId) => {
            const total = sumRecords(history.filter((record) => record.user_id === memberId));
            const current = plan.member_ids.includes(memberId);
            return (
              <li key={memberId} className="flex items-center justify-between py-3">
                <span>
                  {names[memberId] ?? "Member"}
                  {memberId === plan.creator_id ? " · creator" : ""}
                  {!current ? " · left" : ""}
                </span>
                <span className="font-medium">{formatMoney(total)}</span>
              </li>
            );
          })}
        </ul>
      </section>

      <section className="rounded-3xl bg-card p-6 shadow-sm">
        <h2 className="font-serif text-2xl">Your contribution</h2>
        <p className="mt-2 mb-5 text-sm text-muted">
          You can add, edit, or delete only your own records.
        </p>
        <GroupRecordForm planId={plan.id} today={todayISO()} />
        <div className="mt-8">
          <h3 className="mb-4 font-medium">Complete group history</h3>
          <GroupRecordList
            planId={plan.id}
            userId={user.id}
            records={history}
            names={names}
            today={todayISO()}
          />
        </div>
      </section>

      {isCreator ? (
        <section className="rounded-3xl bg-card p-6 shadow-sm">
          <h2 className="font-serif text-2xl">Manage plan</h2>
          <div className="mt-5">
            <EditPlanForm plan={plan} />
          </div>
          <div className="mt-6">
            <ConfirmButton
              action={deletePlanAction}
              hidden={{ planId: plan.id }}
              label="Delete this plan"
              confirmLabel="Delete plan"
              warning="Delete this group plan and its group records? Personal savings stay untouched."
            />
          </div>
        </section>
      ) : (
        <section className="rounded-3xl bg-card p-6 shadow-sm">
          <h2 className="font-serif text-2xl">Leave plan</h2>
          <p className="mt-2 mb-4 text-sm text-muted">
            Your past contributions stay in the group history. You immediately
            lose access to this plan.
          </p>
          <ConfirmButton
            action={leavePlanAction}
            hidden={{ planId: plan.id }}
            label="Leave this plan"
            confirmLabel="Leave plan"
            tone="muted"
            warning="Leave this group plan? Your historical contributions stay, but you will lose access right away."
          />
        </section>
      )}
    </div>
  );
}
