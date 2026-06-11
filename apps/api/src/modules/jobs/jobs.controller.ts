import { Body, Controller, Get, Param, Post, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { JobSearchDto } from "./dto/job-search.dto";
import { JobsService } from "./jobs.service";

@ApiBearerAuth()
@ApiTags("jobs")
@UseGuards(JwtAuthGuard)
@Controller("jobs")
export class JobsController {
  constructor(private readonly jobsService: JobsService) {}

  @Post("search")
  search(@Body() dto: JobSearchDto) {
    return this.jobsService.search(dto);
  }

  @Get("featured")
  featured() {
    return this.jobsService.featured();
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.jobsService.findOne(id);
  }
}
