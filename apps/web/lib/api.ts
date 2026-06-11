import type { JobSearchRequest } from "@visapath/shared";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

export interface ApiSession {
  accessToken: string;
  user: {
    id: string;
    email: string;
    name?: string;
    role: string;
  };
}

export async function apiFetch<T>(path: string, options: RequestInit & { token?: string } = {}): Promise<T> {
  const headers = new Headers(options.headers);
  headers.set("Content-Type", headers.get("Content-Type") ?? "application/json");
  if (options.token) {
    headers.set("Authorization", `Bearer ${options.token}`);
  }

  const response = await fetch(`${API_URL}/api${path}`, {
    ...options,
    headers,
    cache: "no-store"
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(error || `API request failed with ${response.status}`);
  }

  return response.json() as Promise<T>;
}

export const api = {
  login: (email: string, password: string) =>
    apiFetch<ApiSession>("/auth/login", { method: "POST", body: JSON.stringify({ email, password }) }),
  searchJobs: (token: string, query: JobSearchRequest) =>
    apiFetch("/jobs/search", { token, method: "POST", body: JSON.stringify(query) }),
  featuredJobs: (token: string) => apiFetch("/jobs/featured", { token }),
  applications: (token: string) => apiFetch("/applications", { token }),
  kanban: (token: string) => apiFetch("/applications/kanban", { token }),
  analytics: (token: string) => apiFetch("/analytics/dashboard", { token }),
  companies: (token: string) => apiFetch("/companies", { token }),
  latestResume: (token: string) => apiFetch("/resumes/latest", { token }),
  resumeMatch: (token: string) => apiFetch("/resumes/match", { token, method: "POST", body: JSON.stringify({}) })
};
