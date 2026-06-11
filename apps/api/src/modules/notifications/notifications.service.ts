import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Resend } from "resend";
import { PrismaService } from "../prisma/prisma.service";
import { CreateNotificationDto } from "./dto/notification.dto";

@Injectable()
export class NotificationsService {
  private readonly resend?: Resend;
  private readonly emailFrom: string;

  constructor(
    private readonly prisma: PrismaService,
    configService: ConfigService
  ) {
    const apiKey = configService.get<string>("RESEND_API_KEY");
    this.resend = apiKey ? new Resend(apiKey) : undefined;
    this.emailFrom = configService.get<string>("EMAIL_FROM", "VisaPath AI <notifications@visapath.ai>");
  }

  list(userId: string) {
    return this.prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 50
    });
  }

  async create(userId: string, dto: CreateNotificationDto) {
    const notification = await this.prisma.notification.create({
      data: {
        userId,
        type: dto.type,
        title: dto.title,
        body: dto.body
      }
    });

    if (this.resend && dto.emailTo) {
      await this.resend.emails.send({
        from: this.emailFrom,
        to: dto.emailTo,
        subject: dto.title,
        text: dto.body
      });
    }

    return notification;
  }

  markRead(userId: string, id: string) {
    return this.prisma.notification.update({
      where: { id, userId },
      data: { readAt: new Date() }
    });
  }
}
