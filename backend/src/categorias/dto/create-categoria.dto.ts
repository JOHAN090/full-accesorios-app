import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateCategoriaDto {
  @IsString({ message: 'El nombre debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'El nombre es obligatorio' })
  nombre: string;

  @IsString({ message: 'La descripción debe ser una cadena de texto' })
  @IsOptional()
  descripcion?: string;
}
