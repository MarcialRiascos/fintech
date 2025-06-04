// src/modules/usuarios/dto/create-usuario.dto.ts
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsNumber,
  IsDateString,
  MinLength,
  MaxLength,
} from 'class-validator';

export class CreateUsuarioDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  contrato: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  @MaxLength(100)
  password: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  nombre?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  apellido?: string;

  @IsNotEmpty()
  @IsNumber()
  dni_tipos_id?: number;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  dni?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  nacionalidad?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  codigo_departamento?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  departamento?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  codigo_municipio?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  municipio?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  via_principal_clave?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  via_principal_valor?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  via_secundaria_clave?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  via_secundaria_valor?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  tipo_unidad_uno_clave?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  tipo_unidad_uno_valor?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  tipo_unidad_dos_clave?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  tipo_unidad_dos_valor?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  barrio?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  latitud?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  longitud?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  direccion?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  telefono_uno?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  telefono_dos?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  Telefono_tres?: string;

  @IsOptional()
  @IsEmail()
  @MaxLength(100)
  email?: string;

  @IsOptional()
  @IsDateString()
  fecha_nacimiento?: Date;

  @IsOptional()
  @IsString()
  anexo?: string;

  @IsNotEmpty()
  @IsNumber()
  estados_id?: number;

  @IsNotEmpty()
  @IsNumber()
  sexos_id?: number;

  @IsNotEmpty()
  @IsNumber()
  estratos_id?: number;

  @IsNotEmpty()
  @IsNumber()
  roles_id?: number;
}
