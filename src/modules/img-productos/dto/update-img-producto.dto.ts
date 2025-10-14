import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsInt } from 'class-validator';

export class UpdateImgProductoDto {
  @ApiProperty({
    example: 12,
    description: 'ID del producto al que pertenece la imagen',
  })
  @IsString()
  url: string;

   @ApiProperty({
    example: 'imagen1.jpg',
    description:
      'Ruta o nombre del archivo de la imagen del producto. Si se usa almacenamiento local, solo el nombre del archivo; si es remoto, la URL completa.',
  })
  @IsInt()
  productos_id: number;
}
