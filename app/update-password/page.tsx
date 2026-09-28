import Link from "next/link";
import { redirect } from "next/navigation";
import { UpdatePasswordForm } from "@/components/auth/AuthForms";
import { getSignedInUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function UpdatePasswordPage() {
  const user = await getSignedInUser();
  if (!user) redirect("/forgot-password");

  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-6 py-16">
      <Link href="/" className="mb-8 font-serif text-2xl text-sage-dark">
        SaveTogether
      </Link>
      <div className="rounded-3xl bg-card p-8 shadow-sm">
        <h1 className="font-serif text-3xl">Choose a new password</h1>
        <p className="mt-2 mb-6 text-sm text-muted">
          This page is only available after you open the reset link in your email.
        </p>
        <UpdatePasswordForm />
      </div>
    </main>
  );
}
