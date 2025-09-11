import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PagosService } from './pagos.service';
import { PagosController } from './pagos.controller';
import { Pago } from './entities/pago.entity';
import { Cuota } from '../cuotas/entities/cuota.entity';
import { PagoCuota } from '../pagos-has-cuotas/entities/pago-cuota.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Pago, Cuota, PagoCuota])],
  controllers: [PagosController],
  providers: [PagosService],
})
export class PagosModule {}
