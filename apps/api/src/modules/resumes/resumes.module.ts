import { Module } from "@nestjs/common";
import { AiModule } from "../ai/ai.module";
import { AuditModule } from "../audit/audit.module";
import { ResumeParserService } from "./resume-parser.service";
import { ResumesController } from "./resumes.controller";
import { ResumesService } from "./resumes.service";

@Module({
  imports: [AiModule, AuditModule],
  controllers: [ResumesController],
  providers: [ResumesService, ResumeParserService]
})
export class ResumesModule {}
