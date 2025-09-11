// src/modules/orden-compra/dto/update-orden-compra.dto.ts
import {
  IsOptional,
  IsArray,
  ValidateNested,
  IsNumber,
  IsString,
} from 'class-validator';
import { Type } from 'class-transformer';

class ProductoOrdenUpdateDto {
  @IsOptional()
  @IsNumber()
  id?: number; // si viene, significa que ya existe en la orden

  @IsOptional()
  @IsNumber()
  productoId?: number; // si no viene id, entonces es un producto nuevo

  @IsNumber()
  cantidad: number;

  @IsOptional()
  @IsNumber()
  precio_tienda?: number;

  @IsOptional()
  @IsNumber()
  precio_senda?: number;

  @IsOptional()
  @IsNumber()
  estadoId?: number;
}

export class UpdateOrdenCompraDto {
  @IsOptional()
  @IsNumber()
  estadoId?: number;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProductoOrdenUpdateDto)
  productos?: ProductoOrdenUpdateDto[];
}
