"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { BarChart3, BriefcaseBusiness, Building2, FileText, Search, Settings, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/app", label: "Overview", icon: Sparkles },
  { href: "/app/search", label: "Job Search", icon: Search },
  { href: "/app/resume", label: "Resume Match", icon: FileText },
  { href: "/app/tracker", label: "Tracker", icon: BriefcaseBusiness },
  { href: "/app/companies", label: "Sponsors", icon: Building2 },
  { href: "/app/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/app/saved-searches", label: "Saved Searches", icon: Settings }
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { data } = useSession();

  return (
    <div className="grid min-h-screen bg-muted/40 lg:grid-cols-[280px_1fr]">
      <aside className="hidden border-r bg-navy-950 text-white lg:block">
        <div className="flex h-full flex-col p-5">
          <Link href="/app" className="mb-8 flex items-center gap-3">
            <div className="grid h-11 w-11 place-items-center rounded-2xl bg-emerald-500 text-lg font-black text-navy-950">
              V
            </div>
            <div>
              <p className="text-lg font-bold">VisaPath AI</p>
              <p className="text-xs text-slate-400">Sponsorship command center</p>
            </div>
          </Link>
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-300 transition hover:bg-white/10 hover:text-white",
                    active && "bg-white text-navy-950 hover:bg-white hover:text-navy-950"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
          <div className="mt-auto rounded-2xl border border-white/10 bg-white/5 p-4">
            <p className="text-sm font-semibold">{data?.user?.name ?? "VisaPath User"}</p>
            <p className="mt-1 truncate text-xs text-slate-400">{data?.user?.email}</p>
            <Button variant="secondary" size="sm" className="mt-4 w-full" onClick={() => signOut({ callbackUrl: "/" })}>
              Sign out
            </Button>
          </div>
        </div>
      </aside>
      <main className="min-w-0 p-4 md:p-8">{children}</main>
    </div>
  );
}
