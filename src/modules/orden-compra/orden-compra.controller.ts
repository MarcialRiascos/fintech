import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  ParseIntPipe,
  BadRequestException,
  UseGuards,
  Patch,
} from '@nestjs/common';
import { OrdenCompraService } from './orden-compra.service';
import { CreateOrdenCompraDto } from './dto/create-orden-compra.dto';
import { User } from 'src/common/decorators/user.decorator';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { UpdateOrdenCompraDto } from './dto/update-orden-compra.dto';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Role } from 'src/common/constants/roles.enum';
import { Roles } from 'src/common/decorators/roles.decorator';
import { ApiOperation } from '@nestjs/swagger';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('orden-compra')
export class OrdenCompraController {
  constructor(private readonly ordenCompraService: OrdenCompraService) {}

  /**
   * Crear nueva orden de compra con productos
   */
  @Roles(Role.CLIENTE)
  @Post()
  @ApiOperation({
    summary: 'Crear una nueva orden de compra',
    description:
      'Permite al cliente crear una nueva orden de compra con sus productos asociados.',
  })
  async create(@Body() dto: CreateOrdenCompraDto) {
    return this.ordenCompraService.create(dto);
  }

  /**
   * Obtener todas las órdenes de compra
   */
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @Get()
  @ApiOperation({
    summary: 'Listar todas las órdenes de compra',
    description:
      'Devuelve todas las órdenes de compra registradas en el sistema (solo para roles con permiso).',
  })
  async findAll() {
    return this.ordenCompraService.findAll();
  }

  @Roles(Role.CLIENTE, Role.REPRESENTANTE)
  @Get('mis-ordenes')
  @ApiOperation({
    summary: 'Consultar mis órdenes de compra',
    description:
      'Permite al usuario autenticado obtener sus órdenes de compra según su rol (cliente o representante de tienda).',
  })
  async consultarMisOrdenes(@User() user: any) {
  const usuarioId = user.userId;
  const rolId = user.rol;

  if (!rolId) {
    throw new BadRequestException('El rol del usuario no está definido');
  }

  // 👇 retornas directamente lo que el servicio devuelva
  return this.ordenCompraService.consultarOrdenesPorRol(usuarioId, rolId);
}


  /**
   * Obtener una orden de compra por ID
   */
  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  @Get(':id')
  @ApiOperation({
    summary: 'Obtener una orden de compra por ID',
    description: 'Devuelve los detalles completos de una orden específica.',
  })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.ordenCompraService.findOne(id);
  }

  @Roles(Role.CLIENTE, Role.REPRESENTANTE)
  @Patch(':id')
  @ApiOperation({
    summary: 'Actualizar una orden de compra',
    description: 'Permite modificar los datos de una orden existente.',
  })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateOrdenCompraDto,
  ) {
    return this.ordenCompraService.update(id, dto);
  }

  /**
   * Eliminar una orden de compra por ID
   */
  /*  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    return this.ordenCompraService.remove(id);
  } */
}
