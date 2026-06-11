import { Injectable } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { DEFAULT_SKILLS, JobSearchResult } from "@visapath/shared";
import { PrismaService } from "../prisma/prisma.service";
import { JobSearchDto } from "./dto/job-search.dto";
import { defaultJobSourceAdapters } from "./mock-job-source.adapter";
import { ExternalJob } from "./job-source.adapter";

@Injectable()
export class JobsService {
  constructor(private readonly prisma: PrismaService) {}

  async search(query: JobSearchDto): Promise<JobSearchResult[]> {
    const [databaseJobs, externalJobs] = await Promise.all([
      this.searchDatabase(query),
      Promise.all(defaultJobSourceAdapters.map((adapter) => adapter.search(query))).then((results) => results.flat())
    ]);

    const requestedSkills = query.skills?.length ? query.skills : [...DEFAULT_SKILLS];
    return [...databaseJobs, ...externalJobs.map((job) => this.mapExternalJob(job, requestedSkills))]
      .filter((job) => !query.sponsorshipRequired || job.sponsorshipAvailable)
      .filter((job) => !query.remoteTypes?.length || query.remoteTypes.includes(job.remoteType))
      .sort((a, b) => b.matchScore - a.matchScore);
  }

  async featured() {
    const jobs = await this.prisma.job.findMany({
      take: 8,
      orderBy: [{ sponsorshipAvailable: "desc" }, { datePosted: "desc" }],
      include: { company: true, country: true, skills: true }
    });

    return jobs.map((job) => this.mapDatabaseJob(job, [...DEFAULT_SKILLS]));
  }

  async findOne(id: string) {
    const job = await this.prisma.job.findUniqueOrThrow({
      where: { id },
      include: { company: true, country: true, visaProgram: true, skills: true }
    });

    return {
      ...this.mapDatabaseJob(job, [...DEFAULT_SKILLS]),
      description: job.description,
      visaProgram: job.visaProgram
    };
  }

  private async searchDatabase(query: JobSearchDto): Promise<JobSearchResult[]> {
    const where: Prisma.JobWhereInput = {
      ...(query.title
        ? {
            roleTitle: {
              contains: query.title,
              mode: "insensitive"
            }
          }
        : {}),
      ...(query.countries?.length ? { country: { name: { in: query.countries } } } : {}),
      ...(query.sponsorshipRequired ? { sponsorshipAvailable: true } : {}),
      ...(query.remoteTypes?.length ? { remoteType: { in: query.remoteTypes } } : {}),
      ...(query.jobType ? { jobType: query.jobType } : {}),
      ...(query.experienceLevel ? { experienceLevel: query.experienceLevel } : {}),
      ...(query.salaryMin ? { salaryMax: { gte: query.salaryMin } } : {}),
      ...(query.salaryMax ? { salaryMin: { lte: query.salaryMax } } : {})
    };

    const jobs = await this.prisma.job.findMany({
      where,
      take: 50,
      orderBy: { datePosted: "desc" },
      include: { company: true, country: true, skills: true }
    });

    const requestedSkills = query.skills?.length ? query.skills : [...DEFAULT_SKILLS];
    return jobs.map((job) => this.mapDatabaseJob(job, requestedSkills));
  }

  private mapDatabaseJob(
    job: Prisma.JobGetPayload<{ include: { company: true; country: true; skills: true } }>,
    requestedSkills: string[]
  ): JobSearchResult {
    const skills = job.skills.map((skill) => skill.name);
    return {
      id: job.id,
      companyName: job.company.name,
      roleTitle: job.roleTitle,
      country: job.country.name,
      city: job.city,
      salary:
        job.salaryMin && job.salaryMax && job.currency
          ? `${job.currency} ${job.salaryMin.toLocaleString()} - ${job.salaryMax.toLocaleString()}`
          : "Competitive",
      sponsorshipAvailable: job.sponsorshipAvailable,
      visaType: job.visaType ?? undefined,
      remoteType: job.remoteType,
      matchScore: this.calculateMatchScore(requestedSkills, skills, job.roleTitle),
      applyLink: job.applyLink,
      datePosted: job.datePosted.toISOString(),
      source: job.source,
      skills
    };
  }

  private mapExternalJob(job: ExternalJob, requestedSkills: string[]): JobSearchResult {
    return {
      id: `${job.source}:${job.externalId}`,
      companyName: job.companyName,
      roleTitle: job.roleTitle,
      country: job.country,
      city: job.city,
      salary: job.salary,
      sponsorshipAvailable: job.sponsorshipAvailable,
      visaType: job.visaType,
      remoteType: job.remoteType,
      matchScore: this.calculateMatchScore(requestedSkills, job.skills, job.roleTitle),
      applyLink: job.applyLink,
      datePosted: job.datePosted,
      source: job.source,
      skills: job.skills
    };
  }

  private calculateMatchScore(requestedSkills: string[], jobSkills: string[], roleTitle: string) {
    const desired = requestedSkills.map((skill) => skill.toLowerCase());
    const offered = new Set(jobSkills.map((skill) => skill.toLowerCase()));
    const skillScore = desired.length
      ? Math.round((desired.filter((skill) => offered.has(skill)).length / desired.length) * 75)
      : 55;
    const roleBonus = /power|data|business intelligence|python|etl/i.test(roleTitle) ? 20 : 10;
    return Math.min(100, skillScore + roleBonus + 5);
  }
}
