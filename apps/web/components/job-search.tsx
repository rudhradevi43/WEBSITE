"use client";

import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { ExternalLink, Save } from "lucide-react";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { apiFetch, Job } from "@/lib/api";
import { formatCurrency } from "@/lib/utils";

const fallbackJobs: Job[] = [
  {
    id: "demo-1",
    title: "Power Platform Developer",
    city: "London",
    salaryMin: 65000,
    salaryMax: 85000,
    currency: "GBP",
    sponsorshipAvailable: true,
    visaType: "Skilled Worker visa",
    workMode: "HYBRID",
    matchScore: 94,
    applyUrl: "https://careers.microsoft.com",
    postedAt: new Date().toISOString(),
    company: { name: "Microsoft" },
    country: { name: "United Kingdom", code: "GB" },
    skills: [{ name: "Power BI" }, { name: "DAX" }, { name: "Dataverse" }, { name: "Power Apps" }]
  }
];

export function JobSearch() {
  const { data: session } = useSession();
  const [title, setTitle] = useState("Power Platform Developer");
  const [skills, setSkills] = useState("Power BI, Python, Dataverse, Power Apps");
  const [countries, setCountries] = useState("United Kingdom");

  const query = useQuery({
    queryKey: ["jobs", title, skills, countries, session?.accessToken],
    queryFn: async () => {
      const params = new URLSearchParams({
        title,
        sponsorshipRequired: "true",
        skills: skills.split(",").map((skill) => skill.trim()).filter(Boolean).join(","),
        countries: countries.split(",").map((country) => country.trim()).filter(Boolean).join(",")
      });
      return apiFetch<Job[]>(`/jobs?${params}`, { token: session?.accessToken });
    },
    retry: false
  });

  const jobs = query.data?.length ? query.data : fallbackJobs;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Visa sponsored job search</CardTitle>
          <p className="text-sm text-slate-500">Search LinkedIn, Indeed, EURES, UK sponsors, Job Bank Canada, SEEK, and company pages via API integrations.</p>
        </CardHeader>
        <CardContent className="grid gap-4 lg:grid-cols-[1fr_1.2fr_1fr_auto]">
          <Input value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Job title" />
          <Input value={skills} onChange={(event) => setSkills(event.target.value)} placeholder="Skills" />
          <Input value={countries} onChange={(event) => setCountries(event.target.value)} placeholder="Countries" />
          <Button onClick={() => query.refetch()}>Search</Button>
        </CardContent>
      </Card>

      <div className="grid gap-4">
        {jobs.map((job, index) => (
          <motion.div key={job.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.04 }}>
            <Card>
              <CardContent className="grid gap-5 p-6 lg:grid-cols-[1fr_auto]">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge className="border-emerald-200 bg-emerald-50 text-emerald-700 dark:bg-emerald-950">
                      {job.matchScore}% match
                    </Badge>
                    <Badge>{job.sponsorshipAvailable ? "Visa sponsorship: Yes" : "Visa sponsorship: No"}</Badge>
                    <Badge>{job.workMode}</Badge>
                  </div>
                  <h2 className="mt-3 text-2xl font-semibold tracking-tight">{job.title}</h2>
                  <p className="mt-1 text-slate-500">
                    {job.company?.name ?? "Confidential"} · {[job.city, job.country.name].filter(Boolean).join(", ")}
                  </p>
                  <p className="mt-3 font-medium">
                    {formatCurrency(job.salaryMin, job.currency)} - {formatCurrency(job.salaryMax, job.currency)}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {job.skills.map((skill) => (
                      <Badge key={skill.name}>{skill.name}</Badge>
                    ))}
                  </div>
                </div>
                <div className="flex flex-col justify-between gap-3 lg:items-end">
                  <p className="text-sm text-slate-500">Visa type: {job.visaType ?? "To confirm"}</p>
                  <div className="flex gap-2">
                    <Button variant="secondary">
                      <Save className="mr-2 h-4 w-4" /> Save
                    </Button>
                    <Button asChild>
                      <a href={job.applyUrl} target="_blank" rel="noreferrer">
                        Apply <ExternalLink className="ml-2 h-4 w-4" />
                      </a>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
