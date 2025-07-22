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
  @ApiProperty({ example: 'Contrato-001', description: 'Número de contrato' })
  @ValidateIf(o => o.roles_id === 3) // Solo si es Cliente
  @IsNotEmpty({ message: 'El contrato es obligatorio para clientes' })
  @IsString()
  @MaxLength(100)
  contrato: string;

  @ApiProperty({ example: '123456', description: 'Contraseña de acceso' })
  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  @MaxLength(100)
  password: string;

  @ApiProperty({ example: 'Carlos Andres', description: 'Nombre(s)' })
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  nombre: string;

  @ApiProperty({ example: 'Rosales Ramirez', description: 'Apellido(s)' })
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  apellido: string;

  @ApiProperty({ example: '1', description: 'Tipo de documento (FK)' })
  @IsNotEmpty()
  @IsNumber()
  dni_tipos_id: number;

  @ApiProperty({ example: '1234567890', description: 'DNI' })
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  dni: string;

  @ApiProperty({ example: 'juan.perez@example.com', description: 'Correo' })
  @IsNotEmpty()
  @IsEmail()
  @MaxLength(100)
  email: string;

  @ApiProperty({ example: 'Cra 30 #50-302', description: 'Dirección' })
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  direccion: string;

  @ApiProperty({ example: '1990-05-15', description: 'Fecha de nacimiento' })
  @IsNotEmpty()
  @IsDateString()
  fecha_nacimiento: Date;

  @ApiProperty({ example: '1', description: 'Estado (FK)' })
  @IsNotEmpty()
  @IsNumber()
  estados_id: number;

  @ApiProperty({ example: '1', description: 'Sexo (FK)' })
  @IsNotEmpty()
  @IsNumber()
  sexos_id: number;

  @ApiProperty({ example: '1', description: 'Estrato (FK)' })
  @IsNotEmpty()
  @IsNumber()
  estratos_id: number;

  @ApiProperty({ example: '3', description: 'Rol (FK)' })
  @IsNotEmpty()
  @IsNumber()
  roles_id: number;

  @ApiProperty({ example: 'M', description: 'Género', required: false })
  @IsOptional()
  @IsString()
  genero?: string;

  // Puedes mantener los demás campos opcionales si gustas
}
