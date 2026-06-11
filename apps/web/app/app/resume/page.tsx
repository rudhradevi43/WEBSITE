"use client";

import { FormEvent, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { CheckCircle2, Upload, AlertTriangle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { apiFetch } from "@/lib/api";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

interface Resume {
  id: string;
  fileName: string;
  parsedName?: string;
  parsedEmail?: string;
  certifications: string[];
  skills: Array<{ name: string }>;
}

interface MatchSummary {
  matchScore: number;
  matchedSkills: string[];
  missingSkills: string[];
  recommendations: string[];
}

export default function ResumePage() {
  const { data } = useSession();
  const token = data?.accessToken ?? "";
  const queryClient = useQueryClient();
  const [file, setFile] = useState<File>();
  const [resumeText, setResumeText] = useState("");
  const [jobDescription, setJobDescription] = useState(
    "Power Platform Developer role requiring Power Apps, Power Automate, Power BI, DAX, SQL, Python, Dataverse, Azure Data Factory, and Docker."
  );

  const latest = useQuery({
    queryKey: ["latest-resume"],
    enabled: Boolean(token),
    queryFn: () => apiFetch<Resume | null>("/resumes/latest", { token })
  });

  const upload = useMutation({
    mutationFn: async () => {
      if (!file) throw new Error("Choose a PDF resume first.");
      const formData = new FormData();
      formData.append("file", file);
      const response = await fetch(`${API_URL}/api/resumes/upload`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData
      });
      if (!response.ok) throw new Error(await response.text());
      return response.json();
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["latest-resume"] })
  });

  const match = useMutation({
    mutationFn: () => apiFetch<MatchSummary>("/resumes/match", { token, method: "POST", body: JSON.stringify({}) })
  });

  const coverLetter = useMutation({
    mutationFn: () =>
      apiFetch<Record<string, string>>("/ai/cover-letter", {
        token,
        method: "POST",
        body: JSON.stringify({ resumeText, jobDescription, roleTitle: "Power Platform Developer" })
      })
  });

  function submitCoverLetter(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    coverLetter.mutate();
  }

  const resume = latest.data;

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-semibold uppercase tracking-widest text-emerald-600">AI resume matching</p>
        <h1 className="mt-2 text-4xl font-semibold tracking-tight">Parse, score, and tailor your profile</h1>
      </div>

      <div className="grid gap-6 lg:grid-cols-[420px_1fr]">
        <Card>
          <CardHeader>
            <CardTitle>Upload PDF resume</CardTitle>
            <CardDescription>Extract name, email, skills, certifications, education, and experience.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <input
              type="file"
              accept="application/pdf"
              onChange={(event) => setFile(event.target.files?.[0])}
              className="w-full rounded-xl border p-3 text-sm"
            />
            <Button className="w-full" disabled={upload.isPending || !file} onClick={() => upload.mutate()}>
              <Upload className="h-4 w-4" />
              {upload.isPending ? "Parsing..." : "Upload and parse"}
            </Button>
            {resume ? (
              <div className="rounded-2xl bg-muted p-4">
                <p className="font-semibold">{resume.parsedName ?? resume.fileName}</p>
                <p className="text-sm text-muted-foreground">{resume.parsedEmail}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {resume.skills.map((skill) => (
                    <Badge key={skill.name}>{skill.name}</Badge>
                  ))}
                </div>
              </div>
            ) : null}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Match score</CardTitle>
            <CardDescription>Compares your latest resume with a target sponsor-friendly job profile.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button onClick={() => match.mutate()} disabled={match.isPending}>
              Generate match score
            </Button>
            {match.data ? (
              <div className="grid gap-4 md:grid-cols-[180px_1fr]">
                <div className="grid place-items-center rounded-3xl bg-navy-950 p-6 text-center text-white">
                  <p className="text-sm text-slate-300">Match Score</p>
                  <p className="text-5xl font-bold text-emerald-400">{match.data.matchScore}%</p>
                </div>
                <div className="space-y-4">
                  <div>
                    <p className="mb-2 font-semibold">Matched Skills</p>
                    <div className="flex flex-wrap gap-2">
                      {match.data.matchedSkills.map((skill) => (
                        <Badge key={skill} className="border-emerald-200 bg-emerald-50 text-emerald-700">
                          <CheckCircle2 className="mr-1 h-3 w-3" />
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="mb-2 font-semibold">Missing Skills</p>
                    <div className="flex flex-wrap gap-2">
                      {match.data.missingSkills.map((skill) => (
                        <Badge key={skill} className="border-amber-200 bg-amber-50 text-amber-700">
                          <AlertTriangle className="mr-1 h-3 w-3" />
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  {match.data.recommendations.map((recommendation) => (
                    <p key={recommendation} className="rounded-xl bg-muted p-3 text-sm">
                      {recommendation}
                    </p>
                  ))}
                </div>
              </div>
            ) : null}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>AI cover letter generator</CardTitle>
          <CardDescription>Generate personalized, ATS-optimized, concise, and detailed variants.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={submitCoverLetter} className="grid gap-4 lg:grid-cols-2">
            <Textarea placeholder="Paste resume text" value={resumeText} onChange={(event) => setResumeText(event.target.value)} />
            <Textarea value={jobDescription} onChange={(event) => setJobDescription(event.target.value)} />
            <Button className="lg:col-span-2" disabled={coverLetter.isPending}>
              Generate cover letters
            </Button>
          </form>
          {coverLetter.data ? (
            <div className="mt-6 grid gap-4 lg:grid-cols-2">
              {Object.entries(coverLetter.data).map(([variant, text]) => (
                <div key={variant} className="rounded-2xl border bg-background p-4">
                  <p className="mb-2 font-semibold capitalize">{variant}</p>
                  <p className="whitespace-pre-line text-sm text-muted-foreground">{text}</p>
                </div>
              ))}
            </div>
          ) : null}
        </CardContent>
      </Card>
    </div>
  );
}
