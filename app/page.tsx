import Link from "next/link";
import { redirect } from "next/navigation";
import { getSignedInUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const user = await getSignedInUser();
  if (user) redirect("/dashboard");

  return (
    <main className="mx-auto flex min-h-screen max-w-3xl flex-col justify-center px-6 py-16">
      <p className="text-sm font-medium tracking-wide text-sage-dark uppercase">
        Two ledgers, one planner
      </p>
      <h1 className="mt-3 font-serif text-5xl leading-tight text-ink">SaveTogether</h1>
      <p className="mt-5 max-w-xl text-lg leading-relaxed text-muted">
        Keep a private savings ledger for your own goals. Join group plans with
        friends to record shared progress. The two pots of money never mix, and a
        planned path never counts as money already saved.
      </p>
      <div className="mt-8 flex flex-wrap gap-3">
        <Link
          href="/signup"
          className="rounded-full bg-sage px-5 py-2.5 text-sm font-medium text-white hover:bg-sage-dark"
        >
          Create a free account
        </Link>
        <Link
          href="/login"
          className="rounded-full border border-line px-5 py-2.5 text-sm font-medium text-ink hover:bg-card"
        >
          Log in
        </Link>
      </div>
      <dl className="mt-14 grid gap-6 sm:grid-cols-3">
        <div className="rounded-2xl bg-card p-5 shadow-sm">
          <dt className="font-medium">Personal Savings</dt>
          <dd className="mt-2 text-sm text-muted">
            Goals, optional planned path, and confirmed records only you can see.
          </dd>
        </div>
        <div className="rounded-2xl bg-card p-5 shadow-sm">
          <dt className="font-medium">Group Savings</dt>
          <dd className="mt-2 text-sm text-muted">
            Shared targets, invite codes, and a transparent contribution history.
          </dd>
        </div>
        <div className="rounded-2xl bg-card p-5 shadow-sm">
          <dt className="font-medium">Confirmed saved</dt>
          <dd className="mt-2 text-sm text-muted">
            Progress bars move only when you record money you already set aside.
          </dd>
        </div>
      </dl>
    </main>
  );
}
