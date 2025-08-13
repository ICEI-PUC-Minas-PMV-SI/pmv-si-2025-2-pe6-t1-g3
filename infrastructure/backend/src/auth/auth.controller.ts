import { Body, Controller, Patch, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto, RegistroDto } from './dto/login.dto';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/login')
  login(@Body() body: LoginDto) {
    return this.authService.login(body);
  }

  @Patch('/alterar/senha')
  alterar(@Body() body: LoginDto) {
    return this.authService.alteraLogin(body);
  }

  @Post('/registro')
  primeiroCad(@Body() body: RegistroDto) {
    return this.authService.registro(body);
  }
}
