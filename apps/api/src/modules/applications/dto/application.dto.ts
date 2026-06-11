import { Type } from "class-transformer";
import { IsDateString, IsEmail, IsEnum, IsOptional, IsString } from "class-validator";
import { ApplicationStatus } from "@prisma/client";

export class CreateApplicationDto {
  @IsOptional()
  @IsString()
  jobId?: string;

  @IsString()
  company!: string;

  @IsString()
  jobTitle!: string;

  @IsString()
  location!: string;

  @IsOptional()
  @IsString()
  visaType?: string;

  @IsOptional()
  @IsEnum(ApplicationStatus)
  status?: ApplicationStatus;

  @IsOptional()
  @IsDateString()
  appliedDate?: string;

  @IsOptional()
  @IsDateString()
  lastContactDate?: string;

  @IsOptional()
  @IsString()
  recruiterName?: string;

  @IsOptional()
  @IsEmail()
  recruiterEmail?: string;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsString()
  salary?: string;
}

export class UpdateApplicationDto extends CreateApplicationDto {}

export class MoveApplicationDto {
  @IsEnum(ApplicationStatus)
  status!: ApplicationStatus;
}

export class CreateApplicationNoteDto {
  @IsString()
  body!: string;
}
