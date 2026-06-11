import { ConflictException, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Role, User } from "@prisma/client";
import bcrypt from "bcryptjs";
import { PrismaService } from "../prisma/prisma.service";
import { AuthJsLoginDto, LoginDto, RegisterDto } from "./dto";

const defaultKeywords = [
  "Power Apps",
  "Power Automate",
  "Power BI",
  "DAX",
  "Power Fx",
  "Dataverse",
  "SharePoint Online",
  "Python",
  "Pandas",
  "SQL",
  "ETL",
  "Microsoft 365",
  "Teams Integration",
  "Workflow Automation"
];

const defaultTitles = [
  "Power Platform Developer",
  "Power BI Developer",
  "Data Analyst",
  "Business Intelligence Analyst",
  "Python Automation Engineer",
  "ETL Developer",
  "Microsoft 365 Consultant"
];

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService
  ) {}

  async register(dto: RegisterDto) {
    const existing = await this.prisma.user.findUnique({ where: { email: dto.email.toLowerCase() } });
    if (existing) {
      throw new ConflictException("A user with this email already exists.");
    }

    const user = await this.prisma.user.create({
      data: {
        email: dto.email.toLowerCase(),
        name: dto.name,
        passwordHash: await bcrypt.hash(dto.password, 12),
        targetSkills: defaultKeywords,
        targetTitles: defaultTitles,
        targetCountries: ["United Kingdom", "Germany", "Netherlands", "Ireland", "Canada", "Australia"]
      }
    });

    return this.session(user);
  }

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({ where: { email: dto.email.toLowerCase() } });
    if (!user?.passwordHash || !(await bcrypt.compare(dto.password, user.passwordHash))) {
      throw new UnauthorizedException("Invalid email or password.");
    }

    return this.session(user);
  }

  async authJsLogin(dto: AuthJsLoginDto) {
    const user = await this.prisma.user.upsert({
      where: { email: dto.email.toLowerCase() },
      update: { name: dto.name ?? dto.email },
      create: {
        email: dto.email.toLowerCase(),
        name: dto.name ?? dto.email,
        targetSkills: defaultKeywords,
        targetTitles: defaultTitles
      }
    });
    return this.session(user);
  }

  session(user: Pick<User, "id" | "email" | "name" | "role">) {
    const accessToken = this.jwt.sign({ sub: user.id, email: user.email, role: user.role });
    return {
      accessToken,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role as Role
      }
    };
  }
}
