import { Controller, Get, Param, Query, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { CompaniesService } from "./companies.service";

@ApiBearerAuth()
@ApiTags("companies")
@UseGuards(JwtAuthGuard)
@Controller("companies")
export class CompaniesController {
  constructor(private readonly companiesService: CompaniesService) {}

  @Get()
  list(@Query("country") country?: string) {
    return this.companiesService.list(country);
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.companiesService.findOne(id);
  }
}
