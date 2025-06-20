// src/modules/auth/dto/reset-password.dto.ts
import { IsJWT, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ResetPasswordDto {
 @ApiProperty({ example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsImNvbnRyYXRvIjoiQ29udHJhdG8tMDAxIiwicm9sIjoiQWRtaW5pc3RyYWRvciIsImlhdCI6MTc1MDM5NzI5OSwiZXhwIjoxNzUwMzk4MTk5fQ.-jB8uG7pbMo_SxsFGgdc4kqVHMPW3vCrAxK23DtIhWA', description: 'JWT' })
  @IsJWT()
  token: string;

  @ApiProperty({ example: 'ad57xc6', description: 'Password' })
  @IsString()
  @MinLength(6)
  newPassword: string;
}
