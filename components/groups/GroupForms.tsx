"use client";

import { useActionState } from "react";
import type { GroupPlan, SavingsRecord } from "@/lib/database.types";
import {
  createPlanAction,
  joinPlanAction,
  updatePlanAction,
  upsertGroupRecordAction,
  type FormState,
} from "@/lib/actions/groups";
import { Feedback, Field, fieldClass, primaryButtonClass } from "@/components/Feedback";

export function CreatePlanForm() {
  const [state, action, pending] = useActionState(createPlanAction, {} as FormState);

  return (
    <form action={action} className="space-y-4">
      <Field label="Plan title">
        <input name="title" required className={fieldClass} placeholder="Spring picnic fund" />
      </Field>
      <Field label="Description">
        <textarea
          name="description"
          rows={3}
          className={fieldClass}
          placeholder="Snacks and a park reservation"
        />
      </Field>
      <Field label="Shared target (USD)">
        <input
          name="targetAmount"
          type="number"
          min="0.01"
          step="0.01"
          required
          className={fieldClass}
          placeholder="120"
        />
      </Field>
      <Feedback error={state.error} />
      <button className={primaryButtonClass} disabled={pending}>
        {pending ? "Creating…" : "Create group plan"}
      </button>
    </form>
  );
}

export function JoinPlanForm() {
  const [state, action, pending] = useActionState(joinPlanAction, {} as FormState);

  return (
    <form action={action} className="space-y-4">
      <Field label="Invitation code">
        <input
          name="inviteCode"
          required
          className={`${fieldClass} uppercase tracking-wide`}
          placeholder="8-character code"
        />
      </Field>
      <Feedback error={state.error} />
      <button className={primaryButtonClass} disabled={pending}>
        {pending ? "Joining…" : "Join with code"}
      </button>
    </form>
  );
}

export function EditPlanForm({
  plan,
}: {
  plan: Pick<GroupPlan, "id" | "title" | "description" | "target_amount">;
}) {
  const [state, action, pending] = useActionState(updatePlanAction, {} as FormState);

  return (
    <form action={action} className="grid gap-4 sm:grid-cols-2">
      <input type="hidden" name="planId" value={plan.id} />
      <Field label="Plan title">
        <input name="title" required defaultValue={plan.title} className={fieldClass} />
      </Field>
      <Field label="Shared target (USD)">
        <input
          name="targetAmount"
          type="number"
          min="0.01"
          step="0.01"
          required
          defaultValue={plan.target_amount}
          className={fieldClass}
        />
      </Field>
      <div className="sm:col-span-2">
        <Field label="Description">
          <textarea
            name="description"
            rows={3}
            defaultValue={plan.description}
            className={fieldClass}
          />
        </Field>
      </div>
      <div className="sm:col-span-2 space-y-3">
        <Feedback error={state.error} success={state.success} />
        <button className={primaryButtonClass} disabled={pending}>
          {pending ? "Saving…" : "Save plan details"}
        </button>
      </div>
    </form>
  );
}

export function GroupRecordForm({
  planId,
  record,
  today,
  onCancel,
}: {
  planId: string;
  record?: Pick<SavingsRecord, "id" | "amount" | "recorded_on" | "note">;
  today: string;
  onCancel?: () => void;
}) {
  const [state, action, pending] = useActionState(
    upsertGroupRecordAction,
    {} as FormState,
  );

  return (
    <form action={action} className="grid gap-3 sm:grid-cols-2">
      <input type="hidden" name="planId" value={planId} />
      {record ? <input type="hidden" name="recordId" value={record.id} /> : null}
      <Field label="Your confirmed amount">
        <input
          name="amount"
          type="number"
          min="0.01"
          step="0.01"
          required
          defaultValue={record?.amount ?? ""}
          className={fieldClass}
        />
      </Field>
      <Field label="Date set aside">
        <input
          name="recordedOn"
          type="date"
          required
          defaultValue={record?.recorded_on ?? today}
          className={fieldClass}
        />
      </Field>
      <div className="sm:col-span-2">
        <Field label="Note (optional)">
          <input
            name="note"
            defaultValue={record?.note ?? ""}
            className={fieldClass}
            placeholder="Packed lunch this week"
          />
        </Field>
      </div>
      <div className="sm:col-span-2 flex flex-wrap items-center gap-3">
        <button className={primaryButtonClass} disabled={pending}>
          {pending ? "Saving…" : record ? "Update contribution" : "Add my contribution"}
        </button>
        {onCancel ? (
          <button type="button" className="text-sm text-muted hover:underline" onClick={onCancel}>
            Cancel
          </button>
        ) : null}
        <Feedback error={state.error} success={state.success} />
      </div>
    </form>
  );
}
