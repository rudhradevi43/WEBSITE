import { Body, Controller, Get, Param, Patch, Post } from "@nestjs/common";
import { CurrentUser, AuthenticatedUser } from "../../common/current-user.decorator";
import { AddNoteDto, CreateApplicationDto, UpdateApplicationDto } from "./dto";
import { ApplicationsService } from "./applications.service";

@Controller("applications")
export class ApplicationsController {
  constructor(private readonly applications: ApplicationsService) {}

  @Get()
  list(@CurrentUser() user: AuthenticatedUser) {
    return this.applications.list(user.id);
  }

  @Post()
  create(@CurrentUser() user: AuthenticatedUser, @Body() dto: CreateApplicationDto) {
    return this.applications.create(user.id, dto);
  }

  @Patch(":id")
  update(@CurrentUser() user: AuthenticatedUser, @Param("id") id: string, @Body() dto: UpdateApplicationDto) {
    return this.applications.update(user.id, id, dto);
  }

  @Post(":id/notes")
  addNote(@CurrentUser() user: AuthenticatedUser, @Param("id") id: string, @Body() dto: AddNoteDto) {
    return this.applications.addNote(user.id, id, dto);
  }

  @Get("follow-ups")
  followUps(@CurrentUser() user: AuthenticatedUser) {
    return this.applications.followUps(user.id);
  }
}
