import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { NotificationType } from "@prisma/client";
import { Resend } from "resend";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class NotificationsService {
  private readonly resend?: Resend;
  private readonly from: string;

  constructor(
    private readonly prisma: PrismaService,
    config: ConfigService
  ) {
    const apiKey = config.get<string>("RESEND_API_KEY");
    this.resend = apiKey ? new Resend(apiKey) : undefined;
    this.from = config.get<string>("RESEND_FROM") ?? "VisaPath AI <notifications@example.com>";
  }

  list(userId: string) {
    return this.prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 50
    });
  }

  async notify(userId: string, type: NotificationType, title: string, body: string) {
    const notification = await this.prisma.notification.create({ data: { userId, type, title, body } });
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (this.resend && user) {
      await this.resend.emails.send({
        from: this.from,
        to: user.email,
        subject: title,
        text: body
      });
    }
    return notification;
  }
}
