// src/modules/orden-compra/dto/create-orden-compra.dto.ts
import {
  IsNotEmpty,
  IsNumber,
  IsInt,
  ValidateNested,
  IsArray,
} from 'class-validator';
import { Type } from 'class-transformer';

class ProductoOrdenCompraDto {
  @IsNotEmpty()
  @IsInt()
  productos_id: number;

  @IsNumber()
  precio_tienda: number;

  @IsNumber()
  precio_senda: number;

  @IsNumber()
  cantidad: number;

  @IsInt()
  estados_id: number;
}

export class CreateOrdenCompraDto {
  @IsNumber()
  monto: number;

  @IsInt()
  cuotas: number;

  @IsInt()
  usuarios_id: number;

  @IsInt()
  tiendas_id: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProductoOrdenCompraDto)
  productos: ProductoOrdenCompraDto[];
}
