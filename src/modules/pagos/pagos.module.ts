import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PagosService } from './pagos.service';
import { PagosController } from './pagos.controller';
import { Pago } from './entities/pago.entity';
import { Cuota } from '../cuotas/entities/cuota.entity';
import { PagoCuota } from '../pagos-has-cuotas/entities/pago-cuota.entity';
import { Credito } from '../creditos/entities/credito.entity';
import { OrdenCompra } from '../orden-compra/entities/orden-compra.entity';
import { Usuario } from '../usuarios/entities/usuario.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Pago, Cuota, PagoCuota, Credito, OrdenCompra, Usuario])],
  controllers: [PagosController],
  providers: [PagosService],
})
export class PagosModule {}
