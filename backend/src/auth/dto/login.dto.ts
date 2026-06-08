import { IsEmail, IsString, MinLength, IsNotEmpty } from 'class-validator';

export class LoginDto {
  @IsEmail({}, { message: 'El correo debe ser un email válido' })
  correo: string;

  @IsString()
  @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres' })
  password: string;

  @IsString({ message: 'El captcha debe ser texto' })
  captcha_answer: string;

  @IsNotEmpty({ message: 'El captcha esperado es requerido' })
  @IsString({ message: 'El captcha esperado debe ser texto' })
  captcha_expected: string;
}
