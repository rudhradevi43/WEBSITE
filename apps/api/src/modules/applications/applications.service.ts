import { ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { ApplicationStatus } from "@prisma/client";
import { PrismaService } from "../prisma/prisma.service";
import { AddNoteDto, CreateApplicationDto, UpdateApplicationDto } from "./dto";

const sevenDaysMs = 7 * 24 * 60 * 60 * 1000;

@Injectable()
export class ApplicationsService {
  constructor(private readonly prisma: PrismaService) {}

  async list(userId: string) {
    const applications = await this.prisma.application.findMany({
      where: { userId },
      orderBy: { updatedAt: "desc" },
      include: { applicationNotes: { orderBy: { createdAt: "desc" } }, job: true }
    });

    return applications.map((application) => ({
      ...application,
      followUpRequired: this.isFollowUpRequired(application.appliedDate, application.lastContactDate)
    }));
  }

  async create(userId: string, dto: CreateApplicationDto) {
    const job = dto.jobId
      ? await this.prisma.job.findUnique({ where: { id: dto.jobId }, include: { company: true, country: true } })
      : null;

    return this.prisma.application.create({
      data: {
        userId,
        jobId: dto.jobId,
        companyId: job?.companyId,
        companyName: dto.companyName || job?.company?.name || "Unknown Company",
        jobTitle: dto.jobTitle || job?.title || "Untitled Role",
        location: dto.location || [job?.city, job?.country.name].filter(Boolean).join(", "),
        visaType: dto.visaType || job?.visaType,
        status: dto.appliedDate ? ApplicationStatus.APPLIED : ApplicationStatus.SAVED,
        appliedDate: dto.appliedDate ? new Date(dto.appliedDate) : undefined,
        recruiterName: dto.recruiterName,
        recruiterEmail: dto.recruiterEmail,
        notes: dto.notes,
        salary: dto.salary,
        attachments: dto.attachments ?? []
      }
    });
  }

  async update(userId: string, id: string, dto: UpdateApplicationDto) {
    await this.assertOwner(userId, id);
    return this.prisma.application.update({
      where: { id },
      data: {
        status: dto.status,
        lastContactDate: dto.lastContactDate ? new Date(dto.lastContactDate) : undefined,
        notes: dto.notes
      }
    });
  }

  async addNote(userId: string, id: string, dto: AddNoteDto) {
    await this.assertOwner(userId, id);
    return this.prisma.applicationNote.create({
      data: { applicationId: id, body: dto.body }
    });
  }

  async followUps(userId: string) {
    const applications = await this.list(userId);
    return applications
      .filter((application) => application.followUpRequired)
      .map((application) => ({
        ...application,
        email: this.generateFollowUpEmail(application.jobTitle, application.companyName, application.recruiterName)
      }));
  }

  generateFollowUpEmail(jobTitle: string, companyName: string, recruiterName?: string | null) {
    return {
      subject: `Follow-Up Regarding ${jobTitle} Application`,
      body: `Dear ${recruiterName || "Hiring Team"},\n\nI hope you are well. I wanted to follow up on my application for the ${jobTitle} role at ${companyName}. I remain very interested in the opportunity and would welcome any update on the hiring process or next steps.\n\nMy background in Power Platform, business intelligence, automation, and data workflows aligns closely with the role requirements, and I would be glad to provide any additional information.\n\nThank you for your time and consideration.\n\nKind regards`
    };
  }

  private isFollowUpRequired(appliedDate: Date | null, lastContactDate: Date | null) {
    if (!appliedDate) {
      return false;
    }
    const baseline = lastContactDate ?? appliedDate;
    return Date.now() - baseline.getTime() >= sevenDaysMs;
  }

  private async assertOwner(userId: string, id: string) {
    const application = await this.prisma.application.findUnique({ where: { id } });
    if (!application) {
      throw new NotFoundException("Application not found.");
    }
    if (application.userId !== userId) {
      throw new ForbiddenException("You do not have access to this application.");
    }
  }
}
