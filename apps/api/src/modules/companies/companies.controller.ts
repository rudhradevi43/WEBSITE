import { Controller, Get, Query } from "@nestjs/common";
import { Public } from "../../common/public.decorator";
import { CompaniesService } from "./companies.service";

@Controller()
export class CompaniesController {
  constructor(private readonly companies: CompaniesService) {}

  @Public()
  @Get("companies/sponsors")
  sponsors(@Query("country") country?: string) {
    return this.companies.sponsors(country);
  }

  @Public()
  @Get("countries")
  countries() {
    return this.companies.countries();
  }
}
