import { Injectable } from "@nestjs/common";
import { ApplicationStatus } from "@prisma/client";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class AnalyticsService {
  constructor(private readonly prisma: PrismaService) {}

  async dashboard(userId: string) {
    const applications = await this.prisma.application.findMany({ where: { userId } });
    const total = Math.max(applications.length, 1);
    const byStatus = this.countBy(applications.map((application) => application.status));
    const byCountry = this.countBy(applications.map((application) => application.location.split(",").at(-1)?.trim() || "Unknown"));
    const interviewStatuses: ApplicationStatus[] = [
      ApplicationStatus.INTERVIEW,
      ApplicationStatus.TECHNICAL_ROUND,
      ApplicationStatus.FINAL_ROUND,
      ApplicationStatus.OFFER
    ];
    const interviewCount = applications.filter((application) =>
      interviewStatuses.includes(application.status)
    ).length;
    const offerCount = applications.filter((application) => application.status === ApplicationStatus.OFFER).length;
    const responseCount = applications.filter((application) => application.lastContactDate).length;
    const visaCount = applications.filter((application) => application.status === ApplicationStatus.VISA_PROCESSING).length;

    return {
      byCountry,
      byStatus,
      kpis: {
        interviewRate: Math.round((interviewCount / total) * 100),
        responseRate: Math.round((responseCount / total) * 100),
        offerRate: Math.round((offerCount / total) * 100),
        visaSponsorshipSuccessRate: Math.round((visaCount / total) * 100)
      },
      monthlyActivity: this.countBy(
        applications.map((application) => application.createdAt.toISOString().slice(0, 7))
      )
    };
  }

  private countBy(values: string[]) {
    return Object.entries(
      values.reduce<Record<string, number>>((accumulator, value) => {
        accumulator[value] = (accumulator[value] ?? 0) + 1;
        return accumulator;
      }, {})
    ).map(([name, value]) => ({ name, value }));
  }
}
