import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { ApiBearerAuth, ApiConsumes, ApiTags } from "@nestjs/swagger";
import { memoryStorage } from "multer";
import { CurrentUser } from "../auth/current-user.decorator";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { ResumeMatchDto } from "./dto/resume-match.dto";
import { ResumesService } from "./resumes.service";

@ApiBearerAuth()
@ApiTags("resumes")
@UseGuards(JwtAuthGuard)
@Controller("resumes")
export class ResumesController {
  constructor(private readonly resumesService: ResumesService) {}

  @Post("upload")
  @ApiConsumes("multipart/form-data")
  @UseInterceptors(
    FileInterceptor("file", {
      storage: memoryStorage(),
      limits: { fileSize: 5 * 1024 * 1024 },
      fileFilter: (_request, file, callback) => {
        if (file.mimetype !== "application/pdf") {
          callback(new BadRequestException("Only PDF resumes are supported."), false);
          return;
        }
        callback(null, true);
      }
    })
  )
  upload(@CurrentUser() user: { id: string }, @UploadedFile() file: Express.Multer.File) {
    return this.resumesService.upload(user.id, file);
  }

  @Get("latest")
  latest(@CurrentUser() user: { id: string }) {
    return this.resumesService.latest(user.id);
  }

  @Post("match")
  match(@CurrentUser() user: { id: string }, @Body() dto: ResumeMatchDto) {
    return this.resumesService.matchLatest(user.id, dto);
  }
}
