// src/auth/auth.controller.ts
import {
  Controller,
  Post,
  Get,
  Body,
  Query,
  HttpStatus,
  HttpCode,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Repository } from 'typeorm';
import { Usuario } from '../usuarios/entities/usuario.entity';
import { InjectRepository } from '@nestjs/typeorm';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    @InjectRepository(Usuario)
    private readonly usuarioRepo: Repository<Usuario>,
  ) {}

  @Post('login')
  @ApiOperation({ summary: 'Login con contrato o dni y contraseña' })
  @ApiResponse({ status: 200, description: 'Login exitoso' })
  async login(@Body() loginDto: LoginDto) {
    const usuario = await this.authService.validateUser(
      loginDto.identificador,
      loginDto.password,
    );
    return this.authService.login(usuario);
  }

 @Get('verify-email')
async verifyEmail(@Query('token') token: string) {
  try {
    const payload = this.jwtService.verify(token, {
      secret: this.configService.get('JWT_VERIFICATION_SECRET'),
    });

    const usuario = await this.usuarioRepo.findOne({
      where: { id: payload.sub },
    });

    if (!usuario) {
      throw new NotFoundException('Usuario no encontrado');
    }

    usuario.emailVerificado = true;
    await this.usuarioRepo.save(usuario);

    return { message: 'Correo verificado correctamente' };
  } catch (err) {
    throw new BadRequestException('Token inválido o expirado');
  }
}


  @Post('forgot-password')
  @ApiOperation({ summary: 'Enviar correo de resetear contraseña' })
  @HttpCode(HttpStatus.OK)
  async forgotPassword(@Body() dto: ForgotPasswordDto) {
    await this.authService.forgotPassword(dto.email);
    return {
      message:
        '📧 Si el correo existe, se ha enviado un enlace de recuperación',
    };
  }

  @Post('reset-password')
  @ApiOperation({ summary: 'Resetear contraseña' })
  @HttpCode(HttpStatus.OK)
  async resetPassword(@Body() dto: ResetPasswordDto) {
    await this.authService.resetPassword(dto.token, dto.newPassword);
    return { message: '🔒 Contraseña actualizada correctamente' };
  }
}
