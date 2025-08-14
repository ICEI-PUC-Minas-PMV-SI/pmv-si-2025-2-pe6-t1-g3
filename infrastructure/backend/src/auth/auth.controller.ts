import {
  Body,
  Controller,
  Post,
  Req,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto, RegistroDto, ChangePasswordDto } from './dto/login.dto';
import { Public } from './decorators/public.decorator';
import { AuthGuard } from './auth.guard';
import { Request } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  login(@Body() body: LoginDto) {
    return this.authService.login(body);
  }

  @Public()
  @Post('registro')
  @HttpCode(HttpStatus.CREATED)
  register(@Body() body: RegistroDto) {
    return this.authService.registro(body);
  }

  @UseGuards(AuthGuard)
  @Post('change-password')
  @HttpCode(HttpStatus.OK)
  changePassword(@Body() body: ChangePasswordDto, @Req() req: Request) {
    const userId = req['userId'];
    return this.authService.changePassword(
      userId,
      body.oldPassword,
      body.newPassword,
    );
  }

  @UseGuards(AuthGuard)
  @Post('validate-token')
  @HttpCode(HttpStatus.OK)
  validateToken(@Req() req: Request) {
    return {
      valid: true,
      user: req['user'],
    };
  }
}
