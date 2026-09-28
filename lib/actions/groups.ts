"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireUser } from "@/lib/auth";
import { parseAmount } from "@/lib/format";
import { createInviteCode } from "@/lib/invite";
import { createClient } from "@/lib/supabase/server";

export type FormState = {
  error?: string;
  success?: string;
};

function mapJoinError(message: string) {
  if (message.includes("INVITE_NOT_FOUND")) {
    return "That invitation code was not found. Check the code and try again.";
  }
  if (message.includes("CREATOR_CANNOT_LEAVE")) {
    return "The plan creator can edit or delete the plan instead of leaving.";
  }
  if (message.includes("NOT_A_MEMBER")) {
    return "You are not a member of this plan.";
  }
  return message;
}

export async function createPlanAction(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const user = await requireUser();
  const title = String(formData.get("title") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const target_amount = parseAmount(formData.get("targetAmount"));

  if (!title) return { error: "Give the group plan a title." };
  if (!target_amount) return { error: "Enter a shared target greater than 0." };

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("group_plans")
    .insert({
      creator_id: user.id,
      title,
      description,
      target_amount,
      invite_code: createInviteCode(),
      member_ids: [user.id],
    })
    .select("id")
    .single();

  if (error) return { error: error.message };
  revalidatePath("/groups");
  revalidatePath("/dashboard");
  redirect(`/groups/${data.id}`);
}

export async function updatePlanAction(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  await requireUser();
  const planId = String(formData.get("planId") ?? "");
  const title = String(formData.get("title") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const target_amount = parseAmount(formData.get("targetAmount"));

  if (!planId) return { error: "Missing plan." };
  if (!title) return { error: "Give the group plan a title." };
  if (!target_amount) return { error: "Enter a shared target greater than 0." };

  const supabase = await createClient();
  const { error } = await supabase
    .from("group_plans")
    .update({ title, description, target_amount })
    .eq("id", planId);

  if (error) return { error: error.message };
  revalidatePath(`/groups/${planId}`);
  revalidatePath("/groups");
  revalidatePath("/dashboard");
  return { success: "Plan details updated." };
}

export async function deletePlanAction(formData: FormData) {
  await requireUser();
  const planId = String(formData.get("planId") ?? "");
  const supabase = await createClient();
  await supabase.from("group_plans").delete().eq("id", planId);
  revalidatePath("/groups");
  revalidatePath("/dashboard");
  redirect("/groups");
}

export async function joinPlanAction(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  await requireUser();
  const invite = String(formData.get("inviteCode") ?? "").trim();
  if (!invite) return { error: "Enter the invitation code from a friend." };

  const supabase = await createClient();
  const { data, error } = await supabase.rpc("join_plan", { invite });
  if (error) return { error: mapJoinError(error.message) };

  revalidatePath("/groups");
  revalidatePath("/dashboard");
  redirect(`/groups/${data}`);
}

export async function leavePlanAction(formData: FormData) {
  await requireUser();
  const planId = String(formData.get("planId") ?? "");
  const supabase = await createClient();
  const { error } = await supabase.rpc("leave_plan", { plan: planId });
  if (error) {
    redirect(`/groups/${planId}?error=${encodeURIComponent(mapJoinError(error.message))}`);
  }
  revalidatePath("/groups");
  revalidatePath("/dashboard");
  redirect("/groups");
}

export async function upsertGroupRecordAction(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const user = await requireUser();
  const planId = String(formData.get("planId") ?? "");
  const recordId = String(formData.get("recordId") ?? "");
  const amount = parseAmount(formData.get("amount"));
  const recorded_on = String(formData.get("recordedOn") ?? "");
  const note = String(formData.get("note") ?? "").trim() || null;

  if (!planId) return { error: "Missing plan." };
  if (!amount) return { error: "Enter a confirmed amount greater than 0." };
  if (!recorded_on) return { error: "Choose the date you set this money aside." };

  const supabase = await createClient();
  const payload = {
    user_id: user.id,
    amount,
    recorded_on,
    note,
    plan_id: planId,
    private_goal_id: null,
  };

  const { error } = recordId
    ? await supabase.from("savings_records").update(payload).eq("id", recordId)
    : await supabase.from("savings_records").insert(payload);

  if (error) return { error: error.message };
  revalidatePath(`/groups/${planId}`);
  revalidatePath("/groups");
  revalidatePath("/dashboard");
  return { success: recordId ? "Record updated." : "Contribution recorded." };
}

export async function deleteGroupRecordAction(formData: FormData) {
  await requireUser();
  const planId = String(formData.get("planId") ?? "");
  const recordId = String(formData.get("recordId") ?? "");
  const supabase = await createClient();
  await supabase.from("savings_records").delete().eq("id", recordId);
  revalidatePath(`/groups/${planId}`);
  revalidatePath("/groups");
  revalidatePath("/dashboard");
}
