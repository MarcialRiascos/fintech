// src/modules/img-tiendas/dto/create-img-tienda.dto.ts
import { IsInt, IsString } from 'class-validator';

export class CreateImgTiendaDto {
  @IsInt()
  tiendaId: number;

  @IsString()
  url: string; // Si usas local: solo el nombre del archivo
}
