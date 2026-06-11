"use client";

import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { Bar, BarChart, CartesianGrid, Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { apiFetch } from "@/lib/api";

interface Analytics {
  applicationsByCountry: Array<{ name: string; count: number }>;
  applicationsByStatus: Array<{ status: string; count: number }>;
  monthlyActivity: Array<{ label: string; count: number }>;
  interviewRate: number;
  responseRate: number;
  offerRate: number;
  visaSponsorshipSuccessRate: number;
}

export default function AnalyticsPage() {
  const { data } = useSession();
  const token = data?.accessToken ?? "";
  const { data: analytics } = useQuery({
    queryKey: ["analytics"],
    enabled: Boolean(token),
    queryFn: () => apiFetch<Analytics>("/analytics/dashboard", { token })
  });

  const rates = [
    { label: "Interview Rate", value: analytics?.interviewRate ?? 0 },
    { label: "Response Rate", value: analytics?.responseRate ?? 0 },
    { label: "Offer Rate", value: analytics?.offerRate ?? 0 },
    { label: "Visa Success", value: analytics?.visaSponsorshipSuccessRate ?? 0 }
  ];

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-semibold uppercase tracking-widest text-emerald-600">Executive analytics</p>
        <h1 className="mt-2 text-4xl font-semibold tracking-tight">Application performance dashboard</h1>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        {rates.map((rate) => (
          <Card key={rate.label}>
            <CardContent className="p-5">
              <p className="text-sm text-muted-foreground">{rate.label}</p>
              <p className="mt-2 text-4xl font-semibold">{rate.value}%</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <ChartCard title="Applications by Country">
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={analytics?.applicationsByCountry ?? []}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#059669" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Applications by Status">
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie data={analytics?.applicationsByStatus ?? []} dataKey="count" nameKey="status" fill="#0b1f36" label />
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Monthly Activity">
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={analytics?.monthlyActivity ?? []}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="label" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="count" stroke="#059669" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
    </div>
  );
}

function ChartCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}
