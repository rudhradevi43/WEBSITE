"use client";

import { FormEvent, useMemo, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { DEFAULT_SKILLS, JobSearchResult, SUPPORTED_COUNTRIES } from "@visapath/shared";
import { ExternalLink, Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { apiFetch } from "@/lib/api";

export default function SearchPage() {
  const { data } = useSession();
  const token = data?.accessToken ?? "";
  const [title, setTitle] = useState("Power Platform Developer");
  const [skills, setSkills] = useState("Power BI, Python, Dataverse, Power Apps");
  const [country, setCountry] = useState("United Kingdom");
  const [salaryMin, setSalaryMin] = useState("55000");
  const [remote, setRemote] = useState("");
  const [sponsorshipRequired, setSponsorshipRequired] = useState(true);

  const search = useMutation({
    mutationFn: () =>
      apiFetch<JobSearchResult[]>("/jobs/search", {
        token,
        method: "POST",
        body: JSON.stringify({
          title,
          skills: skills.split(",").map((skill) => skill.trim()).filter(Boolean),
          countries: country ? [country] : [],
          salaryMin: salaryMin ? Number(salaryMin) : undefined,
          sponsorshipRequired,
          remoteTypes: remote ? [remote] : undefined
        })
      })
  });

  const saveApplication = useMutation({
    mutationFn: (job: JobSearchResult) =>
      apiFetch("/applications", {
        token,
        method: "POST",
        body: JSON.stringify({
          company: job.companyName,
          jobTitle: job.roleTitle,
          location: `${job.city}, ${job.country}`,
          visaType: job.visaType,
          status: "SAVED",
          salary: job.salary,
          notes: `Source: ${job.source}. Apply: ${job.applyLink}`
        })
      })
  });

  const results = useMemo(() => search.data ?? [], [search.data]);

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    search.mutate();
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-semibold uppercase tracking-widest text-emerald-600">Visa job search</p>
        <h1 className="mt-2 text-4xl font-semibold tracking-tight">Find sponsor-ready technology roles</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Search criteria</CardTitle>
          <CardDescription>Default keywords are tuned for Power Platform, BI, automation, and data profiles.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="grid gap-4 lg:grid-cols-4">
            <div className="space-y-2 lg:col-span-2">
              <Label>Job title</Label>
              <Input value={title} onChange={(event) => setTitle(event.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Country</Label>
              <Select value={country} onChange={(event) => setCountry(event.target.value)}>
                {SUPPORTED_COUNTRIES.map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Salary minimum</Label>
              <Input value={salaryMin} onChange={(event) => setSalaryMin(event.target.value)} inputMode="numeric" />
            </div>
            <div className="space-y-2 lg:col-span-2">
              <Label>Skills</Label>
              <Input value={skills} onChange={(event) => setSkills(event.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Remote</Label>
              <Select value={remote} onChange={(event) => setRemote(event.target.value)}>
                <option value="">Any</option>
                <option value="REMOTE">Remote</option>
                <option value="HYBRID">Hybrid</option>
                <option value="ONSITE">Onsite</option>
              </Select>
            </div>
            <label className="flex items-center gap-3 self-end rounded-xl border px-3 py-3 text-sm">
              <input
                type="checkbox"
                checked={sponsorshipRequired}
                onChange={(event) => setSponsorshipRequired(event.target.checked)}
              />
              Sponsorship required
            </label>
            <Button className="lg:col-span-4" disabled={search.isPending}>
              <Search className="h-4 w-4" />
              {search.isPending ? "Searching..." : "Search all sources"}
            </Button>
          </form>
          <div className="mt-4 flex flex-wrap gap-2">
            {DEFAULT_SKILLS.slice(0, 8).map((skill) => (
              <Badge key={skill}>{skill}</Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4">
        {results.map((job) => (
          <Card key={job.id} className="overflow-hidden">
            <CardContent className="grid gap-4 p-5 lg:grid-cols-[1fr_220px]">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <Badge className="border-emerald-200 bg-emerald-50 text-emerald-700">{job.matchScore}% match</Badge>
                  <Badge>{job.remoteType}</Badge>
                  <Badge>{job.source}</Badge>
                  <Badge>{job.sponsorshipAvailable ? "Visa sponsorship: Yes" : "Visa sponsorship: No"}</Badge>
                </div>
                <h2 className="mt-3 text-xl font-semibold">{job.roleTitle}</h2>
                <p className="text-sm text-muted-foreground">
                  {job.companyName} · {job.city}, {job.country} · {job.salary ?? "Competitive"}
                </p>
                <p className="mt-2 text-sm text-muted-foreground">Visa type: {job.visaType ?? "Not specified"}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {job.skills.slice(0, 8).map((skill) => (
                    <Badge key={skill}>{skill}</Badge>
                  ))}
                </div>
              </div>
              <div className="flex flex-col justify-between gap-3">
                <p className="text-sm text-muted-foreground">Posted {new Date(job.datePosted).toLocaleDateString()}</p>
                <div className="space-y-2">
                  <Button variant="outline" className="w-full" onClick={() => saveApplication.mutate(job)}>
                    Save to tracker
                  </Button>
                  <Button className="w-full">
                    <a href={job.applyLink} target="_blank" rel="noreferrer" className="flex items-center gap-2">
                      Apply <ExternalLink className="h-4 w-4" />
                    </a>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
