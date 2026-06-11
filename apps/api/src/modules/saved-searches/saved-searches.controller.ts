import { Body, Controller, Get, Param, Post, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { CurrentUser } from "../auth/current-user.decorator";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { CreateSavedSearchDto } from "./dto/saved-search.dto";
import { SavedSearchesService } from "./saved-searches.service";

@ApiBearerAuth()
@ApiTags("saved-searches")
@UseGuards(JwtAuthGuard)
@Controller("saved-searches")
export class SavedSearchesController {
  constructor(private readonly savedSearchesService: SavedSearchesService) {}

  @Get()
  list(@CurrentUser() user: { id: string }) {
    return this.savedSearchesService.list(user.id);
  }

  @Post()
  create(@CurrentUser() user: { id: string }, @Body() dto: CreateSavedSearchDto) {
    return this.savedSearchesService.create(user.id, dto);
  }

  @Post(":id/run")
  run(@CurrentUser() user: { id: string }, @Param("id") id: string) {
    return this.savedSearchesService.run(user.id, id);
  }
}
