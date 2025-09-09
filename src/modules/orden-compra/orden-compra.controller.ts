import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import { OrdenCompraService } from './orden-compra.service';
import { CreateOrdenCompraDto } from './dto/create-orden-compra.dto';

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
