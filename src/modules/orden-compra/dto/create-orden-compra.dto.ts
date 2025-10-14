// src/modules/orden-compra/dto/create-orden-compra.dto.ts
import {
  IsNotEmpty,
  IsNumber,
  IsInt,
  ValidateNested,
  IsArray,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

class ProductoOrdenCompraDto {
  @ApiProperty({
    description: 'ID del producto incluido en la orden de compra',
    example: 12,
  })
  @IsNotEmpty()
  @IsInt()
  productos_id: number;

  @ApiProperty({
    description: 'Precio del producto en la tienda (precio base)',
    example: 4500.5,
  })
  @IsNumber()
  precio_tienda: number;

  @ApiProperty({
    description: 'Precio del producto para la plataforma Senda',
    example: 4200.75,
  })
  @IsNumber()
  precio_senda: number;

  @ApiProperty({
    description: 'Cantidad del producto solicitada en la orden',
    example: 3,
  })
  @IsNumber()
  cantidad: number;

  @ApiProperty({
    description: 'ID del estado del producto dentro de la orden',
    example: 1,
  })
  @IsInt()
  estados_id: number;
}

export class CreateOrdenCompraDto {
  @ApiProperty({
    description: 'Monto total de la orden de compra',
    example: 22601.43,
  })
  @IsNumber()
  monto: number;

  @ApiProperty({
    description: 'Cantidad total de cuotas para el pago de la orden',
    example: 3,
  })
  @IsInt()
  cuotas: number;

  @ApiProperty({
    description: 'ID del usuario que realiza la compra',
    example: 5,
  })
  @IsInt()
  usuarios_id: number;

  @ApiProperty({
    description: 'ID de la tienda en la que se realiza la compra',
    example: 2,
  })
  @IsInt()
  tiendas_id: number;

  @ApiProperty({
    description: 'Listado de productos incluidos en la orden de compra',
    type: [ProductoOrdenCompraDto],
    example: [
      {
        productos_id: 12,
        precio_tienda: 4500.5,
        precio_senda: 4200.75,
        cantidad: 3,
        estados_id: 1,
      },
      {
        productos_id: 25,
        precio_tienda: 1299.99,
        precio_senda: 1100.0,
        cantidad: 2,
        estados_id: 1,
      },
    ],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProductoOrdenCompraDto)
  productos: ProductoOrdenCompraDto[];
}
