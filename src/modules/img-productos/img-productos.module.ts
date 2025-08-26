import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ImgProductosService } from './img-productos.service';
import { ImgProductosController } from './img-productos.controller';
import { ImgProducto } from './entities/img-producto.entity';
import { Producto } from '../productos/entities/producto.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([ImgProducto, Producto]),
  ],
  controllers: [ImgProductosController],
  providers: [ImgProductosService],
  exports: [ImgProductosService],
})
export class ImgProductosModule {}
