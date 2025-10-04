// src/modules/cuentas-cobro/cuentas-cobro.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CuentasCobroService } from './cuentas-cobro.service';
import { CuentasCobroController } from './cuentas-cobro.controller';
import { CuentaCobro } from './entities/cuenta-cobro.entity';
import { Tienda } from '../tiendas/entities/tienda.entity';
import { OrdenCompra } from '../orden-compra/entities/orden-compra.entity';
import { Estado } from '../estados/entities/estado.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CuentaCobro, Tienda, OrdenCompra, Estado])],
  controllers: [CuentasCobroController],
  providers: [CuentasCobroService],
})
export class CuentasCobroModule {}
