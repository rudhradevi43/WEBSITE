import { Controller, Get, Post, UploadedFile, UseInterceptors } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { CurrentUser, AuthenticatedUser } from "../../common/current-user.decorator";
import { ResumesService } from "./resumes.service";

@Controller("resumes")
export class ResumesController {
  constructor(private readonly resumes: ResumesService) {}

  @Post()
  @UseInterceptors(
    FileInterceptor("resume", {
      limits: { fileSize: 5 * 1024 * 1024 },
      fileFilter: (_req, file, callback) => {
        callback(null, file.mimetype === "application/pdf");
      }
    })
  )
  upload(@CurrentUser() user: AuthenticatedUser, @UploadedFile() file: Express.Multer.File) {
    return this.resumes.upload(user.id, file);
  }

  @Get("latest")
  latest(@CurrentUser() user: AuthenticatedUser) {
    return this.resumes.latest(user.id);
  }
}
