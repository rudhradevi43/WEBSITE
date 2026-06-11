import { Controller, Get } from "@nestjs/common";
import { AuthenticatedUser, CurrentUser } from "../../common/current-user.decorator";
import { AnalyticsService } from "./analytics.service";

@Controller("analytics")
export class AnalyticsController {
  constructor(private readonly analytics: AnalyticsService) {}

  @Get()
  dashboard(@CurrentUser() user: AuthenticatedUser) {
    return this.analytics.dashboard(user.id);
  }
}
