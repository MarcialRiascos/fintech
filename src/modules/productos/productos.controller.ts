import { Controller, Post, Body, Get, Param, Req, UseGuards, ParseIntPipe } from '@nestjs/common';
import { ProductoService } from './productos.service';
import { CreateProductoDto } from './dto/create-producto.dto';
import { AuthGuard } from '@nestjs/passport';
import { JwtAuthGuard } from '../auth/jwt.guard';

@UseGuards(JwtAuthGuard)
@Controller('productos')
export class ProductoController {
  constructor(private readonly productoService: ProductoService) {}

  @Post()
  create(@Body() dto: CreateProductoDto, @Req() req) {
    const usuarioId = req.user.id; // ← este viene del JWT
    return this.productoService.create(dto, usuarioId);
  }

  @Get()
  findAll() {
    return this.productoService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.productoService.findOne(id);
  }
}
