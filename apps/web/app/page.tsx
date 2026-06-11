import Link from "next/link";
import { ArrowRight, CheckCircle2, Globe2, ShieldCheck, Sparkles } from "lucide-react";
import { AnimatedPanel } from "@/components/animated-panel";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const features = [
  "Visa-sponsored job search across 14 countries",
  "AI resume matching and skill gap recommendations",
  "Kanban application tracker with follow-up automation",
  "Sponsor company database and confidence scoring"
];

export default function HomePage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-7xl flex-col px-6 py-8">
      <header className="flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <div className="grid h-11 w-11 place-items-center rounded-2xl bg-navy-950 font-black text-white">V</div>
          <div>
            <p className="text-lg font-bold">VisaPath AI</p>
            <p className="text-xs text-muted-foreground">Global sponsorship intelligence</p>
          </div>
        </Link>
        <div className="flex items-center gap-3">
          <Button variant="ghost">
            <Link href="/login">Log in</Link>
          </Button>
          <Button>
            <Link href="/login" className="flex items-center gap-2">
              Launch app <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </header>

      <section className="grid flex-1 items-center gap-12 py-16 lg:grid-cols-[1.1fr_0.9fr]">
        <AnimatedPanel>
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border bg-white px-4 py-2 text-sm font-medium text-slate-600 shadow-sm dark:bg-card">
            <Sparkles className="h-4 w-4 text-emerald-500" />
            Built for Power Platform, BI, data, and automation careers
          </div>
          <h1 className="max-w-4xl text-5xl font-semibold tracking-tight text-navy-950 dark:text-white md:text-7xl">
            Find visa-sponsored tech roles with executive-grade tracking.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-muted-foreground">
            Search sponsor-friendly roles, score your resume, track applications, and automate follow-ups across the UK,
            Europe, Canada, and Australia.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button size="lg">
              <Link href="/login" className="flex items-center gap-2">
                Start with demo account <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline">
              <Link href="/app/search">Explore job search</Link>
            </Button>
          </div>
        </AnimatedPanel>

        <AnimatedPanel delay={0.12}>
          <Card className="overflow-hidden border-slate-200 bg-white/80 shadow-premium backdrop-blur dark:bg-card/80">
            <CardContent className="p-0">
              <div className="border-b bg-navy-950 p-6 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-300">Match Score</p>
                    <p className="text-5xl font-bold text-emerald-400">92%</p>
                  </div>
                  <ShieldCheck className="h-12 w-12 text-emerald-400" />
                </div>
                <p className="mt-4 text-sm text-slate-300">Power Platform Developer · UK Skilled Worker Visa</p>
              </div>
              <div className="space-y-4 p-6">
                {features.map((feature) => (
                  <div key={feature} className="flex items-start gap-3">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 text-emerald-500" />
                    <span className="text-sm text-slate-700 dark:text-slate-200">{feature}</span>
                  </div>
                ))}
                <div className="rounded-2xl bg-muted p-4">
                  <div className="mb-3 flex items-center gap-2 text-sm font-semibold">
                    <Globe2 className="h-4 w-4 text-emerald-500" />
                    Countries covered
                  </div>
                  <p className="text-sm text-muted-foreground">
                    United Kingdom, Germany, Netherlands, Ireland, Nordics, Switzerland, Austria, Belgium, France, Canada,
                    and Australia.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </AnimatedPanel>
      </section>
    </main>
  );
}
