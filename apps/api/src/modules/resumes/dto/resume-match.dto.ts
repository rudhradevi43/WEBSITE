import { IsArray, IsOptional, IsString } from "class-validator";

export class ResumeMatchDto {
  @IsOptional()
  @IsString()
  jobId?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  jobSkills?: string[];
}
