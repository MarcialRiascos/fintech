import { 
  IsString, 
  IsNumber, 
  IsInt, 
  IsPositive, 
  IsArray, 
  ValidateNested 
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProductoDto {
   @ApiProperty({
    description: 'Nombre del producto.',
    example: 'Laptop HP Pavilion 15',
  })
  @IsString()
  nombre: string;

  @ApiProperty({
    description: 'Descripción detallada del producto.',
    example: 'Laptop HP Pavilion 15.6" con procesador Intel i5 y 16GB RAM.',
  })
  @IsString()
  descripcion: string;

  @ApiProperty({
    description: 'Precio del producto en la tienda.',
    example: 2499.99,
  })
  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  precio_tienda: number;

  @ApiProperty({
    description: 'Cantidad disponible en inventario.',
    example: 25,
  })
  @IsInt()
  @IsPositive()
  stock: number;

   @ApiProperty({
    description: 'ID de la tienda asociada al producto.',
    example: 3,
  })
  @IsInt()
  tiendas_id: number;

  @ApiProperty({
    description: 'ID del estado del producto (por ejemplo: disponible, inactivo).',
    example: 1,
  })
  @IsInt()
  estados_id: number;

  @ApiProperty({
    description: 'ID del usuario (administrador o representante) que crea el producto.',
    example: 7,
  })
  @IsInt()
  usuarios_id: number;
}
