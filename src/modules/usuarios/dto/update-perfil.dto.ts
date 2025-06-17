// src/modules/usuarios/dto/update-perfil.dto.ts
import { IsEmail, IsOptional, IsString, IsNumber, IsDateString, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdatePerfilDto {
  @ApiProperty({ example: 'Carlos Andres', description: 'Nombre(s) del usuario' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  nombre?: string;

  @ApiProperty({ example: 'Rosales Ramirez', description: 'Apellido(s) del usuario' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  apellido?: string;

  @ApiProperty({ example: 1, description: 'Tipo de dni, lleva el valor de FK' })
  @IsOptional()
  @IsNumber()
  dni_tipos_id?: number;

  @ApiProperty({ example: '1234567890', description: 'DNI' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  dni?: string;

  @ApiProperty({ example: 'Colombiana', description: 'Nacionalidad del usuario' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  nacionalidad?: string;

  @ApiProperty({ example: '05', description: 'Código del departamento' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  codigo_departamento?: string;

  @ApiProperty({ example: 'Antioquia', description: 'Nombre del departamento' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  departamento?: string;

  @ApiProperty({ example: '0550', description: 'Código del municipio' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  codigo_municipio?: string;

  @ApiProperty({ example: 'Abejorral', description: 'Nombre del municipio' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  municipio?: string;

  @ApiProperty({ example: 'CL', description: 'Referencia de vía principal' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  via_principal_clave?: string;

  @ApiProperty({ example: '50', description: 'Valor vía principal' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  via_principal_valor?: string;

  @ApiProperty({ example: 'CR', description: 'Referencia de vía secundaria' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  via_secundaria_clave?: string;

  @ApiProperty({ example: '30', description: 'Valor vía secundaria' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  via_secundaria_valor?: string;

  @ApiProperty({ example: 'AP', description: 'Tipo unidad uno clave' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  tipo_unidad_uno_clave?: string;

  @ApiProperty({ example: '302', description: 'Valor unidad uno' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  tipo_unidad_uno_valor?: string;

  @ApiProperty({ example: 'ET', description: 'Tipo unidad dos clave' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  tipo_unidad_dos_clave?: string;

  @ApiProperty({ example: '1', description: 'Valor unidad dos' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  tipo_unidad_dos_valor?: string;

  @ApiProperty({ example: 'El Poblado', description: 'Barrio' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  barrio?: string;

  @ApiProperty({ example: '6.2442', description: 'Latitud geográfica' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  latitud?: string;

  @ApiProperty({ example: '-75.5812', description: 'Longitud geográfica' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  longitud?: string;

  @ApiProperty({ example: 'Cra 30 #50-302', description: 'Dirección' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  direccion?: string;

  @ApiProperty({ example: '3001234567', description: 'Teléfono principal' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  telefono_uno?: string;

  @ApiProperty({ example: '3009876543', description: 'Teléfono respaldo' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  telefono_dos?: string;

  @ApiProperty({ example: '3011122233', description: 'Teléfono respaldo dos' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  telefono_tres?: string;

  @ApiProperty({ example: 'juan.perez@example.com', description: 'Correo electrónico' })
  @IsOptional()
  @IsEmail()
  @MaxLength(100)
  email?: string;

  @ApiProperty({ example: '1990-05-15', description: 'Fecha de nacimiento' })
  @IsOptional()
  @IsDateString()
  fecha_nacimiento?: Date;

  @ApiProperty({ example: 'Información adicional', description: 'Anexo' })
  @IsOptional()
  @IsString()
  anexo?: string;

  @ApiProperty({ example: 1, description: 'Sexo, valor de FK' })
  @IsOptional()
  @IsNumber()
  sexos_id?: number;

  @ApiProperty({ example: 1, description: 'Estrato, valor de FK' })
  @IsOptional()
  @IsNumber()
  estratos_id?: number;

}
