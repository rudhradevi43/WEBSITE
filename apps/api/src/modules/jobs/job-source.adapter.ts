import { JobSearchDto } from "./dto/job-search.dto";

export interface ExternalJob {
  externalId: string;
  source: string;
  companyName: string;
  roleTitle: string;
  country: string;
  city: string;
  salary?: string;
  sponsorshipAvailable: boolean;
  visaType?: string;
  remoteType: "REMOTE" | "HYBRID" | "ONSITE";
  applyLink: string;
  datePosted: string;
  skills: string[];
}

export interface JobSourceAdapter {
  name: string;
  search(query: JobSearchDto): Promise<ExternalJob[]>;
}
