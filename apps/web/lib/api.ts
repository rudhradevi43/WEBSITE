export const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

export type Job = {
  id: string;
  title: string;
  city?: string;
  salaryMin?: number;
  salaryMax?: number;
  currency?: string;
  sponsorshipAvailable: boolean;
  visaType?: string;
  workMode: "REMOTE" | "HYBRID" | "ONSITE";
  matchScore: number;
  applyUrl: string;
  postedAt: string;
  company?: { name: string };
  country: { name: string; code: string };
  skills: { name: string }[];
};

export type Application = {
  id: string;
  companyName: string;
  jobTitle: string;
  location: string;
  visaType?: string;
  status: ApplicationStatus;
  appliedDate?: string;
  lastContactDate?: string;
  recruiterName?: string;
  recruiterEmail?: string;
  notes?: string;
  salary?: string;
  attachments: string[];
  followUpRequired: boolean;
};

export type ApplicationStatus =
  | "SAVED"
  | "APPLIED"
  | "INTERVIEW"
  | "TECHNICAL_ROUND"
  | "FINAL_ROUND"
  | "OFFER"
  | "REJECTED"
  | "VISA_PROCESSING";

export async function apiFetch<T>(path: string, options: RequestInit & { token?: string } = {}): Promise<T> {
  const headers = new Headers(options.headers);
  headers.set("Content-Type", headers.get("Content-Type") ?? "application/json");
  if (options.token) {
    headers.set("Authorization", `Bearer ${options.token}`);
  }

  const response = await fetch(`${apiBaseUrl}/api${path}`, {
    ...options,
    headers,
    cache: "no-store"
  });

  if (!response.ok) {
    throw new Error(await response.text());
  }

  return response.json() as Promise<T>;
}
