import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ImgProductoService } from './img-productos.service';
import { ImgProductoController } from './img-productos.controller';
import { ImgProducto } from './entities/img-producto.entity';
import { Producto } from '../productos/entities/producto.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([ImgProducto, Producto]),
  ],
  controllers: [ImgProductoController],
  providers: [ImgProductoService],
  exports: [ImgProductoService],
})
export class ImgProductosModule {}
