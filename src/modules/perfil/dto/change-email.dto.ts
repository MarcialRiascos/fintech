// src/modules/usuarios/dto/change-email.dto.ts
import { IsEmail } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ChangeEmailDto {
  @ApiProperty({ example: 'nuevoemail@gmail.com', description: 'Nuevo correo electrónico' })
  @IsEmail()
  nuevoEmail: string;
}
