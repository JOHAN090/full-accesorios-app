import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsNumber,
  IsInt,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateProductoDto {
  @IsNumber({}, { message: 'La categoría debe ser un número' })
  @Type(() => Number)
  categoria_id: number;

  @IsString({ message: 'El nombre debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'El nombre es obligatorio' })
  nombre: string;

  @IsOptional()
  @IsString({ message: 'La descripción corta debe ser una cadena de texto' })
  descripcion_corta?: string;

  @IsOptional()
  @IsString({ message: 'Los detalles técnicos deben ser una cadena de texto' })
  detalles_tecnicos?: string;

  @IsNumber({}, { message: 'El precio debe ser un número' })
  @Min(0, { message: 'El precio no puede ser negativo' })
  @Type(() => Number)
  precio: number;

  @IsInt({ message: 'El stock debe ser un número entero' })
  @Min(0, { message: 'El stock no puede ser negativo' })
  @Type(() => Number)
  stock: number;

  @IsOptional()
  @IsString({ message: 'La URL de imagen debe ser una cadena de texto' })
  imagen_url?: string;

  @IsOptional()
  @IsNumber({}, { message: 'El estado de oferta debe ser un número (0 o 1)' })
  @Type(() => Number)
  en_oferta?: number;

  @IsOptional()
  @IsNumber({}, { message: 'El precio de oferta debe ser un número' })
  @Min(0, { message: 'El precio de oferta no puede ser negativo' })
  @Type(() => Number)
  precio_oferta?: number;
}
