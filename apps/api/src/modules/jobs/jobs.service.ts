import { Injectable } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { PrismaService } from "../prisma/prisma.service";
import { CreateJobDto, SearchJobsDto } from "./dto";

const preferredSkills = new Set([
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
]);

@Injectable()
export class JobsService {
  constructor(private readonly prisma: PrismaService) {}

  async search(dto: SearchJobsDto) {
    const where: Prisma.JobWhereInput = {
      ...(dto.title
        ? {
            title: { contains: dto.title, mode: "insensitive" }
          }
        : {}),
      ...(dto.sponsorshipRequired ? { sponsorshipAvailable: true } : {}),
      ...(dto.workMode ? { workMode: dto.workMode } : {}),
      ...(dto.jobType ? { jobType: dto.jobType } : {}),
      ...(dto.experienceLevel ? { experienceLevel: dto.experienceLevel } : {}),
      ...(dto.salaryMin ? { salaryMax: { gte: dto.salaryMin } } : {}),
      ...(dto.salaryMax ? { salaryMin: { lte: dto.salaryMax } } : {}),
      ...(dto.countries?.length
        ? {
            country: {
              OR: [
                { name: { in: dto.countries, mode: "insensitive" } },
                { code: { in: dto.countries.map((country) => country.toUpperCase()) } }
              ]
            }
          }
        : {}),
      ...(dto.skills?.length
        ? {
            skills: {
              some: {
                name: { in: dto.skills, mode: "insensitive" }
              }
            }
          }
        : {})
    };

    const jobs = await this.prisma.job.findMany({
      where,
      take: dto.take,
      orderBy: [{ sponsorshipAvailable: "desc" }, { matchScore: "desc" }, { postedAt: "desc" }],
      include: { company: true, country: true, skills: true, visaProgram: true }
    });

    return jobs.map((job) => ({
      ...job,
      matchScore: this.calculateMatchScore(
        job.skills.map((skill) => skill.name),
        dto.skills ?? [...preferredSkills],
        job.sponsorshipAvailable
      )
    }));
  }

  async create(dto: CreateJobDto) {
    const country = await this.prisma.country.findUniqueOrThrow({ where: { code: dto.countryCode.toUpperCase() } });
    const company = dto.companyName
      ? await this.prisma.company.upsert({
          where: { name_countryId: { name: dto.companyName, countryId: country.id } },
          update: {},
          create: { name: dto.companyName, countryId: country.id, sponsorshipConfidenceScore: 60 }
        })
      : null;

    return this.prisma.job.create({
      data: {
        source: dto.source,
        externalId: dto.externalId,
        title: dto.title,
        countryId: country.id,
        companyId: company?.id,
        city: dto.city,
        description: dto.description,
        applyUrl: dto.applyUrl,
        sponsorshipAvailable: dto.sponsorshipAvailable,
        visaType: dto.visaType,
        workMode: dto.workMode,
        postedAt: new Date(),
        skills: {
          connectOrCreate:
            dto.skills?.map((skill) => ({
              where: { name: skill },
              create: { name: skill }
            })) ?? []
        }
      },
      include: { company: true, country: true, skills: true }
    });
  }

  async sources() {
    return [
      "LinkedIn",
      "Indeed",
      "EURES",
      "UK Sponsor Companies",
      "Job Bank Canada",
      "SEEK Australia",
      "Company career pages"
    ];
  }

  private calculateMatchScore(jobSkills: string[], userSkills: string[], sponsorshipAvailable: boolean) {
    const normalizedUserSkills = new Set(userSkills.map((skill) => skill.toLowerCase()));
    const matched = jobSkills.filter((skill) => normalizedUserSkills.has(skill.toLowerCase())).length;
    const skillScore = jobSkills.length ? Math.round((matched / jobSkills.length) * 80) : 45;
    return Math.min(100, skillScore + (sponsorshipAvailable ? 15 : 0) + 5);
  }
}
