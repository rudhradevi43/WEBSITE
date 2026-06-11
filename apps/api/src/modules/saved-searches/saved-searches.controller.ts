import { Body, Controller, Get, Post } from "@nestjs/common";
import { AuthenticatedUser, CurrentUser } from "../../common/current-user.decorator";
import { CreateSavedSearchDto } from "./dto";
import { SavedSearchesService } from "./saved-searches.service";

@Controller("saved-searches")
export class SavedSearchesController {
  constructor(private readonly savedSearches: SavedSearchesService) {}

  @Get()
  list(@CurrentUser() user: AuthenticatedUser) {
    return this.savedSearches.list(user.id);
  }

  @Post()
  create(@CurrentUser() user: AuthenticatedUser, @Body() dto: CreateSavedSearchDto) {
    return this.savedSearches.create(user.id, dto);
  }
}
