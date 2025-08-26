import { 
  IsString, 
  IsNumber, 
  IsInt, 
  IsPositive, 
  IsArray, 
  ValidateNested 
} from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateProductoDto {
  @IsString()
  nombre: string;

  @IsString()
  descripcion: string;

  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  precio_tienda: number;

  @IsInt()
  @IsPositive()
  stock: number;

  @IsInt()
  tiendas_id: number;

  @IsInt()
  estados_id: number;

  @IsInt()
  usuarios_id: number;
}
