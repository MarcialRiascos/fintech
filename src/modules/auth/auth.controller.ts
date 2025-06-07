// src/auth/auth.controller.ts
import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @ApiOperation({ summary: 'Login con contrato o dni y contraseña' })
  @ApiResponse({ status: 200, description: 'Login exitoso' })
  async login(@Body() loginDto: LoginDto) {
  const usuario = await this.authService.validateUser(loginDto.identificador, loginDto.password);
  return this.authService.login(usuario);
  }
}
