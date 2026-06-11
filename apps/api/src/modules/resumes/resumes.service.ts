import { BadRequestException, Injectable } from "@nestjs/common";
import { PDFParse } from "pdf-parse";
import { PrismaService } from "../prisma/prisma.service";

const knownSkills = [
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
  "Workflow Automation",
  "Azure Data Factory",
  "Docker"
];

@Injectable()
export class ResumesService {
  constructor(private readonly prisma: PrismaService) {}

  async upload(userId: string, file: Express.Multer.File) {
    if (!file || file.mimetype !== "application/pdf") {
      throw new BadRequestException("Only PDF resumes are supported.");
    }
    if (file.size > 5 * 1024 * 1024) {
      throw new BadRequestException("Resume file exceeds the 5MB limit.");
    }

    const parser = new PDFParse({ data: new Uint8Array(file.buffer) });
    const parsed = await parser.getText().finally(() => parser.destroy());
    const profile = this.extractProfile(parsed.text);

    return this.prisma.resume.create({
      data: {
        userId,
        fileName: file.originalname,
        rawText: parsed.text,
        ...profile
      }
    });
  }

  latest(userId: string) {
    return this.prisma.resume.findFirst({
      where: { userId },
      orderBy: { createdAt: "desc" }
    });
  }

  extractProfile(text: string) {
    const lower = text.toLowerCase();
    const email = text.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i)?.[0];
    const name = text
      .split(/\r?\n/)
      .map((line) => line.trim())
      .find((line) => line.length > 2 && !line.includes("@"));
    const skills = knownSkills.filter((skill) => lower.includes(skill.toLowerCase()));
    const certifications = text
      .split(/\r?\n/)
      .filter((line) => /certified|certification|PL-\d{3}|AZ-\d{3}|DP-\d{3}/i.test(line))
      .slice(0, 10);

    return {
      name,
      email,
      skills,
      certifications,
      experience: { summary: this.section(text, "experience") },
      education: { summary: this.section(text, "education") }
    };
  }

  private section(text: string, heading: string) {
    const pattern = new RegExp(`${heading}[\\s\\S]{0,1000}`, "i");
    return text.match(pattern)?.[0]?.trim() ?? "";
  }
}
