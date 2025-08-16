// src/modules/auth/dto/forgot-password.dto.ts
import { IsEmail } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class verifyEmailDto {
  @ApiProperty({ example: 'example@exmaple.com', description: 'Correo' })
  @IsEmail()
  email: string;
}
