import { IsEnum, IsObject, IsString } from "class-validator";
import { SavedSearchFrequency } from "@prisma/client";

export class CreateSavedSearchDto {
  @IsString()
  name!: string;

  @IsObject()
  query!: Record<string, unknown>;

  @IsEnum(SavedSearchFrequency)
  frequency!: SavedSearchFrequency;
}
