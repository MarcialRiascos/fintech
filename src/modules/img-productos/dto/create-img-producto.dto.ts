import { IsString, IsInt } from 'class-validator';

export class CreateImgProductoDto {
  @IsString()
  url: string;

  @IsInt()
  productos_id: number;
}
