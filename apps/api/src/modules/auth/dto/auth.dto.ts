import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsOptional, IsString, Matches, MinLength } from "class-validator";

export class RegisterDto {
  @ApiProperty({ example: "candidate@example.com" })
  @IsEmail()
  email!: string;

  @ApiProperty({ example: "Asha Candidate" })
  @IsString()
  @MinLength(2)
  name!: string;

  @ApiProperty({ example: "PowerPass123!" })
  @IsString()
  @MinLength(10)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/, {
    message: "password must contain lowercase, uppercase, and numeric characters"
  })
  password!: string;

  @IsOptional()
  @IsString()
  countryTarget?: string;
}

export class LoginDto {
  @ApiProperty({ example: "candidate@example.com" })
  @IsEmail()
  email!: string;

  @ApiProperty({ example: "PowerPass123!" })
  @IsString()
  password!: string;
}
