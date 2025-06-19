import { IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdatePasswordDto {

  @ApiProperty({ example: '1a23bc56', description: 'Contraseña actual' })
  @IsString()
  currentPassword: string;

  @ApiProperty({ example: '1a23bc56', description: 'Nueva contraseña' })
  @IsString()
  @MinLength(6)
  newPassword: string;
}
