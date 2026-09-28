import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-6">
      <h1 className="font-serif text-3xl">Page not found</h1>
      <p className="mt-3 text-muted">
        That goal or group plan may have been deleted, or you no longer have access.
      </p>
      <Link href="/dashboard" className="mt-6 text-sage-dark underline">
        Back to dashboard
      </Link>
    </main>
  );
}
