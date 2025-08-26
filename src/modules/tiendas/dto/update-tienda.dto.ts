import { IsString, IsInt, IsNumber, Length, IsOptional } from 'class-validator';

export class UpdateTiendaDto {
  @IsString()
  @Length(1, 100)
  nombre: string;

  @IsString()
  @Length(1, 100)
  descripcion: string;

  @IsString()
  @Length(1, 45)
  nit: string;

  @IsInt()
  dv: number;

  @IsString()
  @Length(1, 45)
  barrio: string;

  @IsString()
  @Length(1, 100)
  direccion: string;

  @IsString()
  @Length(1, 20)
  telefono_uno: string;

  @IsNumber()
  porcentaje: number;

  @IsInt()
  estados_id: number;

  @IsInt()
  usuarios_id: number; // Representante
}
