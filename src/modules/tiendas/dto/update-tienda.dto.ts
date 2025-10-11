import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsInt, IsNumber, Length, IsOptional } from 'class-validator';

export class UpdateTiendaDto {
  @ApiProperty({
    example: 'Tienda Central Senda',
    description: 'Nombre completo de la tienda o establecimiento comercial.',
    maxLength: 100,
  })
  @IsString()
  @Length(1, 100)
  nombre: string;

  @ApiProperty({
    example: 'Tienda principal de productos alimenticios y bebidas.',
    description: 'Descripción general de la tienda.',
    maxLength: 100,
  })
  @IsString()
  @Length(1, 100)
  descripcion: string;

  @ApiProperty({
    example: '901456789',
    description: 'Número de identificación tributaria (NIT) de la tienda.',
    maxLength: 45,
  })
  @IsString()
  @Length(1, 45)
  nit: string;

  @ApiProperty({
    example: 1,
    description: 'Dígito de verificación del NIT.',
  })
  @IsInt()
  dv: number;

  @ApiProperty({
    example: 'Centro',
    description: 'Barrio o zona donde se encuentra ubicada la tienda.',
    maxLength: 45,
  })
  @IsString()
  @Length(1, 45)
  barrio: string;

  @ApiProperty({
    example: 'Cra 45 #12-45',
    description: 'Dirección física exacta de la tienda.',
    maxLength: 100,
  })
  @IsString()
  @Length(1, 100)
  direccion: string;

  @ApiProperty({
    example: '+57 3124567890',
    description: 'Número de teléfono principal de contacto de la tienda.',
    maxLength: 20,
  })
  @IsString()
  @Length(1, 20)
  telefono_uno: string;

   @ApiProperty({
    example: 12.5,
    description: 'Porcentaje de comisión o margen aplicado a las ventas de la tienda.',
  })
  @IsNumber()
  porcentaje: number;

   @ApiProperty({
    example: 1,
    description: 'ID del estado asociado a la tienda (activo, inactivo, etc.).',
  })
  @IsInt()
  estados_id: number;

   @ApiProperty({
    example: 1,
    description: 'ID del estado asociado a la tienda (activo, inactivo, etc.).',
  })
  @IsInt()
  usuarios_id: number; // Representante
}
