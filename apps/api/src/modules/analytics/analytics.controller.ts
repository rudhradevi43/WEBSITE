import { Controller, Get, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { CurrentUser } from "../auth/current-user.decorator";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { AnalyticsService } from "./analytics.service";

@ApiBearerAuth()
@ApiTags("analytics")
@UseGuards(JwtAuthGuard)
@Controller("analytics")
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get("dashboard")
  dashboard(@CurrentUser() user: { id: string }) {
    return this.analyticsService.dashboard(user.id);
  }
}
