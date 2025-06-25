// src/modules/usuarios/dto/create-usuario.dto.ts
import { IsEmail, IsNotEmpty, IsOptional, IsString, IsNumber, IsDateString, MinLength, MaxLength, } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUsuarioDto {

  @ApiProperty({ example: 'Contrato-001', description: 'Número de contrato' })
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  contrato: string;
  
  @ApiProperty({ example: '123456', description: 'Contraseña de acceso' })
  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  @MaxLength(100)
  password: string;

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

  @ApiProperty({ example: '1', description: 'Tipo de dni, lleva el valor de FK' })
  @IsNotEmpty()
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

  @ApiProperty({ example: '05', description: 'Codigo del departamento' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  codigo_departamento?: string;

  @ApiProperty({ example: 'Antioquia', description: 'Nombre del departamento' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  departamento?: string;

  @ApiProperty({ example: '0550', description: 'Codigo del municipio' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  codigo_municipio?: string;

  @ApiProperty({ example: 'Abejorral', description: 'Nombre del municipio' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  municipio?: string;

  @ApiProperty({ example: 'CL', description: 'Referencia de via principal' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  via_principal_clave?: string;

  @ApiProperty({ example: '50', description: 'Referencia de via principal valor' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  via_principal_valor?: string;

  @ApiProperty({ example: 'CR', description: 'Referencia de via secundaria' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  via_secundaria_clave?: string;

  @ApiProperty({ example: '30', description: 'Referencia de via secundaria valor' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  via_secundaria_valor?: string;

  @ApiProperty({ example: 'AP', description: 'Tipo de unidad uno clave' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  tipo_unidad_uno_clave?: string;

  
  @ApiProperty({ example: '302', description: 'Tipo de unidad uno valor' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  tipo_unidad_uno_valor?: string;

  @ApiProperty({ example: 'ET', description: 'Tipo de unidad dos clave' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  tipo_unidad_dos_clave?: string;

  @ApiProperty({ example: '1', description: 'Tipo de unidad dos valor' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  tipo_unidad_dos_valor?: string;

  @ApiProperty({ example: 'El Poblado', description: 'Nombre del barrio' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  barrio?: string;

  @ApiProperty({ example: '6.2442', description: 'Latitud geografica' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  latitud?: string;

  @ApiProperty({ example: '-75.5812', description: 'Longitud geografica' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  longitud?: string;

  @ApiProperty({ example: 'Cra 30 #50-302', description: 'Dirección' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  direccion?: string;

  @ApiProperty({ example: '3001234567', description: 'Telefono principal' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  telefono_uno?: string;

  @ApiProperty({ example: '3001234567', description: 'Telefono respaldo' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  telefono_dos?: string;

  @ApiProperty({ example: '3001234567', description: 'Telefono respaldo dos' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  Telefono_tres?: string;

  @ApiProperty({ example: 'juan.perez@example.com', description: 'Correo electronico' })
  @IsNotEmpty()
  @IsEmail()
  @MaxLength(100)
  email?: string;

  @ApiProperty({ example: '1990-05-15', description: 'Fecha de nacimiento' })
  @IsOptional()
  @IsDateString()
  fecha_nacimiento?: Date;

  @ApiProperty({ example: '1990-05-15', description: 'Información adicional' })
  @IsOptional()
  @IsString()
  anexo?: string;

  @ApiProperty({ example: '1', description: 'Estado, lleva el valor de FK' })
  @IsNotEmpty()
  @IsNumber()
  estados_id?: number;

  @ApiProperty({ example: '1', description: 'Sexo, lleva el valor de FK' })
  @IsNotEmpty()
  @IsNumber()
  sexos_id?: number;

  @ApiProperty({ example: '1', description: 'Estrato, lleva el valor de FK' })
  @IsNotEmpty()
  @IsNumber()
  estratos_id?: number;

  @ApiProperty({ example: '1', description: 'Role, lleva el valor de FK' })
  @IsNotEmpty()
  @IsNumber()
  roles_id?: number;
}
