import { Body, Controller, Post } from "@nestjs/common";
import { AiService } from "./ai.service";
import { CoverLetterDto, MatchResumeDto, RecommendationsDto } from "./dto";

@Controller("ai")
export class AiController {
  constructor(private readonly ai: AiService) {}

  @Post("match")
  match(@Body() dto: MatchResumeDto) {
    return this.ai.matchResume(dto);
  }

  @Post("cover-letter")
  coverLetter(@Body() dto: CoverLetterDto) {
    return this.ai.coverLetter(dto);
  }

  @Post("recommendations")
  recommendations(@Body() dto: RecommendationsDto) {
    return this.ai.recommendations(dto);
  }
}
