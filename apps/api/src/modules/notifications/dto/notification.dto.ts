import { IsEnum, IsOptional, IsString } from "class-validator";
import { NotificationType } from "@prisma/client";

export class CreateNotificationDto {
  @IsEnum(NotificationType)
  type!: NotificationType;

  @IsString()
  title!: string;

  @IsString()
  body!: string;

  @IsOptional()
  @IsString()
  emailTo?: string;
}
