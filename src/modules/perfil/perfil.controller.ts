import { Controller, Patch, UseGuards, Req, Body } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { PerfilService } from '../../modules/perfil/perfil.service';
import { UpdatePerfilDto  } from '../../modules/usuarios/dto/update-perfil.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';

@Controller('perfil')
@UseGuards(JwtAuthGuard)
export class PerfilController {
  constructor(private readonly perfilService: PerfilService) {}

   @Patch()
    async actualizarMiPerfil(
    @Req() req,
    @Body() dto: UpdatePerfilDto,
    ) {
    const contrato = req.user.contrato;
    const usuarioActualizado = await this.perfilService.actualizarPerfil(contrato, dto);

    return {
        message: 'Perfil actualizado correctamente',
        data: usuarioActualizado,
    };
    }

    @Patch('password')
async cambiarPassword(
  @Req() req,
  @Body() dto: UpdatePasswordDto
) {
  const userId = req.user.sub; // Asegúrate de que `sub` sea el ID en tu JWT
  return this.perfilService.cambiarPassword(userId, dto);
}
}
