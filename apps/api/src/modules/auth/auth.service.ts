import { ConflictException, Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { compare, hash } from "bcryptjs";
import { PrismaService } from "../prisma/prisma.service";
import { LoginDto, RegisterDto } from "./dto/auth.dto";

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService
  ) {}

  async register(dto: RegisterDto) {
    const existing = await this.prisma.user.findUnique({ where: { email: dto.email.toLowerCase() } });
    if (existing) {
      throw new ConflictException("An account already exists for this email.");
    }

    const passwordHash = await this.hashPassword(dto.password);
    const user = await this.prisma.user.create({
      data: {
        email: dto.email.toLowerCase(),
        name: dto.name,
        passwordHash,
        countryTarget: dto.countryTarget
      }
    });

    return this.issueSession(user);
  }

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({ where: { email: dto.email.toLowerCase() } });
    if (!user?.passwordHash) {
      throw new UnauthorizedException("Invalid email or password.");
    }

    const isValid = await compare(this.withPepper(dto.password), user.passwordHash);
    if (!isValid) {
      throw new UnauthorizedException("Invalid email or password.");
    }

    return this.issueSession(user);
  }

  async profile(userId: string) {
    const user = await this.prisma.user.findUniqueOrThrow({
      where: { id: userId },
      select: { id: true, email: true, name: true, role: true, countryTarget: true, createdAt: true }
    });
    return user;
  }

  private async hashPassword(password: string) {
    return hash(this.withPepper(password), 12);
  }

  private withPepper(password: string) {
    return `${password}${this.configService.get<string>("PASSWORD_PEPPER", "")}`;
  }

  private issueSession(user: { id: string; email: string; name: string | null; role: string }) {
    const accessToken = this.jwtService.sign({
      sub: user.id,
      email: user.email,
      role: user.role
    });

    return {
      accessToken,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role
      }
    };
  }
}
