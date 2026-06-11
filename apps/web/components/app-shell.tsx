"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BriefcaseBusiness, Building2, ChartNoAxesCombined, LayoutDashboard, Moon, Search, Sun, Upload } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const nav = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/search", label: "Search", icon: Search },
  { href: "/tracker", label: "Tracker", icon: BriefcaseBusiness },
  { href: "/resume", label: "Resume AI", icon: Upload },
  { href: "/companies", label: "Sponsors", icon: Building2 },
  { href: "/analytics", label: "Analytics", icon: ChartNoAxesCombined }
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();

  return (
    <div className="min-h-screen">
      <aside className="fixed inset-y-0 left-0 z-20 hidden w-72 border-r bg-white/85 px-4 py-6 backdrop-blur-xl dark:bg-slate-950/85 lg:block">
        <Link href="/" className="flex items-center gap-3 px-2">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-950 text-white dark:bg-emerald-500 dark:text-slate-950">
            VP
          </div>
          <div>
            <p className="text-lg font-bold tracking-tight">VisaPath AI</p>
            <p className="text-xs text-slate-500">Sponsored career command center</p>
          </div>
        </Link>
        <nav className="mt-10 space-y-1">
          {nav.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition",
                  active
                    ? "bg-slate-950 text-white shadow-lg shadow-slate-950/10 dark:bg-emerald-500 dark:text-slate-950"
                    : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-900"
                )}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>
      <main className="lg:pl-72">
        <header className="sticky top-0 z-10 border-b bg-white/80 px-6 py-4 backdrop-blur-xl dark:bg-slate-950/80">
          <div className="mx-auto flex max-w-7xl items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">Enterprise visa-sponsored job intelligence</p>
              <h1 className="text-xl font-semibold tracking-tight">VisaPath AI Workspace</h1>
            </div>
            <Button variant="secondary" size="sm" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
              <Sun className="mr-2 h-4 w-4 dark:hidden" />
              <Moon className="mr-2 hidden h-4 w-4 dark:block" />
              Theme
            </Button>
          </div>
        </header>
        <div className="mx-auto max-w-7xl px-6 py-8">{children}</div>
      </main>
    </div>
  );
}
