import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function getSignedInUser() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user) return null;
  return data.user;
}

export async function requireUser() {
  const user = await getSignedInUser();
  if (!user) redirect("/login");
  return user;
}

export async function requireProfile() {
  const user = await requireUser();
  const supabase = await createClient();
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .maybeSingle();

  return {
    user,
    profile: profile ?? {
      id: user.id,
      display_name: "Saver",
      created_at: user.created_at,
    },
  };
}
