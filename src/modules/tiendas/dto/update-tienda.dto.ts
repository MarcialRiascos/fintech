import { IsString, IsInt, Length, IsOptional } from 'class-validator';

export class UpdateTiendaDto {
  @IsOptional()
  @IsString()
  @Length(1, 100)
  nombre: string;

  @IsOptional()
  @IsString()
  @Length(1, 100)
  descripcion: string;

  @IsOptional()
  @IsString()
  @Length(1, 45)
  nit: string;

  @IsOptional()
  @IsInt()
  dv: number;

  @IsOptional()
  @IsString()
  nacionalidad: string;

  @IsOptional()
  @IsString()
  codigo_departamento: string;

  @IsOptional()
  @IsString()
  departamento: string;

  @IsOptional()
  @IsString()
  codigo_municipio: string;

  @IsOptional()
  @IsString()
  municipio: string;

  @IsOptional()
  @IsString()
  via_principal_clave: string;

  @IsOptional()
  @IsString()
  via_principal_valor: string;

  @IsOptional()
  @IsString()
  via_secundaria_clave: string;

  @IsOptional()
  @IsString()
  via_secundaria_valor: string;

  @IsOptional()
  @IsString()
  tipo_unidad_uno_clave: string;

  @IsOptional()
  @IsString()
  tipo_unidad_uno_valor: string;

  @IsOptional()
  @IsString()
  tipo_unidad_dos_clave: string;

  @IsOptional()
  @IsString()
  tipo_unidad_dos_valor: string;

  @IsOptional()
  @IsString()
  barrio: string;

  @IsOptional()
  @IsString()
  latitud: string;

  @IsOptional()
  @IsString()
  longitud: string;

  @IsOptional()
  @IsString()
  direccion: string;

  @IsOptional()
  @IsString()
  telefono_uno: string;

  @IsOptional()
  @IsString()
  telefono_dos: string;

  @IsOptional()
  @IsString()
  telefono_tres: string;

  @IsOptional()
  @IsInt()
  estados_id: number;

  @IsOptional()
  @IsInt()
  usuarios_id: number;
}
