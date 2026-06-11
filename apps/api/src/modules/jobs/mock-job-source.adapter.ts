import { DEFAULT_SKILLS, SUPPORTED_COUNTRIES, VISA_JOB_SOURCES } from "@visapath/shared";
import { JobSourceAdapter, ExternalJob } from "./job-source.adapter";
import { JobSearchDto } from "./dto/job-search.dto";

export class MockJobSourceAdapter implements JobSourceAdapter {
  constructor(public readonly name: string) {}

  async search(query: JobSearchDto): Promise<ExternalJob[]> {
    const targetCountries = query.countries?.length ? query.countries : SUPPORTED_COUNTRIES.slice(0, 4);
    const title = query.title || "Power Platform Developer";
    const skills = query.skills?.length ? query.skills : [...DEFAULT_SKILLS].slice(0, 8);

    return targetCountries.slice(0, 2).map((country, index) => ({
      externalId: `${this.name}-${country}-${title}`.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      source: this.name,
      companyName: ["Microsoft", "Accenture", "Deloitte", "Capgemini"][index % 4],
      roleTitle: index % 2 === 0 ? title : "Power BI Developer",
      country,
      city: country === "United Kingdom" ? "London" : country === "Canada" ? "Toronto" : "Amsterdam",
      salary: query.salaryMin ? `${query.salaryMin.toLocaleString()}+` : "Competitive",
      sponsorshipAvailable: query.sponsorshipRequired ?? true,
      visaType: country === "United Kingdom" ? "Skilled Worker Visa" : "Work permit sponsorship",
      remoteType: index % 2 === 0 ? "HYBRID" : "REMOTE",
      applyLink: `https://example.com/jobs/${this.name.toLowerCase().replace(/[^a-z0-9]/g, "-")}/${index + 1}`,
      datePosted: new Date(Date.now() - index * 86_400_000).toISOString(),
      skills: skills.slice(0, 10)
    }));
  }
}

export const defaultJobSourceAdapters = VISA_JOB_SOURCES.map((source) => new MockJobSourceAdapter(source));
