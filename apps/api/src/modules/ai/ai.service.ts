import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import OpenAI from "openai";
import { DEFAULT_SKILLS, ResumeMatchSummary } from "@visapath/shared";
import { CoverLetterDto } from "./dto/ai.dto";

@Injectable()
export class AiService {
  private readonly client?: OpenAI;

  constructor(configService: ConfigService) {
    const apiKey = configService.get<string>("OPENAI_API_KEY");
    this.client = apiKey ? new OpenAI({ apiKey }) : undefined;
  }

  async scoreResumeAgainstJob(resumeSkills: string[], jobSkills: string[]): Promise<ResumeMatchSummary> {
    const normalizedResume = new Set(resumeSkills.map((skill) => skill.toLowerCase()));
    const matchedSkills = jobSkills.filter((skill) => normalizedResume.has(skill.toLowerCase()));
    const missingSkills = jobSkills.filter((skill) => !normalizedResume.has(skill.toLowerCase())).slice(0, 8);
    const matchScore = jobSkills.length ? Math.round((matchedSkills.length / jobSkills.length) * 100) : 65;

    return {
      matchScore,
      matchedSkills,
      missingSkills,
      recommendations: missingSkills.slice(0, 3).map((skill, index) => {
        const additionalJobs = 18 + index * 9 + Math.max(0, 100 - matchScore);
        return `Learning ${skill} would increase compatibility with ${additionalJobs} additional jobs.`;
      })
    };
  }

  async generateCoverLetter(dto: CoverLetterDto) {
    if (this.client) {
      const response = await this.client.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content:
              "You write concise, professional, ATS-friendly cover letters for technology candidates seeking visa-sponsored roles."
          },
          {
            role: "user",
            content: `Resume:\n${dto.resumeText}\n\nJob description:\n${dto.jobDescription}\n\nReturn JSON with personalized, atsOptimized, concise, and detailed versions.`
          }
        ],
        response_format: { type: "json_object" }
      });

      const content = response.choices[0]?.message.content;
      if (content) {
        return JSON.parse(content) as Record<string, string>;
      }
    }

    const role = dto.roleTitle ?? "the role";
    const company = dto.companyName ?? "your team";
    const base =
      `Dear Hiring Team,\n\nI am excited to apply for ${role} at ${company}. ` +
      "My experience across Power Platform, Power BI, SQL, Python automation, and Microsoft 365 enables me to build reliable business applications, analytics, and workflow solutions that improve operational performance.";

    return {
      personalized: `${base}\n\nI would welcome the opportunity to discuss how my background can support your roadmap while contributing as a visa-sponsored technology professional.\n\nSincerely,\nVisaPath Candidate`,
      atsOptimized: `${base}\n\nRelevant keywords: Power Apps, Power Automate, Power BI, DAX, Dataverse, SQL, Python, ETL, SharePoint Online, Microsoft 365, workflow automation.`,
      concise: `${base}\n\nThank you for considering my application.`,
      detailed: `${base}\n\nIn previous roles I translated stakeholder requirements into dashboards, automated approvals, integrated Dataverse and SharePoint data, and built maintainable reporting models. I am particularly interested in roles where data, automation, and low-code platforms create measurable business outcomes.`
    };
  }

  async recommendSkills(userSkills: string[]) {
    const normalized = new Set(userSkills.map((skill) => skill.toLowerCase()));
    return DEFAULT_SKILLS.filter((skill) => !normalized.has(skill.toLowerCase())).slice(0, 5);
  }
}
