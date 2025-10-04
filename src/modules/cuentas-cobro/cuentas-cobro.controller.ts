// src/modules/cuentas-cobro/cuentas-cobro.controller.ts
import { Controller, Post, Body, Get, UseGuards, Param, ParseIntPipe, Patch } from '@nestjs/common';
import { CuentasCobroService } from './cuentas-cobro.service';
import { CreateCuentaCobroDto } from './dto/create-cuenta-cobro.dto';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Role } from 'src/common/constants/roles.enum';
import { Roles } from 'src/common/decorators/roles.decorator';
import { User } from 'src/common/decorators/user.decorator';
import { UpdateEstadoCuentaDto } from './dto/update-estado-cuenta.dto';

@Controller('cuentas-cobro')
@UseGuards(JwtAuthGuard, RolesGuard)
export class CuentasCobroController {
  constructor(private readonly service: CuentasCobroService) {}

  @Roles(Role.REPRESENTANTE)
  @Post('generar')
  async generar(@Body() dto: CreateCuentaCobroDto) {
    return await this.service.generarCuentaCobro(dto);
  }

  @Roles(Role.REPRESENTANTE, Role.RECAUDADOR)
  @Get()
  async findAll() {
    return await this.service.findAll();
  }

  @Roles(Role.REPRESENTANTE)
  @Get('mis-cuentas')
  async obtenerCuentasDeUsuario(@User('userId') userId: number) {
    return await this.service.findByUsuario(userId);
  }

  @Roles(Role.RECAUDADOR)
  @Get('tienda/:id')
  async findOrdenesByTienda(@Param('id') id: number) {
  return this.service.findOrdenesByTienda(+id);
}

@Roles(Role.RECAUDADOR)
 @Patch('estado/:id')
  async updateEstado(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateEstadoCuentaDto,
  ) {
    return this.service.updateEstado(id, dto);
  }
}
