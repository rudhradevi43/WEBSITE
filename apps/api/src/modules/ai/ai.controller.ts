import { Body, Controller, Post, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { AiService } from "./ai.service";
import { CoverLetterDto, RecommendationDto } from "./dto/ai.dto";

@ApiBearerAuth()
@ApiTags("ai")
@UseGuards(JwtAuthGuard)
@Controller("ai")
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Post("cover-letter")
  generateCoverLetter(@Body() dto: CoverLetterDto) {
    return this.aiService.generateCoverLetter(dto);
  }

  @Post("recommendations")
  recommend(@Body() dto: RecommendationDto) {
    return this.aiService.recommendSkills(dto.skills);
  }
}
