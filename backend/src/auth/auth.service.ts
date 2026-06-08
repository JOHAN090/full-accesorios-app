import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import * as svgCaptcha from 'svg-captcha';
import { UsuariosService } from '../usuarios/usuarios.service';
import { LogsAccesoService } from '../logs-acceso/logs-acceso.service';
import {
  evaluatePasswordStrength,
  PasswordStrength,
} from './utils/password-strength.util';

@Injectable()
export class AuthService {
  constructor(
    private usuariosService: UsuariosService,
    private jwtService: JwtService,
    private logsAccesoService: LogsAccesoService,
  ) {}

  async validateUser(correo: string, password: string): Promise<any> {
    const user = await this.usuariosService.findByEmail(correo);

    if (!user) {
      console.log(`❌ Login fallido: usuario '${correo}' no encontrado`);
      return null;
    }

    // Debug: log the actual estado value and its type
    console.log(`🔍 Usuario encontrado: ${user.correo}, estado='${user.estado}', tipo=${typeof user.estado}, rol=${user.rol?.nombre || 'sin rol'}`);

    // Robust estado check: trim whitespace and compare case-insensitively
    const estado = (user.estado || '').toString().trim().toLowerCase();
    if (estado !== 'activo') {
      console.log(`❌ Login fallido: estado='${user.estado}' (normalizado='${estado}') no es 'activo'`);
      throw new UnauthorizedException('La cuenta está inactiva');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password_hash);

    if (!isPasswordValid) {
      console.log(`❌ Login fallido: contraseña incorrecta para ${correo}`);
      return null;
    }

    console.log(`✅ Login exitoso para ${correo}`);
    const { password_hash, ...result } = user as any;
    return result;
  }

  async login(
    user: any,
    ip: string,
    navegador: string,
  ): Promise<{
    access_token: string;
    user: any;
    password_strength?: PasswordStrength;
  }> {
    const rolNombre = (user.rol?.nombre || user.rol || '').toString().toLowerCase();

    const payload = {
      sub: user.id,
      correo: user.correo,
      rol: rolNombre,
    };

    await this.logsAccesoService.create(user.id, ip, 'INGRESO', navegador);

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        nombres: user.nombres,
        apellidos: user.apellidos,
        correo: user.correo,
        rol: rolNombre,
        estado: user.estado,
      },
    };
  }

  async logout(
    userId: number,
    ip: string,
    navegador: string,
  ): Promise<{ message: string }> {
    await this.logsAccesoService.create(userId, ip, 'SALIDA', navegador);
    return { message: 'Sesión cerrada exitosamente' };
  }

  generateCaptcha() {
    const captcha = svgCaptcha.create({
      size: 4,
      ignoreChars: '0o1il', // Avoid ambiguous characters
      noise: 3,
      color: true,
      background: '#16213e', // Match the dashboard card theme
    });

    return {
      image: captcha.data, // This is the SVG string
      answer: captcha.text, // This is the solution
    };
  }

  getPasswordStrength(password: string): PasswordStrength {
    return evaluatePasswordStrength(password);
  }
}
