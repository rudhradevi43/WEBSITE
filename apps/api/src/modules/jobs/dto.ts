import { ExperienceLevel, JobType, WorkMode } from "@prisma/client";
import { IsArray, IsBoolean, IsEnum, IsInt, IsOptional, IsString, Max, Min } from "class-validator";
import { Type } from "class-transformer";

export class SearchJobsDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  skills?: string[];

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  countries?: string[];

  @Type(() => Number)
  @IsInt()
  @Min(0)
  @IsOptional()
  salaryMin?: number;

  @Type(() => Number)
  @IsInt()
  @Min(0)
  @IsOptional()
  salaryMax?: number;

  @Type(() => Boolean)
  @IsBoolean()
  @IsOptional()
  sponsorshipRequired?: boolean;

  @IsEnum(WorkMode)
  @IsOptional()
  workMode?: WorkMode;

  @IsEnum(JobType)
  @IsOptional()
  jobType?: JobType;

  @IsEnum(ExperienceLevel)
  @IsOptional()
  experienceLevel?: ExperienceLevel;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  @IsOptional()
  take = 25;
}

export class CreateJobDto {
  @IsString()
  source!: string;

  @IsString()
  @IsOptional()
  externalId?: string;

  @IsString()
  title!: string;

  @IsString()
  countryCode!: string;

  @IsString()
  @IsOptional()
  companyName?: string;

  @IsString()
  @IsOptional()
  city?: string;

  @IsString()
  description!: string;

  @IsString()
  applyUrl!: string;

  @IsBoolean()
  sponsorshipAvailable!: boolean;

  @IsString()
  @IsOptional()
  visaType?: string;

  @IsEnum(WorkMode)
  workMode!: WorkMode;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  skills?: string[];
}
