import { IsString, IsInt, Length } from 'class-validator';

export class CreateTiendaDto {
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
  nacionalidad: string;

  @IsString()
  codigo_departamento: string;

  @IsString()
  departamento: string;

  @IsString()
  codigo_municipio: string;

  @IsString()
  municipio: string;

  @IsString()
  via_principal_clave: string;

  @IsString()
  via_principal_valor: string;

  @IsString()
  via_secundaria_clave: string;

  @IsString()
  via_secundaria_valor: string;

  @IsString()
  tipo_unidad_uno_clave: string;

  @IsString()
  tipo_unidad_uno_valor: string;

  @IsString()
  tipo_unidad_dos_clave: string;

  @IsString()
  tipo_unidad_dos_valor: string;

  @IsString()
  barrio: string;

  @IsString()
  latitud: string;

  @IsString()
  longitud: string;

  @IsString()
  direccion: string;

  @IsString()
  telefono_uno: string;

  @IsString()
  telefono_dos: string;

  @IsString()
  telefono_tres: string;

  @IsInt()
  estados_id: number;

  @IsInt()
  usuarios_id: number; // Representante
}
