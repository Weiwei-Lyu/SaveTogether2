import Link from "next/link";
import { redirect } from "next/navigation";
import { SignUpForm } from "@/components/auth/AuthForms";
import { getSignedInUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function SignUpPage({
  searchParams,
}: {
  searchParams: Promise<{ "check-email"?: string }>;
}) {
  const user = await getSignedInUser();
  if (user) redirect("/dashboard");
  const params = await searchParams;

  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-6 py-16">
      <Link href="/" className="mb-8 font-serif text-2xl text-sage-dark">
        SaveTogether
      </Link>
      {params["check-email"] ? (
        <div className="rounded-3xl bg-card p-8 shadow-sm">
          <h1 className="font-serif text-3xl">Check your email</h1>
          <p className="mt-4 leading-relaxed text-muted">
            We sent a confirmation link. Open it, then log in with the same
            password you just created. There is no code to type.
          </p>
          <Link
            href="/login"
            className="mt-6 inline-flex rounded-full bg-sage px-5 py-2.5 text-sm font-medium text-white"
          >
            Go to log in
          </Link>
        </div>
      ) : (
        <div className="rounded-3xl bg-card p-8 shadow-sm">
          <h1 className="font-serif text-3xl">Create your account</h1>
          <p className="mt-2 mb-6 text-sm text-muted">
            Start a private ledger. You can join friends after you confirm your email.
          </p>
          <SignUpForm />
        </div>
      )}
    </main>
  );
}
