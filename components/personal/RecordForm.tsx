"use client";

import { useActionState } from "react";
import type { SavingsRecord } from "@/lib/database.types";
import {
  upsertPersonalRecordAction,
  type FormState,
} from "@/lib/actions/personal";
import { Feedback, Field, fieldClass, primaryButtonClass } from "@/components/Feedback";

export function PersonalRecordForm({
  goalId,
  record,
  today,
  onCancel,
}: {
  goalId: string;
  record?: Pick<SavingsRecord, "id" | "amount" | "recorded_on" | "note">;
  today: string;
  onCancel?: () => void;
}) {
  const [state, action, pending] = useActionState(
    upsertPersonalRecordAction,
    {} as FormState,
  );

  return (
    <form action={action} className="grid gap-3 sm:grid-cols-2">
      <input type="hidden" name="goalId" value={goalId} />
      {record ? <input type="hidden" name="recordId" value={record.id} /> : null}
      <Field label="Confirmed amount">
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
          {pending ? "Saving…" : record ? "Update record" : "Record confirmed saved"}
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
