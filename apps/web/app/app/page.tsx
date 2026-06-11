import Link from "next/link";
import { ArrowUpRight, BriefcaseBusiness, FileText, Globe2, MailWarning } from "lucide-react";
import { DEFAULT_SKILLS } from "@visapath/shared";
import { auth } from "@/auth";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { apiFetch } from "@/lib/api";

interface Analytics {
  interviewRate: number;
  responseRate: number;
  offerRate: number;
  visaSponsorshipSuccessRate: number;
}

export default async function DashboardPage() {
  const session = await auth();
  const token = session?.accessToken ?? "";
  const analytics = token
    ? await apiFetch<Analytics>("/analytics/dashboard", { token }).catch(() => undefined)
    : undefined;

  const stats = [
    { label: "Interview rate", value: `${analytics?.interviewRate ?? 0}%`, icon: BriefcaseBusiness },
    { label: "Response rate", value: `${analytics?.responseRate ?? 0}%`, icon: MailWarning },
    { label: "Offer rate", value: `${analytics?.offerRate ?? 0}%`, icon: ArrowUpRight },
    { label: "Visa processing", value: `${analytics?.visaSponsorshipSuccessRate ?? 0}%`, icon: Globe2 }
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <p className="text-sm font-semibold uppercase tracking-widest text-emerald-600">Command center</p>
          <h1 className="mt-2 text-4xl font-semibold tracking-tight">Your visa-sponsored job pipeline</h1>
          <p className="mt-3 max-w-2xl text-muted-foreground">
            Search sponsor-friendly openings, score your resume, and keep every application moving.
          </p>
        </div>
        <Button>
          <Link href="/app/search" className="flex items-center gap-2">
            Search jobs <ArrowUpRight className="h-4 w-4" />
          </Link>
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label}>
              <CardContent className="p-5">
                <Icon className="mb-4 h-5 w-5 text-emerald-500" />
                <p className="text-sm text-muted-foreground">{stat.label}</p>
                <p className="mt-1 text-3xl font-semibold">{stat.value}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
        <Card>
          <CardHeader>
            <CardTitle>Recommended starting keywords</CardTitle>
            <CardDescription>Optimized for Power Platform, BI, data analysis, and automation profiles.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            {DEFAULT_SKILLS.map((skill) => (
              <Badge key={skill} className="border-emerald-200 bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10">
                {skill}
              </Badge>
            ))}
          </CardContent>
        </Card>

        <Card className="bg-navy-950 text-white">
          <CardHeader>
            <FileText className="h-8 w-8 text-emerald-400" />
            <CardTitle>Resume match workflow</CardTitle>
            <CardDescription className="text-slate-300">
              Upload a PDF resume, extract skills, compare against jobs, and generate targeted cover letters.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="emerald" className="w-full">
              <Link href="/app/resume">Open resume tools</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
