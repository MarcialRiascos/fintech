import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductoController } from './productos.controller';
import { ProductoService } from './productos.service';
import { Producto } from './entities/producto.entity';
import { Tienda } from '../tiendas/entities/tienda.entity';
import { Estado } from '../estados/entities/estado.entity';
import { Usuario } from '../usuarios/entities/usuario.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Producto, Tienda, Estado, Usuario]),
  ],
  controllers: [ProductoController],
  providers: [ProductoService],
  exports: [ProductoService],
})
export class ProductosModule {}
