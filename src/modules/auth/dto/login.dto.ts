// src/auth/dto/login.dto.ts
import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
export class LoginDto {
  @ApiProperty({ example: 'Contrato-001', description: 'Contrato o DNI'})
  @IsNotEmpty()
  @IsString()
  identificador: string;

  @ApiProperty({ example: '123456', description: 'Contraseña de acceso' })
  @IsNotEmpty()
  @IsString()
  password: string;
}