import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrdenCompra } from './entities/orden-compra.entity';
import { ProductoOrdenCompra } from '../producto-orden-compra/entities/producto-orden-compra.entity';
import { OrdenCompraService } from './orden-compra.service';
import { OrdenCompraController } from './orden-compra.controller';
import { Producto } from '../productos/entities/producto.entity';
import { Credito } from '../creditos/entities/credito.entity';
import { Cuota } from '../cuotas/entities/cuota.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([OrdenCompra, ProductoOrdenCompra, Producto, Credito, Cuota]),
  ],
  controllers: [OrdenCompraController],
  providers: [OrdenCompraService],
  exports: [OrdenCompraService],
})
export class OrdenCompraModule {}
