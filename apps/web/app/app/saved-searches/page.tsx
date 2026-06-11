"use client";

import { FormEvent, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { Bell, Play } from "lucide-react";
import { DEFAULT_SKILLS } from "@visapath/shared";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { apiFetch } from "@/lib/api";

interface SavedSearch {
  id: string;
  name: string;
  frequency: "DAILY" | "WEEKLY";
  query: Record<string, unknown>;
  lastRunAt?: string;
}

export default function SavedSearchesPage() {
  const { data } = useSession();
  const token = data?.accessToken ?? "";
  const queryClient = useQueryClient();
  const [name, setName] = useState("Power Platform Developer UK Sponsorship");
  const [frequency, setFrequency] = useState<"DAILY" | "WEEKLY">("DAILY");

  const { data: savedSearches = [] } = useQuery({
    queryKey: ["saved-searches"],
    enabled: Boolean(token),
    queryFn: () => apiFetch<SavedSearch[]>("/saved-searches", { token })
  });

  const create = useMutation({
    mutationFn: () =>
      apiFetch("/saved-searches", {
        token,
        method: "POST",
        body: JSON.stringify({
          name,
          frequency,
          query: {
            title: "Power Platform Developer",
            skills: DEFAULT_SKILLS,
            countries: ["United Kingdom"],
            sponsorshipRequired: true
          }
        })
      }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["saved-searches"] })
  });

  const run = useMutation({
    mutationFn: (id: string) => apiFetch(`/saved-searches/${id}/run`, { token, method: "POST" })
  });

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    create.mutate();
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-semibold uppercase tracking-widest text-emerald-600">Saved searches</p>
        <h1 className="mt-2 text-4xl font-semibold tracking-tight">Automated matching-job alerts</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Create scheduled search</CardTitle>
          <CardDescription>Daily or weekly notifications when matching sponsor jobs appear.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="grid gap-4 md:grid-cols-[1fr_180px_160px]">
            <div className="space-y-2">
              <Label>Name</Label>
              <Input value={name} onChange={(event) => setName(event.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Frequency</Label>
              <Select value={frequency} onChange={(event) => setFrequency(event.target.value as "DAILY" | "WEEKLY")}>
                <option value="DAILY">Daily</option>
                <option value="WEEKLY">Weekly</option>
              </Select>
            </div>
            <Button className="self-end" disabled={create.isPending}>
              <Bell className="h-4 w-4" />
              Save
            </Button>
          </form>
        </CardContent>
      </Card>

      <div className="grid gap-4 lg:grid-cols-2">
        {savedSearches.map((savedSearch) => (
          <Card key={savedSearch.id}>
            <CardHeader>
              <CardTitle>{savedSearch.name}</CardTitle>
              <CardDescription>
                {savedSearch.frequency.toLowerCase()} · Last run{" "}
                {savedSearch.lastRunAt ? new Date(savedSearch.lastRunAt).toLocaleString() : "never"}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-2">
                {Object.entries(savedSearch.query).map(([key, value]) => (
                  <Badge key={key}>
                    {key}: {Array.isArray(value) ? value.slice(0, 3).join(", ") : String(value)}
                  </Badge>
                ))}
              </div>
              <Button variant="outline" onClick={() => run.mutate(savedSearch.id)}>
                <Play className="h-4 w-4" />
                Run now
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
