import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Not } from 'typeorm';
import { Pago } from './entities/pago.entity';
import { Cuota } from '../cuotas/entities/cuota.entity';
import { PagoCuota } from '../pagos-has-cuotas/entities/pago-cuota.entity';
import { CreatePagoDto } from './dto/create-pago.dto';
import { Credito } from '../creditos/entities/credito.entity';
import { OrdenCompra } from '../orden-compra/entities/orden-compra.entity';
import { Usuario } from '../usuarios/entities/usuario.entity';

@Injectable()
export class PagosService {
  constructor(
    @InjectRepository(Pago) private readonly pagoRepo: Repository<Pago>,
    @InjectRepository(Cuota) private readonly cuotaRepo: Repository<Cuota>,
    @InjectRepository(PagoCuota) private readonly pagoCuotaRepo: Repository<PagoCuota>,
     @InjectRepository(Credito) private readonly creditoRepo: Repository<Credito>,
     @InjectRepository(OrdenCompra) private readonly ordenRepo: Repository<OrdenCompra>,
     @InjectRepository(Usuario) private readonly usuarioRepo: Repository<Usuario>,
  ) {}

async create(dto: CreatePagoDto, userId: number) {
  // 🔎 Buscar la orden de compra
  const orden = await this.ordenRepo.findOne({
    where: { id: dto.orden_compra_id },
    relations: ['cuotasGeneradas', 'usuario', 'estado'],
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

  // 🔹 Traer cuotas pendientes ordenadas por número
  const cuotasPendientes = await this.cuotaRepo.find({
    where: { orden: { id: dto.orden_compra_id }, saldo_cuota: Not(0) },
    relations: ['orden', 'orden.usuario'],
    order: { numero_cuota: 'ASC' },
  });

  if (!cuotasPendientes.length) {
    throw new BadRequestException(
      `La orden ${dto.orden_compra_id} ya está completamente pagada (todas las cuotas están en 0).`,
    );
  }

  // ✅ Ajustar monto pagado si excede el saldo pendiente
  const montoAplicable = Math.min(dto.monto_pagado, saldoPendiente);

  // Crear el pago con la relación a la orden
  const asignadoPor = await this.usuarioRepo.findOne({
    where: { id: userId },
  });

  if (!asignadoPor) {
    throw new NotFoundException(
      `Usuario asignador con ID ${userId} no encontrado`,
    );
  }

  const pago = this.pagoRepo.create({
    monto_pagado: montoAplicable,
    referencia: dto.referencia,
    orden,
    asignadoPor,
  });
  await this.pagoRepo.save(pago);

  let montoRestante = montoAplicable;

  // 🔹 Buscar crédito activo del usuario
  const usuarioId = cuotasPendientes[0].orden.usuario.id;
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
  for (const cuota of cuotasPendientes) {
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

  // 🔹 Verificar si TODAS las cuotas de la orden ya quedaron pagadas
  const cuotasRestantes = await this.cuotaRepo.count({
    where: { orden: { id: orden.id }, saldo_cuota: Not(0) },
  });

  if (cuotasRestantes === 0) {
    orden.estado = { id: 9 } as any; // Estado "Pagada"
    await this.ordenRepo.save(orden);
  }

  return {
    message: 'Pago registrado correctamente',
  };
}



 // NUEVO MÉTODO 1: Obtener todos los pagos
  async findAll() {
    return this.pagoRepo.find({
      relations: ['orden', 'orden.usuario'],
      order: { createdAt: 'DESC' }, // Ordenar por fecha de creación descendente
    });
  }

  // NUEVO MÉTODO 2: Obtener pagos por ID de recaudador (usuario)
async findByRecaudador(recaudadorId: number) {
  const pagos = await this.pagoRepo.find({
    where: {
      asignadoPor: { id: recaudadorId },
    },
    relations: ['orden', 'orden.usuario', 'asignadoPor'],
    order: { createdAt: 'DESC' },
  });

  if (!pagos.length) {
    throw new NotFoundException({
      message: `No se encontraron pagos asociados al recaudador con ID ${recaudadorId}`,
      data: [],
    });
  }

  const data = pagos.map((p) => ({
    id: p.id,
    monto_pagado: p.monto_pagado,
    referencia: p.referencia,
    fecha_pago: p.fecha_pago,
    orden: {
      id: p.orden?.id,
       createdAt: p.orden.createdAt,
      updatedAt: p.orden.updatedAt,
      usuario: {
        id: p.orden?.usuario?.id,
        nombre: p.orden?.usuario?.nombre,
        apellido: p.orden?.usuario?.apellido,
      },
    },
    recaudador: {
      id: p.asignadoPor?.id,
      nombre: p.asignadoPor?.nombre,
      apellido: p.asignadoPor?.apellido,
    },
     createdAt: p.createdAt,
      updatedAt: p.updatedAt,
  }));

  return {
    message: `Pagos asociados al recaudador con ID ${recaudadorId} obtenidos correctamente`,
    data,
  };
}

 async findPagosByCliente(userId: number, rol: number) {
    if (rol !== 3) {
      throw new ForbiddenException('Solo los clientes pueden acceder a esta información');
    }

    const pagos = await this.pagoRepo.find({
      relations: [
        'orden',
        'orden.usuario',
        'cuotas',
        'cuotas.cuota',
        'cuotas.cuota.orden',
      ],
      where: {
        orden: {
          usuario: { id: userId },
        },
      },
      order: { id: 'DESC' },
    });

    // Limpiamos y estructuramos mejor la salida
    const data = pagos.map((pago) => ({
      id: pago.id,
      monto_pagado: pago.monto_pagado,
      referencia: pago.referencia,
      fecha_pago: pago.fecha_pago,
      orden: {
        id: pago.orden?.id,
        monto: pago.orden?.monto,
        cuotas: pago.orden?.cuotas,
        createdAt: pago.orden.createdAt,
        updatedAt: pago.orden.updatedAt,
      },
      cuotas: pago.cuotas?.map((pc) => ({
        id: pc.cuota?.id,
        numero_cuota: pc.cuota?.numero_cuota,
        valor_cuota: pc.cuota?.valor_cuota,
        saldo_cuota: pc.cuota?.saldo_cuota,
        fecha_vencimiento: pc.cuota?.fecha_vencimiento,
             createdAt: pc.cuota.createdAt,
        updatedAt: pc.cuota.updatedAt,
      })),
                  createdAt: pago.createdAt,
        updatedAt: pago.updatedAt,
    }));

    return {
      message: 'Pagos del cliente obtenidos correctamente',
      data,
    };
  }

}

