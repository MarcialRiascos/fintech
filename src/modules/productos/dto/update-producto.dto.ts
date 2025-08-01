import { IsString, IsNumber, IsInt, IsPositive, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class ImagenDto {
  @IsString()
  url: string;
}

export class UpdateProductoDto  {
  @IsString()
  nombre: string;

  @IsString()
  descripcion: string;

  @IsNumber()
  @IsPositive()
  precio: number;

  @IsInt()
  stock: number;

  @IsInt()
  tiendas_id: number;

  @IsInt()
  estados_id: number;

  @IsInt()
  usuarios_id: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ImagenDto)
  imagenes: ImagenDto[];
}
