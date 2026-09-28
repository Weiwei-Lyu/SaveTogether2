import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";

function safeNextPath(value: string | null) {
  return value === "/update-password" ? "/update-password" : null;
}

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = safeNextPath(searchParams.get("next"));
  const type = searchParams.get("type");
  const isRecovery = next === "/update-password" || type === "recovery";

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      if (isRecovery) {
        return NextResponse.redirect(`${origin}/update-password`);
      }
      await supabase.auth.signOut();
      return NextResponse.redirect(`${origin}/login?confirmed=1`);
    }
  }

  return NextResponse.redirect(
    `${origin}/${isRecovery ? "forgot-password" : "login"}?error=confirm`,
  );
}
