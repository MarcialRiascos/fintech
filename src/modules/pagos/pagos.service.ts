import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Pago } from './entities/pago.entity';
import { Cuota } from '../cuotas/entities/cuota.entity';
import { PagoCuota } from '../pagos-has-cuotas/entities/pago-cuota.entity';
import { CreatePagoDto } from './dto/create-pago.dto';

@Injectable()
export class PagosService {
  constructor(
    @InjectRepository(Pago) private readonly pagoRepo: Repository<Pago>,
    @InjectRepository(Cuota) private readonly cuotaRepo: Repository<Cuota>,
    @InjectRepository(PagoCuota) private readonly pagoCuotaRepo: Repository<PagoCuota>,
  ) {}

  async create(dto: CreatePagoDto) {
    const pago = this.pagoRepo.create(dto);
    await this.pagoRepo.save(pago);

    let montoRestante = dto.monto_pagado;

    // Traer cuotas pendientes de la orden, ordenadas por número
    const cuotas = await this.cuotaRepo.find({
      where: { orden: { id: dto.orden_compra_id } },
      order: { numero_cuota: 'ASC' },
    });

    for (const cuota of cuotas) {
      if (montoRestante <= 0) break;

      const aplicar = Math.min(montoRestante, Number(cuota.saldo_cuota));

      cuota.saldo_cuota = Number(cuota.saldo_cuota) - aplicar;
      await this.cuotaRepo.save(cuota);

      const pagoCuota = this.pagoCuotaRepo.create({
        pago,
        cuota,
        monto_aplicado: aplicar,
      });
      await this.pagoCuotaRepo.save(pagoCuota);

      montoRestante -= aplicar;
    }

    return pago;
  }
}
