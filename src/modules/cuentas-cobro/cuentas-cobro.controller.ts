// src/modules/cuentas-cobro/cuentas-cobro.controller.ts
import {
  Controller,
  Post,
  Body,
  Get,
  UseGuards,
  Param,
  ParseIntPipe,
  Patch,
} from '@nestjs/common';
import { CuentasCobroService } from './cuentas-cobro.service';
import { CreateCuentaCobroDto } from './dto/create-cuenta-cobro.dto';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Role } from 'src/common/constants/roles.enum';
import { Roles } from 'src/common/decorators/roles.decorator';
import { User } from 'src/common/decorators/user.decorator';
import { UpdateEstadoCuentaDto } from './dto/update-estado-cuenta.dto';
import { ApiOperation } from '@nestjs/swagger';

@Controller('cuentas-cobro')
@UseGuards(JwtAuthGuard, RolesGuard)
export class CuentasCobroController {
  constructor(private readonly service: CuentasCobroService) {}

  @Roles(Role.REPRESENTANTE)
  @Post('generar')
  @ApiOperation({
    summary: 'Generar una nueva cuenta de cobro',
    description:
      'Crea una nueva cuenta de cobro para una tienda específica con base en sus órdenes de compra.',
  })
  async generar(@Body() dto: CreateCuentaCobroDto) {
    return await this.service.generarCuentaCobro(dto);
  }

  @Roles(Role.RECAUDADOR)
  @Get()
  @ApiOperation({
    summary: 'Listar todas las cuentas de cobro',
    description:
      'Obtiene un listado general de todas las cuentas de cobro registradas en el sistema.',
  })
  async findAll() {
    return await this.service.findAll();
  }

  @Roles(Role.REPRESENTANTE)
  @Get('mis-cuentas')
  @ApiOperation({
    summary: 'Obtener cuentas de cobro del representante autenticado',
    description:
      'Devuelve las cuentas de cobro correspondientes a las tiendas registradas bajo el representante autenticado.',
  })
  async obtenerCuentasDeUsuario(@User('userId') userId: number) {
    return await this.service.findByUsuario(userId);
  }

  @Roles(Role.REPRESENTANTE, Role.RECAUDADOR)
  @Get('tienda/:id')
  @ApiOperation({
    summary: 'Obtener cuentas de cobro por tienda',
    description:
      'Devuelve todas las cuentas de cobro asociadas a una tienda específica, según su ID.',
  })
  async findOrdenesByTienda(@Param('id') id: number) {
    return this.service.findOrdenesByTienda(+id);
  }

  @Roles(Role.RECAUDADOR)
  @Patch('estado/:id')
  @ApiOperation({
    summary: 'Actualizar el estado de una cuenta de cobro',
    description:
      'Permite modificar el estado actual de una cuenta de cobro específica.',
  })
  async updateEstado(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateEstadoCuentaDto,
  ) {
    return this.service.updateEstado(id, dto);
  }
}
