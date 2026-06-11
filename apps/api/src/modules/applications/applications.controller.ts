import { Body, Controller, Get, Param, Patch, Post, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { CurrentUser } from "../auth/current-user.decorator";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { ApplicationsService } from "./applications.service";
import { CreateApplicationDto, CreateApplicationNoteDto, MoveApplicationDto, UpdateApplicationDto } from "./dto/application.dto";

@ApiBearerAuth()
@ApiTags("applications")
@UseGuards(JwtAuthGuard)
@Controller("applications")
export class ApplicationsController {
  constructor(private readonly applicationsService: ApplicationsService) {}

  @Get()
  list(@CurrentUser() user: { id: string }) {
    return this.applicationsService.list(user.id);
  }

  @Get("kanban")
  kanban(@CurrentUser() user: { id: string }) {
    return this.applicationsService.kanban(user.id);
  }

  @Post()
  create(@CurrentUser() user: { id: string }, @Body() dto: CreateApplicationDto) {
    return this.applicationsService.create(user.id, dto);
  }

  @Patch(":id")
  update(@CurrentUser() user: { id: string }, @Param("id") id: string, @Body() dto: UpdateApplicationDto) {
    return this.applicationsService.update(user.id, id, dto);
  }

  @Patch(":id/move")
  move(@CurrentUser() user: { id: string }, @Param("id") id: string, @Body() dto: MoveApplicationDto) {
    return this.applicationsService.move(user.id, id, dto);
  }

  @Post(":id/notes")
  addNote(@CurrentUser() user: { id: string }, @Param("id") id: string, @Body() dto: CreateApplicationNoteDto) {
    return this.applicationsService.addNote(user.id, id, dto);
  }

  @Get(":id/follow-up-email")
  followUpEmail(@CurrentUser() user: { id: string }, @Param("id") id: string) {
    return this.applicationsService.followUpEmail(user.id, id);
  }
}
