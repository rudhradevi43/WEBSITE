import { AppShell } from "@/components/app-shell";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const defaultKeywords = ["Power Apps", "Power Automate", "Power BI", "DAX", "Dataverse", "Python", "SQL", "ETL"];
const countries = ["United Kingdom", "Germany", "Netherlands", "Ireland", "Canada", "Australia"];

export default function DashboardPage() {
  return (
    <AppShell>
      <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <Card className="overflow-hidden">
          <CardHeader>
            <Badge className="w-fit border-emerald-200 bg-emerald-50 text-emerald-700 dark:bg-emerald-950">
              Production SaaS workspace
            </Badge>
            <CardTitle className="text-3xl">Your visa-sponsored career pipeline</CardTitle>
            <p className="max-w-2xl text-slate-500">
              Search roles, compare sponsorship likelihood, upload resumes for AI matching, and manage every application
              from saved job to visa processing.
            </p>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-3">
            {[
              ["92%", "Example match score"],
              ["7 days", "Follow-up rule"],
              ["14", "supported countries"]
            ].map(([value, label]) => (
              <div key={label} className="rounded-2xl border bg-white p-5 dark:bg-slate-950">
                <p className="text-3xl font-bold tracking-tight">{value}</p>
                <p className="mt-1 text-sm text-slate-500">{label}</p>
              </div>
            ))}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Default candidate profile</CardTitle>
            <p className="text-sm text-slate-500">Suggested keywords are optimized for Power Platform, BI, data, and automation.</p>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            {defaultKeywords.map((keyword) => (
              <Badge key={keyword}>{keyword}</Badge>
            ))}
          </CardContent>
        </Card>
      </section>
      <section className="mt-6 grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Target markets</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3 sm:grid-cols-2">
            {countries.map((country) => (
              <div key={country} className="rounded-xl border bg-white p-4 text-sm font-medium dark:bg-slate-950">
                {country}
              </div>
            ))}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Automation rules</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-slate-600 dark:text-slate-300">
            <p>New matching jobs can trigger email notifications through Resend.</p>
            <p>Applications with no contact for 7 days are flagged with follow-up required.</p>
            <p>AI services generate match scores, skills gaps, recommendations, and cover letter variants.</p>
          </CardContent>
        </Card>
      </section>
    </AppShell>
  );
}
