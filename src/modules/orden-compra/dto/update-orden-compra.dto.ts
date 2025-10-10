// src/modules/orden-compra/dto/update-orden-compra.dto.ts
import {
  IsOptional,
  IsArray,
  ValidateNested,
  IsNumber,
  IsString,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

class ProductoOrdenUpdateDto {
  @ApiPropertyOptional({
    description:
      'ID del producto en la orden. Si se envía, indica que el producto ya existe y debe actualizarse.',
    example: 7,
  })
  @IsOptional()
  @IsNumber()
  id?: number; // si viene, significa que ya existe en la orden

   @ApiPropertyOptional({
    description:
      'ID del producto nuevo que se desea agregar a la orden. Si no se envía `id`, se usa este campo para crear uno nuevo.',
    example: 15,
  })
  @IsOptional()
  @IsNumber()
  productoId?: number; // si no viene id, entonces es un producto nuevo

   @ApiProperty({
    description: 'Cantidad del producto en la orden (requerido).',
    example: 3,
  })
  @IsNumber()
  cantidad: number;

  @ApiPropertyOptional({
    description: 'Precio del producto en la tienda.',
    example: 4500.5,
  })
  @IsOptional()
  @IsNumber()
  precio_tienda?: number;

  @ApiPropertyOptional({
    description: 'Precio del producto para la plataforma Senda.',
    example: 4200.75,
  })
  @IsOptional()
  @IsNumber()
  precio_senda?: number;

   @ApiPropertyOptional({
    description: 'ID del estado del producto dentro de la orden.',
    example: 2,
  })
  @IsOptional()
  @IsNumber()
  estadoId?: number;
}

export class UpdateOrdenCompraDto {
   @ApiPropertyOptional({
    description: 'ID del nuevo estado de la orden de compra (si aplica).',
    example: 3,
  })
  @IsOptional()
  @IsNumber()
  estadoId?: number;

  @ApiPropertyOptional({
    description: 'Listado de productos a modificar o agregar a la orden.',
    type: [ProductoOrdenUpdateDto],
    example: [
      {
        id: 7,
        cantidad: 4,
        precio_tienda: 4700.0,
        estadoId: 1,
      },
      {
        productoId: 15,
        cantidad: 2,
        precio_tienda: 1299.99,
        precio_senda: 1100.0,
        estadoId: 1,
      },
    ],
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProductoOrdenUpdateDto)
  productos?: ProductoOrdenUpdateDto[];
}
