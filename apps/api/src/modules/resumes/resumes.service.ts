import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { DEFAULT_SKILLS } from "@visapath/shared";
import { AiService } from "../ai/ai.service";
import { AuditService } from "../audit/audit.service";
import { PrismaService } from "../prisma/prisma.service";
import { ResumeMatchDto } from "./dto/resume-match.dto";
import { ResumeParserService } from "./resume-parser.service";

@Injectable()
export class ResumesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly parser: ResumeParserService,
    private readonly aiService: AiService,
    private readonly auditService: AuditService
  ) {}

  async upload(userId: string, file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException("A PDF resume is required.");
    }

    const parsed = await this.parser.parsePdf(file.buffer);
    const resume = await this.prisma.resume.create({
      data: {
        userId,
        fileName: file.originalname,
        rawText: parsed.rawText,
        parsedName: parsed.name,
        parsedEmail: parsed.email,
        certifications: parsed.certifications,
        education: parsed.education,
        experience: parsed.experience,
        skills: {
          connectOrCreate: parsed.skills.map((skill) => ({
            where: { name: skill },
            create: { name: skill }
          }))
        }
      },
      include: { skills: true }
    });

    await this.auditService.record({ userId, action: "resume.uploaded", entity: "Resume", entityId: resume.id });
    return resume;
  }

  async latest(userId: string) {
    return this.prisma.resume.findFirst({
      where: { userId },
      orderBy: { createdAt: "desc" },
      include: { skills: true }
    });
  }

  async matchLatest(userId: string, dto: ResumeMatchDto) {
    const resume = await this.latest(userId);
    if (!resume) {
      throw new NotFoundException("Upload a resume before running match analysis.");
    }

    let jobSkills = dto.jobSkills?.length ? dto.jobSkills : [...DEFAULT_SKILLS, "Azure Data Factory", "Docker"];
    if (dto.jobId) {
      const job = await this.prisma.job.findUnique({
        where: { id: dto.jobId },
        include: { skills: true }
      });
      if (job) {
        jobSkills = job.skills.map((skill) => skill.name);
      }
    }

    return this.aiService.scoreResumeAgainstJob(
      resume.skills.map((skill) => skill.name),
      jobSkills
    );
  }
}
