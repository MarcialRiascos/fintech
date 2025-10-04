// src/modules/cuentas-cobro/cuentas-cobro.service.ts
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { CuentaCobro } from './entities/cuenta-cobro.entity';
import { Tienda } from '../tiendas/entities/tienda.entity';
import { OrdenCompra } from '../orden-compra/entities/orden-compra.entity';
import { CreateCuentaCobroDto } from './dto/create-cuenta-cobro.dto';
import { Estado } from '../estados/entities/estado.entity';
import { instanceToPlain } from 'class-transformer';
import { UpdateEstadoCuentaDto } from './dto/update-estado-cuenta.dto';

@Injectable()
export class CuentasCobroService {
  constructor(
    @InjectRepository(CuentaCobro)
    private readonly cuentaRepo: Repository<CuentaCobro>,

    @InjectRepository(Tienda)
    private readonly tiendaRepo: Repository<Tienda>,

    @InjectRepository(OrdenCompra)
    private readonly ordenRepo: Repository<OrdenCompra>,

    @InjectRepository(Estado)
    private readonly estadoRepo: Repository<Estado>,
  ) {}

  async generarCuentaCobro(dto: CreateCuentaCobroDto) {
    const tienda = await this.tiendaRepo.findOne({
      where: { id: dto.tienda_id },
    });

    if (!tienda) {
      throw new NotFoundException(`Tienda ${dto.tienda_id} no encontrada`);
    }

    const hoy = new Date();
    const mes = hoy.getMonth() + 1;
    const anio = hoy.getFullYear();

    // 🔒 Verificar si ya existe cuenta para este mes
    const existente = await this.cuentaRepo.findOne({
      where: { tienda: { id: tienda.id }, mes, anio },
    });

    if (existente) {
      throw new BadRequestException(
        `Ya existe una cuenta de cobro para ${mes}/${anio} de esta tienda.`,
      );
    }

    // 📅 Fecha de corte (día 5 del mes actual)
    const fechaCorte = new Date(anio, mes - 1, 5);

    // 🧮 Buscar órdenes confirmadas/pagadas
    const ordenes = await this.ordenRepo.find({
      where: {
        tienda: { id: tienda.id },
        estado: { id: In([9, 12]) }, // Pagado o Confirmado
      },
      relations: ['estado', 'tienda'],
    });

    if (ordenes.length === 0) {
      throw new BadRequestException(
        `No hay órdenes confirmadas o pagadas para esta tienda en este mes.`,
      );
    }

    const total = ordenes.reduce(
      (sum, o) => sum + Number(o.monto_senda || 0),
      0,
    );

    // 🔹 Estado Pendiente (11)
    const estadoPendiente = await this.estadoRepo.findOne({
      where: { id: 11 },
    });

    if (!estadoPendiente) {
      throw new NotFoundException(`No se encontró el estado Pendiente (id=11)`);
    }

    // 💾 Crear cuenta
    const cuenta = this.cuentaRepo.create({
      tienda,
      estado: estadoPendiente,
      total,
      fecha_corte: fechaCorte,
      mes,
      anio,
      ordenes,
    });

    await this.cuentaRepo.save(cuenta);

    // 🔗 Asociar las órdenes a la cuenta
    for (const orden of ordenes) {
      orden.cuentaCobro = cuenta;
      await this.ordenRepo.save(orden);
    }

    return {
      message: 'Cuenta de cobro generada correctamente',
    };
  }

  async findAll() {
    const cuentas = await this.cuentaRepo.find({
      relations: ['tienda', 'estado'],
      order: { anio: 'DESC', mes: 'DESC' },
    });

    return {
      message: 'Cuentas de cobro obtenidas correctamente',
      data: cuentas,
    };
  }

  async findByUsuario(userId: number) {
    // 1️⃣ Buscar las tiendas del usuario autenticado
    const tiendas = await this.tiendaRepo.find({
      where: { representante: { id: userId } },
    });

    if (tiendas.length === 0) {
      throw new NotFoundException(
        'No se encontraron tiendas asociadas a este usuario.',
      );
    }

    const tiendaIds = tiendas.map((t) => t.id);

    // 2️⃣ Buscar las cuentas de cobro de esas tiendas con todas las relaciones necesarias
    const cuentas = await this.cuentaRepo.find({
      where: { tienda: { id: In(tiendaIds) } },
      relations: ['tienda', 'estado'],
      order: { anio: 'DESC', mes: 'DESC' },
    });

    if (cuentas.length === 0) {
      throw new NotFoundException(
        'No se encontraron cuentas de cobro para las tiendas de este usuario.',
      );
    }

    // 3️⃣ Retornar la respuesta completa sin mapear manualmente
    return {
      message: 'Cuentas de cobro obtenidas correctamente',
      data: cuentas,
    };
  }

  async findOrdenesByTienda(tiendaId: number) {
    const tienda = await this.tiendaRepo.findOne({ where: { id: tiendaId } });

    if (!tienda) {
      throw new NotFoundException(`Tienda con ID ${tiendaId} no encontrada`);
    }

    const cuentas = await this.cuentaRepo.find({
      where: { tienda: { id: tiendaId } },
      relations: ['tienda', 'estado'],
      order: { anio: 'DESC', mes: 'DESC' },
    });

    return {
      message: 'Cuentas de cobro obtenidas correctamente',
      data: cuentas,
    };
  }

  async updateEstado(id: number, dto: UpdateEstadoCuentaDto) {
  const cuenta = await this.cuentaRepo.findOne({
    where: { id },
    relations: ['estado'],
  });

  if (!cuenta) {
    throw new NotFoundException(`Cuenta de cobro con id ${id} no encontrada.`);
  }

  const nuevoEstado = await this.estadoRepo.findOne({
    where: { id: dto.estadoId },
  });

  if (!nuevoEstado) {
    throw new NotFoundException(`Estado con id ${dto.estadoId} no encontrado.`);
  }

  cuenta.estado = nuevoEstado;
  await this.cuentaRepo.save(cuenta);

  return {
    message: 'Estado de la cuenta actualizado correctamente',
    data: {
      id: cuenta.id,
      total: cuenta.total,
      mes: cuenta.mes,
      anio: cuenta.anio,
      fecha_corte: cuenta.fecha_corte,
      estado: {
        id: nuevoEstado.id,
        estado: nuevoEstado.estado,
      },
    },
  };
}

}
