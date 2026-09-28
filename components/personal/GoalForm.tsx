"use client";

import { useActionState } from "react";
import type { PrivateGoal } from "@/lib/database.types";
import {
  createGoalAction,
  updateGoalAction,
  type FormState,
} from "@/lib/actions/personal";
import { Feedback, Field, fieldClass, primaryButtonClass } from "@/components/Feedback";

export function GoalForm({
  goal,
  today,
}: {
  goal?: Pick<
    PrivateGoal,
    "id" | "name" | "target_amount" | "planned_amount" | "cadence" | "start_date"
  >;
  today: string;
}) {
  const action = goal ? updateGoalAction : createGoalAction;
  const [state, formAction, pending] = useActionState(action, {} as FormState);

  return (
    <form action={formAction} className="grid gap-4 sm:grid-cols-2">
      {goal ? <input type="hidden" name="goalId" value={goal.id} /> : null}
      <Field label="Goal name">
        <input
          name="name"
          required
          defaultValue={goal?.name}
          className={fieldClass}
          placeholder="Japan trip"
        />
      </Field>
      <Field label="Target amount (USD)">
        <input
          name="targetAmount"
          type="number"
          min="0.01"
          step="0.01"
          required
          defaultValue={goal?.target_amount ?? ""}
          className={fieldClass}
          placeholder="1000"
        />
      </Field>
      <div className="sm:col-span-2 rounded-2xl border border-dashed border-line p-4">
        <p className="mb-3 text-sm font-medium text-ink">Planned path (optional)</p>
        <p className="mb-4 text-sm text-muted">
          This is a calculator only. It never adds money to confirmed saved.
        </p>
        <div className="grid gap-4 sm:grid-cols-3">
          <Field label="Planned amount">
            <input
              name="plannedAmount"
              type="number"
              min="0.01"
              step="0.01"
              defaultValue={goal?.planned_amount ?? ""}
              className={fieldClass}
              placeholder="10"
            />
          </Field>
          <Field label="Frequency">
            <select name="cadence" defaultValue={goal?.cadence ?? ""} className={fieldClass}>
              <option value="">None</option>
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
            </select>
          </Field>
          <Field label="Start date">
            <input
              name="startDate"
              type="date"
              defaultValue={goal?.start_date ?? today}
              className={fieldClass}
            />
          </Field>
        </div>
      </div>
      <div className="sm:col-span-2 space-y-3">
        <Feedback error={state.error} success={state.success} />
        <button className={primaryButtonClass} disabled={pending}>
          {pending ? "Saving…" : goal ? "Save goal" : "Add personal goal"}
        </button>
      </div>
    </form>
  );
}
