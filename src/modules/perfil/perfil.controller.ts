import {
  Controller,
  Patch,
  UseGuards,
  Req,
  Body,
  Get,
  Post,
  Query,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { PerfilService } from '../../modules/perfil/perfil.service';
import { UpdatePerfilDto } from './dto/update-perfil.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBearerAuth,
  ApiTags,
  ApiOperation,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
import { User } from 'src/common/decorators/user.decorator';
import { Usuario } from '../usuarios/entities/usuario.entity';
import { ChangeEmailDto } from './dto/change-email.dto';

@Controller('perfil')
export class PerfilController {
  constructor(private readonly perfilService: PerfilService) {}

  @UseGuards(JwtAuthGuard)
  @Patch()
  @ApiOperation({ summary: 'Actualizar o modificar perfil' })
  async actualizarMiPerfil(@Req() req, @Body() dto: UpdatePerfilDto) {
    const contrato = req.user.contrato;
    const usuarioActualizado = await this.perfilService.actualizarPerfil(
      contrato,
      dto,
    );

    return {
      message: 'Perfil actualizado correctamente',
      data: usuarioActualizado,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async obtenerMiPerfil(@User() usuario: Usuario) {
    return this.perfilService.obtenerPerfilPorId(usuario.id);
  }

  @Patch('password')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Cambiar contraseña' })
  async cambiarPassword(@Req() req, @Body() dto: UpdatePasswordDto) {
    const userId = req.user.userId;
    console.log('Usuario autenticado:', userId);
    return this.perfilService.cambiarPassword(userId, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Post('cambiar-email')
  async cambiarEmail(@User() usuario: Usuario, @Body() dto: ChangeEmailDto) {
    return this.perfilService.solicitarCambioEmail(usuario, dto.nuevoEmail);
  }

  @Get('verificar-email')
  async verificarEmail(@Query('token') token: string) {
    return this.perfilService.confirmarCambioEmail(token);
  }
}
