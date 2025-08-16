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

  @ApiProperty({ example: 'El Poblado', description: 'Barrio' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  barrio?: string;

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

  @ApiProperty({ example: '1990-05-15', description: 'Fecha de nacimiento' })
  @IsOptional()
  @IsDateString()
  fecha_nacimiento?: Date;

  @ApiProperty({ example: 1, description: 'Sexo, valor de FK' })
  @IsOptional()
  @IsNumber()
  sexos_id?: number;
}
