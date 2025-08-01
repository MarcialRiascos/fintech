import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { ImgProductoService } from './img-productos.service';
import { CreateImgProductoDto } from './dto/create-img-producto.dto';

@Controller('img-productos')
export class ImgProductoController {
  constructor(private readonly imgService: ImgProductoService) {}

  @Post()
  create(@Body() data: CreateImgProductoDto) {
    return this.imgService.create(data);
  }

  @Get()
  findAll() {
    return this.imgService.findAll();
  }

  @Get('producto/:productos_id')
  findByProducto(@Param('productos_id') productos_id: number) {
    return this.imgService.findByProducto(+productos_id);
  }
}
