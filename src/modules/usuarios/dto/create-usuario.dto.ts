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
  @IsOptional()
  @IsString()
  @MaxLength(100)
  dni: string;

  @ApiProperty({ example: '1', description: 'Tipo de documento (FK)' })
  @IsOptional()
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

  @ApiProperty({ example: 'Belén', description: 'Barrio' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  barrio?: string;

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

  @ApiProperty({ example: 'Enero', description: 'Mes' })
  @IsOptional()
  @IsString()
  @MaxLength(45)
  mes?: string;

  @ApiProperty({ example: '2024-01-01', description: 'Fecha primera actividad' })
  @IsOptional()
  @IsString()
  @MaxLength(45)
  f_prim_act?: string;

  @ApiProperty({ example: '2024-02-01', description: 'Fecha último diagnóstico' })
  @IsOptional()
  @IsString()
  @MaxLength(45)
  f_ult_dx?: string;

  @ApiProperty({ example: '2024-03-01', description: 'Fecha último pago' })
  @IsOptional()
  @IsString()
  @MaxLength(45)
  f_ult_p?: string;

  @ApiProperty({ example: 'Pago 3', description: 'Último pago (valor/etiqueta)' })
  @IsOptional()
  @IsString()
  @MaxLength(45)
  ult_p?: string;

  @ApiProperty({ example: '500000', description: 'Saldo' })
  @IsOptional()
  @IsString()
  @MaxLength(45)
  saldo?: string;

  @ApiProperty({ example: '0', description: 'Mora' })
  @IsOptional()
  @IsString()
  @MaxLength(45)
  mora?: string;

  @ApiProperty({ example: true, description: 'Email verificado' })
  @IsOptional()
  emailVerificado?: boolean;

  @ApiProperty({ example: 1, description: 'Estado ID' })
  @IsNotEmpty()
  @IsNumber()
  estados_id: number;

  @ApiProperty({ example: 1, description: 'Sexo ID' })
  @IsOptional()
  @IsNumber()
  sexos_id: number;

  @ApiProperty({ example: 3, description: 'Rol ID' })
  @IsNotEmpty()
  @IsNumber()
  roles_id: number;
}
