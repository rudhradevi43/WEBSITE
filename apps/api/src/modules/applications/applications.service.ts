import { Injectable, NotFoundException } from "@nestjs/common";
import { ApplicationStatus, Prisma } from "@prisma/client";
import { AuditService } from "../audit/audit.service";
import { PrismaService } from "../prisma/prisma.service";
import { CreateApplicationDto, CreateApplicationNoteDto, MoveApplicationDto, UpdateApplicationDto } from "./dto/application.dto";

const FOLLOW_UP_DAYS = 7;

@Injectable()
export class ApplicationsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly auditService: AuditService
  ) {}

  async list(userId: string) {
    const applications = await this.prisma.application.findMany({
      where: { userId },
      orderBy: { updatedAt: "desc" },
      include: { applicationNotes: { orderBy: { createdAt: "desc" }, take: 3 }, reminders: true }
    });

    return applications.map((application) => this.withFollowUp(application));
  }

  async kanban(userId: string) {
    const applications = await this.list(userId);
    return Object.values(ApplicationStatus).map((status) => ({
      status,
      applications: applications.filter((application) => application.status === status)
    }));
  }

  async create(userId: string, dto: CreateApplicationDto) {
    const application = await this.prisma.application.create({
      data: {
        userId,
        jobId: dto.jobId,
        company: dto.company,
        jobTitle: dto.jobTitle,
        location: dto.location,
        visaType: dto.visaType,
        status: dto.status ?? "SAVED",
        appliedDate: dto.appliedDate ? new Date(dto.appliedDate) : undefined,
        lastContactDate: dto.lastContactDate ? new Date(dto.lastContactDate) : undefined,
        recruiterName: dto.recruiterName,
        recruiterEmail: dto.recruiterEmail,
        notes: dto.notes,
        salary: dto.salary
      }
    });

    await this.auditService.record({ userId, action: "application.created", entity: "Application", entityId: application.id });
    return this.withFollowUp(application);
  }

  async update(userId: string, id: string, dto: UpdateApplicationDto) {
    await this.ensureOwner(userId, id);
    const application = await this.prisma.application.update({
      where: { id },
      data: {
        ...this.cleanUndefined({
          jobId: dto.jobId,
          company: dto.company,
          jobTitle: dto.jobTitle,
          location: dto.location,
          visaType: dto.visaType,
          status: dto.status,
          recruiterName: dto.recruiterName,
          recruiterEmail: dto.recruiterEmail,
          notes: dto.notes,
          salary: dto.salary
        }),
        appliedDate: dto.appliedDate ? new Date(dto.appliedDate) : undefined,
        lastContactDate: dto.lastContactDate ? new Date(dto.lastContactDate) : undefined
      }
    });

    await this.auditService.record({ userId, action: "application.updated", entity: "Application", entityId: id });
    return this.withFollowUp(application);
  }

  async move(userId: string, id: string, dto: MoveApplicationDto) {
    await this.ensureOwner(userId, id);
    const application = await this.prisma.application.update({
      where: { id },
      data: {
        status: dto.status,
        lastContactDate: new Date()
      }
    });

    await this.auditService.record({
      userId,
      action: "application.status_changed",
      entity: "Application",
      entityId: id,
      metadata: { status: dto.status }
    });
    return this.withFollowUp(application);
  }

  async addNote(userId: string, id: string, dto: CreateApplicationNoteDto) {
    await this.ensureOwner(userId, id);
    const note = await this.prisma.applicationNote.create({
      data: { applicationId: id, body: dto.body }
    });
    await this.auditService.record({ userId, action: "application.note_created", entity: "Application", entityId: id });
    return note;
  }

  async followUpEmail(userId: string, id: string) {
    const application = await this.ensureOwner(userId, id);
    const subject = `Follow-Up Regarding ${application.jobTitle} Application`;
    const recruiter = application.recruiterName ? ` ${application.recruiterName}` : "";
    const body =
      `Hello${recruiter},\n\n` +
      `I hope you are well. I am writing to follow up on my application for the ${application.jobTitle} role at ${application.company}. ` +
      "I remain very interested in the opportunity and would appreciate any update you can share on the process or next steps.\n\n" +
      "Thank you for your time and consideration.\n\nBest regards";

    return { subject, body };
  }

  private async ensureOwner(userId: string, id: string) {
    const application = await this.prisma.application.findFirst({ where: { id, userId } });
    if (!application) {
      throw new NotFoundException("Application not found.");
    }
    return application;
  }

  private withFollowUp<T extends { appliedDate: Date | null; lastContactDate: Date | null; status: ApplicationStatus }>(application: T) {
    const anchor = application.lastContactDate ?? application.appliedDate;
    const ageInDays = anchor ? (Date.now() - anchor.getTime()) / 86_400_000 : 0;
    const activeStatuses: ApplicationStatus[] = ["APPLIED", "INTERVIEW", "TECHNICAL_ROUND", "FINAL_ROUND", "VISA_PROCESSING"];
    return {
      ...application,
      followUpRequired: Boolean(anchor && ageInDays >= FOLLOW_UP_DAYS && activeStatuses.includes(application.status))
    };
  }

  private cleanUndefined<T extends Record<string, unknown>>(input: T): Prisma.JsonObject {
    return Object.fromEntries(Object.entries(input).filter(([, value]) => value !== undefined)) as Prisma.JsonObject;
  }
}
