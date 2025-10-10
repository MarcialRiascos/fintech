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

export class UpdateProductoDto {
   @ApiProperty({
    description: 'Nombre del producto que se desea actualizar',
    example: 'Camiseta deportiva Nike Dri-FIT',
  })
  @IsString()
  nombre: string;

   @ApiProperty({
    description: 'Descripción detallada del producto',
    example: 'Camiseta ligera y transpirable ideal para entrenamientos intensos.',
  })
  @IsString()
  descripcion: string;

  @ApiProperty({
    description: 'Precio del producto en la tienda. Solo se permiten hasta 2 decimales.',
    example: 129.99,
  })
  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  precio_tienda: number;

   @ApiProperty({
    description: 'Cantidad disponible en inventario del producto',
    example: 50,
  })
  @IsInt()
  @IsPositive()
  stock: number;

  @ApiProperty({
    description: 'Identificador de la tienda a la que pertenece el producto',
    example: 3,
  })
  @IsInt()
  tiendas_id: number;

  @ApiProperty({
    description: 'Identificador del estado actual del producto (por ejemplo, activo, inactivo, agotado)',
    example: 1,
  })
  @IsInt()
  estados_id: number;

  @ApiProperty({
    description: 'Identificador del usuario que realiza la modificación del producto',
    example: 12,
  })
  @IsInt()
  usuarios_id: number;
}
