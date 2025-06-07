// src/modules/usuarios/usuarios.controller.ts
import { Body, Controller, Post, Get, Param, Patch, Delete, HttpStatus, HttpException, NotFoundException } from '@nestjs/common';
import { UsuariosService } from './usuarios.service';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { Usuario } from './entities/usuario.entity';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { Roles } from 'src/common/decorators/roles.decorator';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { Role } from '../../common/constants/roles.enum';
import { ApiBearerAuth, ApiTags, ApiOperation, ApiParam, ApiBody } from '@nestjs/swagger';

@ApiBearerAuth()
@ApiTags('usuarios')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
@Controller('usuarios')
export class UsuariosController {
  constructor(private readonly usuariosService: UsuariosService) {}

  @Get()
  @ApiOperation({ summary: 'Obtener todos los usuarios' })
  async obtenerTodos(): Promise<{ message: string; data: Usuario[] }> {
  const usuarios = await this.usuariosService.findAll();
  return {
    message: 'Usuarios encontrados',
    data: usuarios,
  };
}

 @Get(':identificador')
  @ApiOperation({ summary: 'Obtener un usuario por contrato o dni' })
  async findOne(@Param('identificador') identificador: string): Promise<{ message: string; data: Usuario }> {
  const usuario = await this.usuariosService.findByContratoODni(identificador);
  return {
    message: 'Usuario encontrado',
    data: usuario,
  };
}

  @Post('registro')
  @ApiOperation({ summary: 'Registrar usuarios' })
  async crear(@Body() dto: CreateUsuarioDto): Promise<{ message: string; data: Usuario }> {
    const usuario = await this.usuariosService.create(dto);
    return {
      message: 'Registro exitoso',
      data: usuario,
    };
  }

  @Patch(':contrato')
  @ApiOperation({ summary: 'Actualizar un usuario por contrato' })
  @ApiParam({ name: 'contrato', description: 'Número de contrato' })
  @ApiBody({ type: UpdateUsuarioDto })
  async actualizarPorContrato(
    @Param('contrato') contrato: string,
    @Body() dto: UpdateUsuarioDto,
  ): Promise<{ message: string; data: Usuario }> {
    const usuarioActualizado = await this.usuariosService.updateByContrato(contrato, dto);

    return {
      message: 'Usuario actualizado correctamente',
      data: usuarioActualizado,
    };
  }

  @Delete(':contrato')
   @ApiOperation({ summary: 'Eliminar un usuario por contrato' })
  async eliminarUsuario(@Param('contrato') contrato: string): Promise<{ message: string }> {
    const resultado = await this.usuariosService.eliminarPorContrato(contrato);
    if (!resultado) {
      throw new HttpException(`Usuario con contrato ${contrato} no encontrado`, HttpStatus.NOT_FOUND);
    }
    return { message: `Usuario con contrato ${contrato} eliminado correctamente` };
  }
}
