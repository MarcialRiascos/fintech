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

@UseGuards(JwtAuthGuard, RolesGuard)

@Controller('orden-compra')
export class OrdenCompraController {
  constructor(private readonly ordenCompraService: OrdenCompraService) {}

  /**
   * Crear nueva orden de compra con productos
   */
  @Roles(Role.CLIENTE)
  @Post()
  async create(@Body() dto: CreateOrdenCompraDto) {
    return this.ordenCompraService.create(dto);
  }

  /**
   * Obtener todas las órdenes de compra
   */
  @Get()
  async findAll() {
    return this.ordenCompraService.findAll();
  }

  @Get('mis-ordenes')
  async consultarMisOrdenes(@User() user: any) {
    const usuarioId = user.userId; // ✅ este es el id de usuario
    const rolId = user.rol;

    if (!rolId) {
      throw new BadRequestException('El rol del usuario no está definido');
    }

    const ordenes = await this.ordenCompraService.consultarOrdenesPorRol(
    usuarioId,
    rolId,
  );

  return {
    message: 'Órdenes consultadas exitosamente',
    data: ordenes,
  };
  }

  /**
   * Obtener una orden de compra por ID
   */
  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.ordenCompraService.findOne(id);
  }

  
  @Patch(':id')
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
