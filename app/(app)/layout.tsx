import type { ReactNode } from "react";
import { AppNav } from "@/components/AppNav";
import { requireProfile } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function AppLayout({
  children,
}: {
  children: ReactNode;
}) {
  const { profile } = await requireProfile();

  return (
    <div className="min-h-screen">
      <AppNav displayName={profile.display_name} />
      <main className="mx-auto max-w-5xl px-4 py-8">{children}</main>
    </div>
  );
}
