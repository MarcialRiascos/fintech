// src/modules/img-productos/dto/create-img-producto.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsString } from 'class-validator';

export class CreateImgProductoDto {
   @ApiProperty({
    example: 12,
    description: 'ID del producto al que pertenece la imagen',
  })
  @IsInt()
  productoId: number;

   @ApiProperty({
    example: 'imagen1.jpg',
    description:
      'Ruta o nombre del archivo de la imagen del producto. Si se usa almacenamiento local, solo el nombre del archivo; si es remoto, la URL completa.',
  })
  @IsString()
  url: string;
}
