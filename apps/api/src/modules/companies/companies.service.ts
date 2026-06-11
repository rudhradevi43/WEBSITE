import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class CompaniesService {
  constructor(private readonly prisma: PrismaService) {}

  list(country?: string) {
    return this.prisma.company.findMany({
      where: country ? { country: { name: country } } : undefined,
      orderBy: [{ sponsorshipConfidenceScore: "desc" }, { name: "asc" }],
      include: { country: true, visaPrograms: true, _count: { select: { jobs: true } } }
    });
  }

  findOne(id: string) {
    return this.prisma.company.findUniqueOrThrow({
      where: { id },
      include: { country: true, visaPrograms: true, jobs: { take: 10, orderBy: { datePosted: "desc" } } }
    });
  }
}
