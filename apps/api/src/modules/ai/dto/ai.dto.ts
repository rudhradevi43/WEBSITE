import { IsArray, IsOptional, IsString } from "class-validator";

export class CoverLetterDto {
  @IsString()
  resumeText!: string;

  @IsString()
  jobDescription!: string;

  @IsOptional()
  @IsString()
  companyName?: string;

  @IsOptional()
  @IsString()
  roleTitle?: string;
}

export class RecommendationDto {
  @IsArray()
  @IsString({ each: true })
  skills!: string[];

  @IsArray()
  @IsString({ each: true })
  countryPreferences!: string[];

  @IsOptional()
  @IsString()
  resumeText?: string;
}
