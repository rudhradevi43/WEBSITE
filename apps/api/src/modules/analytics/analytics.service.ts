import { Injectable } from "@nestjs/common";
import { ApplicationStatus } from "@prisma/client";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class AnalyticsService {
  constructor(private readonly prisma: PrismaService) {}

  async dashboard(userId: string) {
    const applications = await this.prisma.application.findMany({ where: { userId } });
    const total = applications.length || 1;
    const byStatus = Object.values(ApplicationStatus).map((status) => ({
      status,
      count: applications.filter((application) => application.status === status).length
    }));
    const byCountry = this.groupBy(
      applications.map((application) => ({
        key: application.location.split(",").at(-1)?.trim() || application.location,
        value: 1
      }))
    );
    const interviewCount = applications.filter((application) =>
      ["INTERVIEW", "TECHNICAL_ROUND", "FINAL_ROUND", "OFFER", "VISA_PROCESSING"].includes(application.status)
    ).length;
    const offerCount = applications.filter((application) => application.status === "OFFER").length;
    const responseCount = applications.filter((application) => application.lastContactDate).length;
    const visaSuccessCount = applications.filter((application) => application.status === "VISA_PROCESSING").length;

    return {
      applicationsByCountry: byCountry,
      applicationsByStatus: byStatus,
      interviewRate: Math.round((interviewCount / total) * 100),
      responseRate: Math.round((responseCount / total) * 100),
      offerRate: Math.round((offerCount / total) * 100),
      visaSponsorshipSuccessRate: Math.round((visaSuccessCount / total) * 100),
      monthlyActivity: this.monthlyActivity(applications)
    };
  }

  private groupBy(items: Array<{ key: string; value: number }>) {
    const counts = new Map<string, number>();
    for (const item of items) {
      counts.set(item.key, (counts.get(item.key) ?? 0) + item.value);
    }
    return Array.from(counts.entries()).map(([name, count]) => ({ name, count }));
  }

  private monthlyActivity(applications: Array<{ createdAt: Date }>) {
    const months = Array.from({ length: 6 }, (_, index) => {
      const date = new Date();
      date.setMonth(date.getMonth() - (5 - index));
      return {
        key: `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`,
        label: date.toLocaleString("en", { month: "short" }),
        count: 0
      };
    });

    for (const application of applications) {
      const key = `${application.createdAt.getFullYear()}-${String(application.createdAt.getMonth() + 1).padStart(2, "0")}`;
      const month = months.find((item) => item.key === key);
      if (month) {
        month.count += 1;
      }
    }

    return months;
  }
}
