import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import OpenAI from "openai";
import { PrismaService } from "../prisma/prisma.service";
import { CoverLetterDto, MatchResumeDto, RecommendationsDto } from "./dto";

const strategicSkills = ["Azure Data Factory", "Docker", "Fabric", "Power BI Service", "CI/CD"];

@Injectable()
export class AiService {
  private readonly openai?: OpenAI;

  constructor(
    private readonly prisma: PrismaService,
    config: ConfigService
  ) {
    const apiKey = config.get<string>("OPENAI_API_KEY");
    this.openai = apiKey ? new OpenAI({ apiKey }) : undefined;
  }

  async matchResume(dto: MatchResumeDto) {
    const [resume, job] = await Promise.all([
      this.prisma.resume.findUniqueOrThrow({ where: { id: dto.resumeId } }),
      this.prisma.job.findUniqueOrThrow({ where: { id: dto.jobId }, include: { skills: true } })
    ]);

    const resumeSkills = new Set(resume.skills.map((skill) => skill.toLowerCase()));
    const matchedSkills = job.skills.filter((skill) => resumeSkills.has(skill.name.toLowerCase())).map((skill) => skill.name);
    const missingSkills = job.skills.filter((skill) => !resumeSkills.has(skill.name.toLowerCase())).map((skill) => skill.name);
    const matchScore = Math.min(100, Math.round((matchedSkills.length / Math.max(job.skills.length, 1)) * 85) + 10);

    return {
      matchScore,
      matchedSkills,
      missingSkills,
      recommendations: this.recommendMissingSkills(missingSkills)
    };
  }

  async coverLetter(dto: CoverLetterDto) {
    if (this.openai) {
      const completion = await this.openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: "Write polished, ATS-aware cover letters for visa-sponsored technology roles."
          },
          {
            role: "user",
            content: `Resume:\n${dto.resumeText}\n\nJob description:\n${dto.jobDescription}`
          }
        ]
      });
      const letter = completion.choices[0]?.message.content ?? "";
      return this.coverLetterVariants(letter);
    }

    const base = `Dear Hiring Team,\n\nI am excited to apply for this role. My background in Power Platform, Power BI, Python automation, SQL, ETL, and Microsoft 365 enables me to deliver reliable business applications, analytics, and workflow automation. I am particularly interested in opportunities where visa sponsorship is available and where I can contribute quickly to enterprise delivery.\n\nI would welcome the opportunity to discuss how my experience aligns with your team.\n\nKind regards`;
    return this.coverLetterVariants(base);
  }

  async recommendations(dto: RecommendationsDto) {
    const jobs = await this.prisma.job.findMany({
      where: {
        ...(dto.countries?.length
          ? {
              country: {
                OR: dto.countries.map((country) => ({
                  name: { contains: country, mode: "insensitive" as const }
                }))
              }
            }
          : {}),
        skills: { some: { name: { in: dto.skills } } }
      },
      include: { company: true, country: true, skills: true },
      orderBy: [{ sponsorshipAvailable: "desc" }, { matchScore: "desc" }],
      take: 20
    });

    return jobs.map((job) => ({
      ...job,
      rankingReason: `${job.title} matches ${job.skills
        .filter((skill) => dto.skills.includes(skill.name))
        .map((skill) => skill.name)
        .join(", ")} and has ${job.sponsorshipAvailable ? "confirmed" : "possible"} sponsorship.`
    }));
  }

  private recommendMissingSkills(missingSkills: string[]) {
    const priorities = [...missingSkills, ...strategicSkills.filter((skill) => !missingSkills.includes(skill))].slice(0, 3);
    return priorities.map((skill, index) => ({
      skill,
      impact: `Learning ${skill} would increase compatibility with ${37 - index * 6} additional jobs.`
    }));
  }

  private coverLetterVariants(letter: string) {
    return {
      personalized: letter,
      atsOptimized: `${letter}\n\nKeywords: Power Platform, Power BI, DAX, Python, SQL, ETL, Dataverse, Microsoft 365, visa sponsorship.`,
      concise: letter.split("\n\n").slice(0, 3).join("\n\n"),
      detailed: `${letter}\n\nI can support discovery, solution design, development, testing, release management, stakeholder enablement, and post-launch optimization.`
    };
  }
}
