import { Body, Controller, Get, Post, Query } from "@nestjs/common";
import { Public } from "../../common/public.decorator";
import { CreateJobDto, SearchJobsDto } from "./dto";
import { JobsService } from "./jobs.service";

@Controller("jobs")
export class JobsController {
  constructor(private readonly jobs: JobsService) {}

  @Get()
  search(@Query() dto: SearchJobsDto) {
    return this.jobs.search(dto);
  }

  @Public()
  @Get("sources")
  sources() {
    return this.jobs.sources();
  }

  @Post()
  create(@Body() dto: CreateJobDto) {
    return this.jobs.create(dto);
  }
}
