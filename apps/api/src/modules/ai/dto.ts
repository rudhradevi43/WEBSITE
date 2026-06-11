import { IsArray, IsOptional, IsString } from "class-validator";

export class MatchResumeDto {
  @IsString()
  resumeId!: string;

  @IsString()
  jobId!: string;
}

export class CoverLetterDto {
  @IsString()
  resumeText!: string;

  @IsString()
  jobDescription!: string;
}

export class RecommendationsDto {
  @IsArray()
  @IsString({ each: true })
  skills!: string[];

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  countries?: string[];
}
