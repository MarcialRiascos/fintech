import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  ParseIntPipe,
  BadRequestException,
  UseGuards
} from '@nestjs/common';
import { OrdenCompraService } from './orden-compra.service';
import { CreateOrdenCompraDto } from './dto/create-orden-compra.dto';
import { User } from 'src/common/decorators/user.decorator';
import { JwtAuthGuard } from '../auth/jwt.guard';

@Controller('orden-compra')
export class OrdenCompraController {
  constructor(private readonly ordenCompraService: OrdenCompraService) {}

  /**
   * Crear nueva orden de compra con productos
   */
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

  @UseGuards(JwtAuthGuard)
  @Get('mis-ordenes')
  async consultarMisOrdenes(@User() user: any) {
      console.log('🟢 Usuario JWT:', user);
     const usuarioId = user.userId;       // ✅ este es el id de usuario
      const rolId = user.rol;   

    if (!rolId) {
      throw new BadRequestException('El rol del usuario no está definido');
    }

    return this.ordenCompraService.consultarOrdenesPorRol(usuarioId, rolId);
  }

  /**
   * Obtener una orden de compra por ID
   */
  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.ordenCompraService.findOne(id);
  }

  

  /**
   * Eliminar una orden de compra por ID
   */
  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    return this.ordenCompraService.remove(id);
  }
}
