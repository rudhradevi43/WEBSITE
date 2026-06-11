"use client";

import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { Building2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { apiFetch } from "@/lib/api";

interface Company {
  id: string;
  name: string;
  hiringFrequency?: string;
  sponsorshipHistory?: string;
  sponsorshipConfidenceScore: number;
  techStack: string[];
  country: { name: string };
  visaPrograms: Array<{ name: string }>;
  _count?: { jobs: number };
}

export default function CompaniesPage() {
  const { data } = useSession();
  const token = data?.accessToken ?? "";
  const { data: companies = [] } = useQuery({
    queryKey: ["companies"],
    enabled: Boolean(token),
    queryFn: () => apiFetch<Company[]>("/companies", { token })
  });

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-semibold uppercase tracking-widest text-emerald-600">Sponsor database</p>
        <h1 className="mt-2 text-4xl font-semibold tracking-tight">Companies known to sponsor visas</h1>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        {companies.map((company) => (
          <Card key={company.id} className="overflow-hidden">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="grid h-11 w-11 place-items-center rounded-2xl bg-navy-950 text-white">
                  <Building2 className="h-5 w-5" />
                </div>
                <Badge className="border-emerald-200 bg-emerald-50 text-emerald-700">
                  {company.sponsorshipConfidenceScore}% confidence
                </Badge>
              </div>
              <CardTitle>{company.name}</CardTitle>
              <p className="text-sm text-muted-foreground">
                {company.country.name} · {company.hiringFrequency ?? "Medium"} hiring frequency · {company._count?.jobs ?? 0} jobs
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">{company.sponsorshipHistory}</p>
              <div className="flex flex-wrap gap-2">
                {company.visaPrograms.map((program) => (
                  <Badge key={program.name}>{program.name}</Badge>
                ))}
              </div>
              <div className="flex flex-wrap gap-2">
                {company.techStack.map((tech) => (
                  <Badge key={tech} className="bg-muted">
                    {tech}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
