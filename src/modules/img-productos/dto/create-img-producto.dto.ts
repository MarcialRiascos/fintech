// src/modules/img-productos/dto/create-img-producto.dto.ts
import { IsInt, IsString } from 'class-validator';

export class CreateImgProductoDto {
  @IsInt()
  productoId: number;

  @IsString()
  url: string;
}
