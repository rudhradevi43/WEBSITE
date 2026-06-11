import { SavedSearchFrequency } from "@prisma/client";
import { IsEnum, IsObject, IsString } from "class-validator";

export class CreateSavedSearchDto {
  @IsString()
  name!: string;

  @IsObject()
  query!: Record<string, unknown>;

  @IsEnum(SavedSearchFrequency)
  frequency!: SavedSearchFrequency;
}
