import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class CompaniesService {
  constructor(private readonly prisma: PrismaService) {}

  sponsors(country?: string) {
    return this.prisma.company.findMany({
      where: country
        ? {
            country: {
              OR: [
                { code: country.toUpperCase() },
                { name: { contains: country, mode: "insensitive" } }
              ]
            }
          }
        : {},
      orderBy: [{ sponsorshipConfidenceScore: "desc" }, { name: "asc" }],
      include: { country: true, visaPrograms: true }
    });
  }

  countries() {
    return this.prisma.country.findMany({
      orderBy: { name: "asc" },
      include: { visaPrograms: true }
    });
  }
}
