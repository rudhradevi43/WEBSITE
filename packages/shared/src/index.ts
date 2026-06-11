export const SUPPORTED_COUNTRIES = [
  "United Kingdom",
  "Germany",
  "Netherlands",
  "Ireland",
  "Sweden",
  "Denmark",
  "Norway",
  "Finland",
  "Switzerland",
  "Austria",
  "Belgium",
  "France",
  "Canada",
  "Australia"
] as const;

export type SupportedCountry = (typeof SUPPORTED_COUNTRIES)[number];

export const DEFAULT_JOB_TITLES = [
  "Power Platform Developer",
  "Power BI Developer",
  "Data Analyst",
  "Business Intelligence Analyst",
  "Python Automation Engineer",
  "ETL Developer",
  "Microsoft 365 Consultant"
] as const;

export const DEFAULT_SKILLS = [
  "Power Apps",
  "Power Automate",
  "Power BI",
  "DAX",
  "Power Fx",
  "Dataverse",
  "SharePoint Online",
  "Python",
  "Pandas",
  "SQL",
  "ETL",
  "Microsoft 365",
  "Teams Integration",
  "Workflow Automation"
] as const;

export const APPLICATION_STATUSES = [
  "SAVED",
  "APPLIED",
  "INTERVIEW",
  "TECHNICAL_ROUND",
  "FINAL_ROUND",
  "OFFER",
  "REJECTED",
  "VISA_PROCESSING"
] as const;

export type ApplicationStatus = (typeof APPLICATION_STATUSES)[number];

export const VISA_JOB_SOURCES = [
  "LinkedIn",
  "Indeed",
  "EURES",
  "UK Sponsor Companies",
  "Job Bank Canada",
  "SEEK Australia",
  "Company Career Pages"
] as const;

export const REMOTE_TYPES = ["REMOTE", "HYBRID", "ONSITE"] as const;
export type RemoteType = (typeof REMOTE_TYPES)[number];

export const EXPERIENCE_LEVELS = ["ENTRY", "MID", "SENIOR", "LEAD"] as const;
export type ExperienceLevel = (typeof EXPERIENCE_LEVELS)[number];

export interface JobSearchRequest {
  title?: string;
  skills?: string[];
  countries?: string[];
  salaryMin?: number;
  salaryMax?: number;
  sponsorshipRequired?: boolean;
  remoteTypes?: RemoteType[];
  jobType?: string;
  experienceLevel?: ExperienceLevel;
}

export interface JobSearchResult {
  id: string;
  companyName: string;
  roleTitle: string;
  country: string;
  city: string;
  salary?: string;
  sponsorshipAvailable: boolean;
  visaType?: string;
  remoteType: RemoteType;
  matchScore: number;
  applyLink: string;
  datePosted: string;
  source: string;
  skills: string[];
}

export interface ResumeMatchSummary {
  matchScore: number;
  matchedSkills: string[];
  missingSkills: string[];
  recommendations: string[];
}
