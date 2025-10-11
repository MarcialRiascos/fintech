// src/modules/img-tiendas/dto/create-img-tienda.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsString } from 'class-validator';

export class CreateImgTiendaDto {
  @ApiProperty({
    example: 12,
    description: 'ID de la tienda a la que pertenece la imagen.',
  })
  @IsInt()
  tiendaId: number;

   @ApiProperty({
    example: 'uploads/tiendas/imagen123.jpg',
    description:
      'URL o nombre del archivo de la imagen. Si se usa almacenamiento local, solo se guarda el nombre del archivo.',
  })
  @IsString()
  url: string; // Si usas local: solo el nombre del archivo
}
