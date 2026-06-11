import { ApplicationStatus } from "@prisma/client";
import { IsArray, IsDateString, IsEmail, IsEnum, IsOptional, IsString } from "class-validator";

export class CreateApplicationDto {
  @IsString()
  @IsOptional()
  jobId?: string;

  @IsString()
  companyName!: string;

  @IsString()
  jobTitle!: string;

  @IsString()
  location!: string;

  @IsString()
  @IsOptional()
  visaType?: string;

  @IsDateString()
  @IsOptional()
  appliedDate?: string;

  @IsString()
  @IsOptional()
  recruiterName?: string;

  @IsEmail()
  @IsOptional()
  recruiterEmail?: string;

  @IsString()
  @IsOptional()
  notes?: string;

  @IsString()
  @IsOptional()
  salary?: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  attachments?: string[];
}

export class UpdateApplicationDto {
  @IsEnum(ApplicationStatus)
  @IsOptional()
  status?: ApplicationStatus;

  @IsDateString()
  @IsOptional()
  lastContactDate?: string;

  @IsString()
  @IsOptional()
  notes?: string;
}

export class AddNoteDto {
  @IsString()
  body!: string;
}
