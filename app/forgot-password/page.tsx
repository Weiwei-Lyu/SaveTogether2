import Link from "next/link";
import { redirect } from "next/navigation";
import { ForgotPasswordForm } from "@/components/auth/AuthForms";
import { Feedback } from "@/components/Feedback";
import { getSignedInUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function ForgotPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const user = await getSignedInUser();
  if (user) redirect("/dashboard");
  const params = await searchParams;

  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-6 py-16">
      <Link href="/" className="mb-8 font-serif text-2xl text-sage-dark">
        SaveTogether
      </Link>
      <div className="rounded-3xl bg-card p-8 shadow-sm">
        <h1 className="font-serif text-3xl">Forgot your password?</h1>
        <p className="mt-2 mb-6 text-sm text-muted">
          Enter the email you used to sign up. We will send a reset link if an
          account exists. There is no code to type.
        </p>
        {params.error === "confirm" ? (
          <div className="mb-4">
            <Feedback error="That reset link could not be used. Request a new one below." />
          </div>
        ) : null}
        <ForgotPasswordForm />
      </div>
    </main>
  );
}
