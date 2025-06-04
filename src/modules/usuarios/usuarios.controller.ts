// src/modules/usuarios/usuarios.controller.ts
import { Body, Controller, Post, Get, Param, Patch, Delete, HttpStatus, HttpException } from '@nestjs/common';
import { UsuariosService } from './usuarios.service';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { Usuario } from './entities/usuario.entity';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';

@Controller('usuarios')
export class UsuariosController {
  constructor(private readonly usuariosService: UsuariosService) {}

  @Get()
  async obtenerTodos(): Promise<Usuario[]> {
    return this.usuariosService.findAll();
  }

  @Get(':contrato')
  async obtenerPorContrato(@Param('contrato') contrato: string): Promise<Usuario> {
    return this.usuariosService.findByContrato(contrato);
  }

  @Post('registro')
  async crear(@Body() dto: CreateUsuarioDto): Promise<Usuario> {
    return this.usuariosService.create(dto);
  }

  @Patch(':contrato')
    async actualizarPorContrato(
      @Param('contrato') contrato: string,
      @Body() dto: UpdateUsuarioDto,
    ): Promise<Usuario> {
      return this.usuariosService.updateByContrato(contrato, dto);
  }

  @Delete(':contrato')
  async eliminarUsuario(@Param('contrato') contrato: string): Promise<{ message: string }> {
    const resultado = await this.usuariosService.eliminarPorContrato(contrato);
    if (!resultado) {
      throw new HttpException(`Usuario con contrato ${contrato} no encontrado`, HttpStatus.NOT_FOUND);
    }
    return { message: `Usuario con contrato ${contrato} eliminado correctamente` };
  }
}
