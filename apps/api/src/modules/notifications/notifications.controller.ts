import { Body, Controller, Get, Param, Patch, Post, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { CurrentUser } from "../auth/current-user.decorator";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { CreateNotificationDto } from "./dto/notification.dto";
import { NotificationsService } from "./notifications.service";

@ApiBearerAuth()
@ApiTags("notifications")
@UseGuards(JwtAuthGuard)
@Controller("notifications")
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get()
  list(@CurrentUser() user: { id: string }) {
    return this.notificationsService.list(user.id);
  }

  @Post()
  create(@CurrentUser() user: { id: string }, @Body() dto: CreateNotificationDto) {
    return this.notificationsService.create(user.id, dto);
  }

  @Patch(":id/read")
  markRead(@CurrentUser() user: { id: string }, @Param("id") id: string) {
    return this.notificationsService.markRead(user.id, id);
  }
}
