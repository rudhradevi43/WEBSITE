import Link from "next/link";
import { ArrowRight, CheckCircle2, Globe2, ShieldCheck, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const features = [
  "Visa-sponsored job search across 14 target countries",
  "AI resume matching with skills gap recommendations",
  "Kanban application tracker with follow-up automation",
  "Sponsor company database and analytics dashboard"
];

export default function HomePage() {
  return (
    <main className="min-h-screen px-6 py-10">
      <nav className="mx-auto flex max-w-7xl items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-950 text-white">VP</div>
          <span className="text-xl font-bold tracking-tight">VisaPath AI</span>
        </div>
        <div className="flex gap-3">
          <Button asChild variant="ghost">
            <Link href="/login">Sign in</Link>
          </Button>
          <Button asChild>
            <Link href="/dashboard">Open workspace</Link>
          </Button>
        </div>
      </nav>
      <section className="mx-auto grid max-w-7xl items-center gap-12 py-24 lg:grid-cols-[1.05fr_0.95fr]">
        <div>
          <div className="mb-6 inline-flex rounded-full border bg-white px-4 py-2 text-sm text-slate-600 shadow-sm dark:bg-slate-900 dark:text-slate-300">
            <Sparkles className="mr-2 h-4 w-4 text-emerald-600" />
            Built for Power Platform, BI, data, and automation careers
          </div>
          <h1 className="text-5xl font-semibold tracking-tight text-slate-950 dark:text-white lg:text-7xl">
            Find and manage visa-sponsored technology roles with confidence.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600 dark:text-slate-300">
            VisaPath AI combines sponsor intelligence, job matching, resume analysis, cover letter generation, and
            application tracking for candidates pursuing international career moves.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild size="lg">
              <Link href="/search">
                Search jobs <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="secondary" size="lg">
              <Link href="/tracker">View tracker</Link>
            </Button>
          </div>
        </div>
        <Card className="p-2">
          <CardContent className="space-y-5 p-6">
            {features.map((feature) => (
              <div key={feature} className="flex items-start gap-3 rounded-xl border bg-white p-4 dark:bg-slate-950">
                <CheckCircle2 className="mt-0.5 h-5 w-5 text-emerald-600" />
                <span className="font-medium">{feature}</span>
              </div>
            ))}
            <div className="grid gap-4 pt-4 sm:grid-cols-2">
              <div className="rounded-2xl bg-slate-950 p-5 text-white">
                <Globe2 className="mb-6 h-6 w-6 text-emerald-400" />
                <p className="text-3xl font-bold">14</p>
                <p className="text-sm text-slate-300">supported countries</p>
              </div>
              <div className="rounded-2xl bg-emerald-600 p-5 text-white">
                <ShieldCheck className="mb-6 h-6 w-6" />
                <p className="text-3xl font-bold">RBAC</p>
                <p className="text-sm text-emerald-50">secure SaaS foundation</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>
    </main>
  );
}
