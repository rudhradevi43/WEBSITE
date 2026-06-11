"use client";

import { useState } from "react";
import { AppShell } from "@/components/app-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";

const matched = ["Power BI", "DAX", "Python", "SQL", "Dataverse"];
const missing = ["Azure Data Factory", "Docker"];

export default function ResumePage() {
  const [jobDescription, setJobDescription] = useState("Power Platform Developer role requiring Power BI, Dataverse, SQL, automation, and Azure delivery experience.");

  return (
    <AppShell>
      <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <Card>
          <CardHeader>
            <CardTitle>AI resume matching</CardTitle>
            <p className="text-sm text-slate-500">Upload PDFs through the API to extract skills, experience, certifications, and education.</p>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="rounded-2xl border bg-white p-6 dark:bg-slate-950">
              <p className="text-sm text-slate-500">Match Score</p>
              <p className="mt-2 text-6xl font-bold tracking-tight text-emerald-600">92%</p>
            </div>
            <div>
              <p className="mb-2 font-medium">Matched Skills</p>
              <div className="flex flex-wrap gap-2">
                {matched.map((skill) => (
                  <Badge key={skill} className="border-emerald-200 bg-emerald-50 text-emerald-700 dark:bg-emerald-950">
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
            <div>
              <p className="mb-2 font-medium">Missing Skills</p>
              <div className="flex flex-wrap gap-2">
                {missing.map((skill) => (
                  <Badge key={skill} className="border-amber-200 bg-amber-50 text-amber-700 dark:bg-amber-950">
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
            <p className="rounded-xl bg-slate-100 p-4 text-sm text-slate-600 dark:bg-slate-900 dark:text-slate-300">
              Learning Azure Data Factory would increase compatibility with 37 additional jobs.
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>AI cover letter generator</CardTitle>
            <p className="text-sm text-slate-500">Generate personalized, ATS optimized, concise, and detailed cover letter variants.</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea value={jobDescription} onChange={(event) => setJobDescription(event.target.value)} />
            <Button>Generate variants</Button>
            <div className="rounded-2xl border bg-white p-5 text-sm leading-6 dark:bg-slate-950">
              Dear Hiring Team,
              <br />
              <br />I am excited to apply for this role. My background in Power Platform, Power BI, DAX, Python, SQL,
              Dataverse, and workflow automation aligns well with your requirements. I would welcome the opportunity to
              contribute to enterprise automation and analytics initiatives while progressing through your visa-sponsored
              hiring process.
            </div>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
