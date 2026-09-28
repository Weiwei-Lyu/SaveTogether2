"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOutAction } from "@/lib/actions/auth";

const links = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/personal", label: "Personal Savings" },
  { href: "/groups", label: "Group Savings" },
];

export function AppNav({ displayName }: { displayName: string }) {
  const pathname = usePathname();

  return (
    <header className="border-b border-line bg-card/90 backdrop-blur">
      <div className="mx-auto flex max-w-5xl flex-col gap-4 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
        <Link href="/dashboard" className="font-serif text-xl text-sage-dark">
          SaveTogether
        </Link>
        <nav className="flex flex-wrap gap-2" aria-label="Main">
          {links.map((link) => {
            const active =
              pathname === link.href || pathname.startsWith(`${link.href}/`);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`rounded-full px-3 py-1.5 text-sm ${
                  active
                    ? "bg-sage text-white"
                    : "text-muted hover:bg-paper hover:text-ink"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
        <div className="flex items-center gap-3 text-sm">
          <span className="text-muted">{displayName}</span>
          <form action={signOutAction}>
            <button type="submit" className="text-sage-dark hover:underline">
              Log out
            </button>
          </form>
        </div>
      </div>
    </header>
  );
}
