import {
  Controller,
  Post,
  Get,
  Body,
  Req,
  UseGuards,
  UnauthorizedException,
  HttpCode,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import type { Request } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('captcha')
  getCaptcha() {
    return this.authService.generateCaptcha();
  }

  @Post('login')
  @HttpCode(200)
  async login(@Body() loginDto: LoginDto, @Req() req: Request) {
    // Validar captcha
    if (loginDto.captcha_answer.toLowerCase() !== loginDto.captcha_expected.toLowerCase()) {
      throw new UnauthorizedException('Respuesta del captcha incorrecta');
    }

    // Validar credenciales
    const user = await this.authService.validateUser(
      loginDto.correo,
      loginDto.password,
    );

    if (!user) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    let ip =
      (req.headers['x-forwarded-for'] as string) ||
      req.socket.remoteAddress ||
      'unknown';
    
    if (ip === '::1' || ip === '::ffff:127.0.0.1') {
      ip = '127.0.0.1 (Localhost)';
    }

    const navegador = (req.headers['user-agent'] as string) || 'unknown';

    const result = await this.authService.login(user, ip, navegador);

    // Incluir información sobre la fortaleza de la contraseña
    const passwordStrength = this.authService.getPasswordStrength(
      loginDto.password,
    );

    return {
      ...result,
      password_strength: passwordStrength,
    };
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  @HttpCode(200)
  async logout(@Req() req: Request) {
    const user = req.user as any;
    let ip =
      (req.headers['x-forwarded-for'] as string) ||
      req.socket.remoteAddress ||
      'unknown';
      
    if (ip === '::1' || ip === '::ffff:127.0.0.1') {
      ip = '127.0.0.1 (Localhost)';
    }

    const navegador = (req.headers['user-agent'] as string) || 'unknown';

    return this.authService.logout(user.userId, ip, navegador);
  }

  @Post('password-strength')
  @HttpCode(200)
  checkPasswordStrength(@Body('password') password: string) {
    return {
      strength: this.authService.getPasswordStrength(password),
    };
  }
}
