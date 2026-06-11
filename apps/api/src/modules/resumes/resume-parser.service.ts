import { Injectable } from "@nestjs/common";
import pdfParse from "pdf-parse";
import { DEFAULT_SKILLS } from "@visapath/shared";

export interface ParsedResume {
  rawText: string;
  name?: string;
  email?: string;
  skills: string[];
  certifications: string[];
  education: Array<{ line: string }>;
  experience: Array<{ line: string }>;
}

@Injectable()
export class ResumeParserService {
  async parsePdf(buffer: Buffer): Promise<ParsedResume> {
    const parsed = await pdfParse(buffer);
    const rawText = parsed.text.replace(/\s+\n/g, "\n").trim();
    return this.parseText(rawText);
  }

  parseText(rawText: string): ParsedResume {
    const lines = rawText
      .split(/\n+/)
      .map((line) => line.trim())
      .filter(Boolean);

    const email = rawText.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i)?.[0];
    const name = lines.find((line) => !line.includes("@") && line.length <= 80);
    const lowerText = rawText.toLowerCase();
    const skills = DEFAULT_SKILLS.filter((skill) => lowerText.includes(skill.toLowerCase()));
    const certifications = lines.filter((line) => /certified|certification|pl-\d{3}|az-\d{3}|mb-\d{3}/i.test(line));
    const education = lines.filter((line) => /university|degree|bachelor|master|msc|bsc|diploma/i.test(line)).map((line) => ({ line }));
    const experience = lines
      .filter((line) => /developer|analyst|engineer|consultant|manager|specialist/i.test(line))
      .slice(0, 12)
      .map((line) => ({ line }));

    return {
      rawText,
      name,
      email,
      skills,
      certifications,
      education,
      experience
    };
  }
}
