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
  ValidateIf,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUsuarioDto {
  @ApiProperty({ example: 'Carlos', description: 'Nombre(s)' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  nombre?: string;

  @ApiProperty({ example: 'Ramírez', description: 'Apellido(s)' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  apellido?: string;

  @ApiProperty({ example: '1234567890', description: 'DNI' })
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  dni: string;

  @ApiProperty({ example: '1', description: 'Tipo de documento (FK)' })
  @IsNotEmpty()
  @IsNumber()
  dni_tipos_id: number;

  @ApiProperty({ example: 'Contrato-001', description: 'Número de contrato' })
  @ValidateIf(o => o.roles_id === 3)
  @IsNotEmpty({ message: 'El contrato es obligatorio para clientes' })
  @IsString()
  @MaxLength(100)
  contrato?: string;

  @ApiProperty({ example: 'COLOMBIANA', description: 'Nacionalidad' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  nacionalidad?: string;

  @ApiProperty({ example: '05', description: 'Código de departamento' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  codigo_departamento?: string;

  @ApiProperty({ example: 'Antioquia', description: 'Departamento' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  departamento?: string;

  @ApiProperty({ example: '05001', description: 'Código municipio' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  codigo_municipio?: string;

  @ApiProperty({ example: 'Medellín', description: 'Municipio' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  municipio?: string;

  @ApiProperty({ example: 'CL', description: 'Vía principal clave' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  via_principal_clave?: string;

  @ApiProperty({ example: '30', description: 'Vía principal valor' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  via_principal_valor?: string;

  @ApiProperty({ example: 'KR', description: 'Vía secundaria clave' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  via_secundaria_clave?: string;

  @ApiProperty({ example: '50', description: 'Vía secundaria valor' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  via_secundaria_valor?: string;

  @ApiProperty({ example: 'APT', description: 'Tipo unidad uno clave' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  tipo_unidad_uno_clave?: string;

  @ApiProperty({ example: '101', description: 'Tipo unidad uno valor' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  tipo_unidad_uno_valor?: string;

  @ApiProperty({ example: 'BL', description: 'Tipo unidad dos clave' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  tipo_unidad_dos_clave?: string;

  @ApiProperty({ example: '5', description: 'Tipo unidad dos valor' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  tipo_unidad_dos_valor?: string;

  @ApiProperty({ example: 'Belén', description: 'Barrio' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  barrio?: string;

  @ApiProperty({ example: '6.25184', description: 'Latitud' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  latitud?: string;

  @ApiProperty({ example: '-75.56359', description: 'Longitud' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  longitud?: string;

  @ApiProperty({ example: 'Cra 30 #50-302', description: 'Dirección' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  direccion?: string;

  @ApiProperty({ example: '3001234567', description: 'Teléfono 1' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  telefono_uno?: string;

  @ApiProperty({ example: '3109876543', description: 'Teléfono 2' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  telefono_dos?: string;

  @ApiProperty({ example: '3201122334', description: 'Teléfono 3' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  telefono_tres?: string;

  @ApiProperty({ example: '123456', description: 'Contraseña de acceso' })
  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  @MaxLength(100)
  password: string;

  @ApiProperty({ example: 'juan.perez@example.com', description: 'Correo' })
  @IsOptional()
  @IsEmail()
  @MaxLength(100)
  email: string;

  @ApiProperty({ example: '1990-05-15', description: 'Fecha de nacimiento' })
  @IsOptional()
  @IsDateString()
  fecha_nacimiento?: Date;

  @ApiProperty({ example: 'Anexo extra', description: 'Anexo' })
  @IsOptional()
  @IsString()
  anexo?: string;

  @ApiProperty({ example: true, description: 'Email verificado' })
  @IsOptional()
  emailVerificado?: boolean;

  @ApiProperty({ example: 'token_reset_password', description: 'Token de recuperación' })
  @IsOptional()
  @IsString()
  resetPasswordToken?: string;

  @ApiProperty({ example: '2024-12-31T23:59:59Z', description: 'Expiración del token' })
  @IsOptional()
  @IsDateString()
  resetPasswordExpires?: Date;

  @ApiProperty({ example: 1, description: 'Estado ID' })
  @IsNotEmpty()
  @IsNumber()
  estados_id: number;

  @ApiProperty({ example: 1, description: 'Sexo ID' })
  @IsNotEmpty()
  @IsNumber()
  sexos_id: number;

  @ApiProperty({ example: 1, description: 'Estrato ID' })
  @IsNotEmpty()
  @IsNumber()
  estratos_id: number;

  @ApiProperty({ example: 3, description: 'Rol ID' })
  @IsNotEmpty()
  @IsNumber()
  roles_id: number;
}
