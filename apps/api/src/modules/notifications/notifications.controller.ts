import { Controller, Get } from "@nestjs/common";
import { AuthenticatedUser, CurrentUser } from "../../common/current-user.decorator";
import { NotificationsService } from "./notifications.service";

@Controller("notifications")
export class NotificationsController {
  constructor(private readonly notifications: NotificationsService) {}

  @Get()
  list(@CurrentUser() user: AuthenticatedUser) {
    return this.notifications.list(user.id);
  }
}
