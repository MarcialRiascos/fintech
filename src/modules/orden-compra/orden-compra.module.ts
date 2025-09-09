import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrdenCompra } from './entities/orden-compra.entity';
import { ProductoOrdenCompra } from '../producto-orden-compra/entities/producto-orden-compra.entity';
import { OrdenCompraService } from './orden-compra.service';
import { OrdenCompraController } from './orden-compra.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([OrdenCompra, ProductoOrdenCompra]),
  ],
  controllers: [OrdenCompraController],
  providers: [OrdenCompraService],
  exports: [OrdenCompraService],
})
export class OrdenCompraModule {}
