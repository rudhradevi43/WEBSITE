import { Body, Controller, Post } from "@nestjs/common";
import { Public } from "../../common/public.decorator";
import { AuthService } from "./auth.service";
import { AuthJsLoginDto, LoginDto, RegisterDto } from "./dto";

@Controller("auth")
export class AuthController {
  constructor(private readonly auth: AuthService) {}

  @Public()
  @Post("register")
  register(@Body() dto: RegisterDto) {
    return this.auth.register(dto);
  }

  @Public()
  @Post("login")
  login(@Body() dto: LoginDto) {
    return this.auth.login(dto);
  }

  @Public()
  @Post("authjs")
  authJsLogin(@Body() dto: AuthJsLoginDto) {
    return this.auth.authJsLogin(dto);
  }
}
