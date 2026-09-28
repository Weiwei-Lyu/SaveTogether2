import Link from "next/link";
import { redirect } from "next/navigation";
import { SignInForm } from "@/components/auth/AuthForms";
import { Feedback } from "@/components/Feedback";
import { getSignedInUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ confirmed?: string; error?: string; reset?: string }>;
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
        <h1 className="font-serif text-3xl">Welcome back</h1>
        <p className="mt-2 mb-6 text-sm text-muted">
          Log in with the email and password you used to sign up.
        </p>
        {params.confirmed ? (
          <div className="mb-4">
            <Feedback success="Email confirmed. Log in with the same password." />
          </div>
        ) : null}
        {params.reset ? (
          <div className="mb-4">
            <Feedback success="Password updated. Log in with your new password." />
          </div>
        ) : null}
        {params.error === "confirm" ? (
          <div className="mb-4">
            <Feedback error="We could not confirm that link. Try logging in, or request a new reset link." />
          </div>
        ) : null}
        <SignInForm />
      </div>
    </main>
  );
}
