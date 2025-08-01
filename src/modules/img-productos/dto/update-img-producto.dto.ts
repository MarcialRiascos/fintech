import { IsString, IsInt } from 'class-validator';

export class UpdateImgProductoDto {
  @IsString()
  url: string;

  @IsInt()
  productos_id: number;
}
