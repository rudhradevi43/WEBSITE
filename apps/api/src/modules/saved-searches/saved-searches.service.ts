import { Injectable, NotFoundException } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { JobsService } from "../jobs/jobs.service";
import { PrismaService } from "../prisma/prisma.service";
import { CreateSavedSearchDto } from "./dto/saved-search.dto";

@Injectable()
export class SavedSearchesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jobsService: JobsService
  ) {}

  list(userId: string) {
    return this.prisma.savedSearch.findMany({
      where: { userId },
      orderBy: { updatedAt: "desc" }
    });
  }

  create(userId: string, dto: CreateSavedSearchDto) {
    return this.prisma.savedSearch.create({
      data: {
        userId,
        name: dto.name,
        query: dto.query as Prisma.InputJsonValue,
        frequency: dto.frequency
      }
    });
  }

  async run(userId: string, id: string) {
    const savedSearch = await this.prisma.savedSearch.findFirst({ where: { id, userId } });
    if (!savedSearch) {
      throw new NotFoundException("Saved search not found.");
    }

    const results = await this.jobsService.search(savedSearch.query as Record<string, unknown>);
    await this.prisma.savedSearch.update({ where: { id }, data: { lastRunAt: new Date() } });
    return { savedSearch, results };
  }
}
