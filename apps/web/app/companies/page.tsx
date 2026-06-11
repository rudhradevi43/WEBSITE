import { AppShell } from "@/components/app-shell";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const companies = [
  ["Microsoft", "United Kingdom", "Skilled Worker visa", 92, "Power Platform, Azure, SQL"],
  ["Accenture", "Ireland", "Critical Skills Employment Permit", 90, "Microsoft 365, Power BI, ETL"],
  ["Booking.com", "Netherlands", "Highly Skilled Migrant", 88, "Python, Data, Analytics"],
  ["ASML", "Netherlands", "Highly Skilled Migrant", 86, "Data Engineering, Automation"],
  ["SAP", "Germany", "EU Blue Card", 84, "Enterprise Apps, Analytics"],
  ["Deloitte", "Canada", "Global Talent Stream", 82, "BI, Cloud, Consulting"]
];

export default function CompaniesPage() {
  return (
    <AppShell>
      <Card>
        <CardHeader>
          <CardTitle>Company sponsorship database</CardTitle>
          <p className="text-sm text-slate-500">
            Track known sponsor companies, visa programs, hiring frequency, sponsorship history, tech stack, and confidence score.
          </p>
        </CardHeader>
        <CardContent className="grid gap-4">
          {companies.map(([name, country, visa, score, stack]) => (
            <div key={name} className="grid gap-4 rounded-2xl border bg-white p-5 dark:bg-slate-950 lg:grid-cols-[1fr_1fr_auto]">
              <div>
                <h2 className="text-lg font-semibold">{name}</h2>
                <p className="text-sm text-slate-500">{country}</p>
              </div>
              <div className="space-y-2">
                <Badge>{visa}</Badge>
                <p className="text-sm text-slate-500">{stack}</p>
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold text-emerald-600">{score}%</p>
                <p className="text-xs text-slate-500">confidence</p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </AppShell>
  );
}
