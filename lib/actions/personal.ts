"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import type { Cadence } from "@/lib/database.types";
import { requireUser } from "@/lib/auth";
import { parseAmount } from "@/lib/format";
import { createClient } from "@/lib/supabase/server";

export type FormState = {
  error?: string;
  success?: string;
};

function plannedFields(formData: FormData) {
  const plannedRaw = String(formData.get("plannedAmount") ?? "").trim();
  const cadenceRaw = String(formData.get("cadence") ?? "").trim();
  const startDate = String(formData.get("startDate") ?? "").trim();

  if (!plannedRaw && !cadenceRaw) {
    return { planned_amount: null, cadence: null, start_date: startDate || null };
  }

  const planned_amount = parseAmount(plannedRaw);
  const cadence = (["daily", "weekly", "monthly"] as const).includes(
    cadenceRaw as Cadence,
  )
    ? (cadenceRaw as Cadence)
    : null;

  if (!planned_amount || !cadence || !startDate) {
    return {
      error:
        "A planned path needs an amount, a frequency, and a start date — or leave all three blank.",
    };
  }

  return { planned_amount, cadence, start_date: startDate };
}

export async function createGoalAction(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const user = await requireUser();
  const name = String(formData.get("name") ?? "").trim();
  const target_amount = parseAmount(formData.get("targetAmount"));
  const planned = plannedFields(formData);

  if (!name) return { error: "Give this goal a name." };
  if (!target_amount) return { error: "Enter a target amount greater than 0." };
  if ("error" in planned) return { error: planned.error };

  const supabase = await createClient();
  const { error } = await supabase.from("private_goals").insert({
    user_id: user.id,
    name,
    target_amount,
    planned_amount: planned.planned_amount,
    cadence: planned.cadence,
    start_date: planned.start_date,
  });

  if (error) return { error: error.message };
  revalidatePath("/personal");
  revalidatePath("/dashboard");
  return { success: "Goal added to your personal savings." };
}

export async function updateGoalAction(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  await requireUser();
  const goalId = String(formData.get("goalId") ?? "");
  const name = String(formData.get("name") ?? "").trim();
  const target_amount = parseAmount(formData.get("targetAmount"));
  const planned = plannedFields(formData);

  if (!goalId) return { error: "Missing goal." };
  if (!name) return { error: "Give this goal a name." };
  if (!target_amount) return { error: "Enter a target amount greater than 0." };
  if ("error" in planned) return { error: planned.error };

  const supabase = await createClient();
  const { error } = await supabase
    .from("private_goals")
    .update({
      name,
      target_amount,
      planned_amount: planned.planned_amount,
      cadence: planned.cadence,
      start_date: planned.start_date,
    })
    .eq("id", goalId);

  if (error) return { error: error.message };
  revalidatePath("/personal");
  revalidatePath(`/personal/${goalId}`);
  revalidatePath("/dashboard");
  return { success: "Goal updated." };
}

export async function deleteGoalAction(formData: FormData) {
  await requireUser();
  const goalId = String(formData.get("goalId") ?? "");
  const supabase = await createClient();
  await supabase.from("private_goals").delete().eq("id", goalId);
  revalidatePath("/personal");
  revalidatePath("/dashboard");
  redirect("/personal");
}

export async function upsertPersonalRecordAction(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const user = await requireUser();
  const goalId = String(formData.get("goalId") ?? "");
  const recordId = String(formData.get("recordId") ?? "");
  const amount = parseAmount(formData.get("amount"));
  const recorded_on = String(formData.get("recordedOn") ?? "");
  const note = String(formData.get("note") ?? "").trim() || null;

  if (!goalId) return { error: "Missing goal." };
  if (!amount) return { error: "Enter a confirmed amount greater than 0." };
  if (!recorded_on) return { error: "Choose the date you set this money aside." };

  const supabase = await createClient();
  const payload = {
    user_id: user.id,
    amount,
    recorded_on,
    note,
    private_goal_id: goalId,
    plan_id: null,
  };

  const { error } = recordId
    ? await supabase.from("savings_records").update(payload).eq("id", recordId)
    : await supabase.from("savings_records").insert(payload);

  if (error) return { error: error.message };
  revalidatePath(`/personal/${goalId}`);
  revalidatePath("/personal");
  revalidatePath("/dashboard");
  return { success: recordId ? "Record updated." : "Confirmed saved." };
}

export async function deletePersonalRecordAction(formData: FormData) {
  await requireUser();
  const goalId = String(formData.get("goalId") ?? "");
  const recordId = String(formData.get("recordId") ?? "");
  const supabase = await createClient();
  await supabase.from("savings_records").delete().eq("id", recordId);
  revalidatePath(`/personal/${goalId}`);
  revalidatePath("/personal");
  revalidatePath("/dashboard");
}
