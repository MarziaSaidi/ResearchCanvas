import Link from "next/link";
import { signOut } from "@/app/login/actions";
import { ThemeToggle } from "./ThemeToggle";

export function TopNav({ email }: { email?: string }) {
  return (
    <header className="border-b border-border">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
        <Link
          href="/"
          className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-text"
        >
          <span className="h-2 w-2 rounded-full bg-accent" aria-hidden />
          ResearchCanvas
        </Link>
        <nav className="flex items-center gap-5 font-mono text-xs uppercase tracking-wide text-muted">
          <Link href="/papers" className="hover:text-text">
            My papers
          </Link>
          {email && <span className="hidden normal-case sm:inline">{email}</span>}
          <form action={signOut}>
            <button className="uppercase hover:text-text">Sign out</button>
          </form>
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}
