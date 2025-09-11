import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Not } from 'typeorm';
import { Pago } from './entities/pago.entity';
import { Cuota } from '../cuotas/entities/cuota.entity';
import { PagoCuota } from '../pagos-has-cuotas/entities/pago-cuota.entity';
import { CreatePagoDto } from './dto/create-pago.dto';
import { Credito } from '../creditos/entities/credito.entity';
import { OrdenCompra } from '../orden-compra/entities/orden-compra.entity';

@Injectable()
export class PagosService {
  constructor(
    @InjectRepository(Pago) private readonly pagoRepo: Repository<Pago>,
    @InjectRepository(Cuota) private readonly cuotaRepo: Repository<Cuota>,
    @InjectRepository(PagoCuota) private readonly pagoCuotaRepo: Repository<PagoCuota>,
     @InjectRepository(Credito) private readonly creditoRepo: Repository<Credito>,
     @InjectRepository(OrdenCompra) private readonly ordenRepo: Repository<OrdenCompra>,
  ) {}

async create(dto: CreatePagoDto) {
  // 🔎 Buscar la orden de compra
  const orden = await this.ordenRepo.findOne({
    where: { id: dto.orden_compra_id },
    relations: ['cuotasGeneradas', 'usuario'],
  });

  if (!orden) {
    throw new NotFoundException(
      `Orden de compra ${dto.orden_compra_id} no encontrada`,
    );
  }

  // ✅ Verificar saldo pendiente de la orden
  const saldoPendiente = orden.cuotasGeneradas.reduce(
  (total, cuota) => total + Number(cuota.saldo_cuota),
  0,
);

  if (saldoPendiente <= 0) {
    throw new BadRequestException(
  `La orden ${dto.orden_compra_id} ya está completamente pagada, no se puede registrar más pagos.`,
);
  }

  // ✅ Ajustar monto pagado si excede el saldo pendiente
  const montoAplicable = Math.min(dto.monto_pagado, saldoPendiente);

  // Crear el pago con la relación a la orden
  const pago = this.pagoRepo.create({
    monto_pagado: montoAplicable,
    referencia: dto.referencia,
    orden,
  });
  await this.pagoRepo.save(pago);

  let montoRestante = montoAplicable;

  // 🔹 Traer cuotas pendientes ordenadas por número
  const cuotas = await this.cuotaRepo.find({
    where: { orden: { id: dto.orden_compra_id }, saldo_cuota: Not(0) },
    relations: ['orden', 'orden.usuario'],
    order: { numero_cuota: 'ASC' },
  });

  if (!cuotas.length) {
    throw new NotFoundException(
      `No existen cuotas pendientes para la orden ${dto.orden_compra_id}`,
    );
  }

  const usuarioId = cuotas[0].orden.usuario.id;

  // 🔹 Buscar crédito activo del usuario
  const credito = await this.creditoRepo.findOne({
    where: { cliente: { id: usuarioId }, estado: { id: 1 } },
    relations: ['cliente', 'estado'],
  });

  if (!credito) {
    throw new NotFoundException(
      `El usuario con ID ${usuarioId} no tiene crédito activo`,
    );
  }

  // 🔹 Aplicar el pago a las cuotas
  for (const cuota of cuotas) {
    if (montoRestante <= 0) break;

    const aplicar = Math.min(montoRestante, Number(cuota.saldo_cuota));
    cuota.saldo_cuota = Number(cuota.saldo_cuota) - aplicar;

    if (cuota.saldo_cuota === 0) {
      cuota.estado = { id: 9 } as any; // estado "Pagado"
    }

    await this.cuotaRepo.save(cuota);

    const pagoCuota = this.pagoCuotaRepo.create({
      pago,
      cuota,
      monto_aplicado: aplicar,
    });
    await this.pagoCuotaRepo.save(pagoCuota);

    credito.deuda = Number(credito.deuda) - aplicar;
    montoRestante -= aplicar;
  }

  await this.creditoRepo.save(credito);

  return this.pagoRepo.findOne({
    where: { id: pago.id },
    relations: ['orden', 'orden.usuario'],
  });
}



}
