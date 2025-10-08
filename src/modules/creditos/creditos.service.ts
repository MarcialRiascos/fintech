import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Credito } from './entities/credito.entity';
import { Estado } from '../estados/entities/estado.entity';
import { CreateCreditoDto } from './dto/create-credito.dto';
import { UpdateCreditoDto } from './dto/update-credito.dto';
import { Usuario } from '../usuarios/entities/usuario.entity';

@Injectable()
export class CreditosService {
  constructor(
    @InjectRepository(Credito)
    private readonly creditoRepo: Repository<Credito>,
    @InjectRepository(Estado)
    private readonly estadoRepo: Repository<Estado>,
    @InjectRepository(Usuario)
    private readonly usuarioRepo: Repository<Usuario>,
  ) {}

  async create(dto: CreateCreditoDto, asignadoPorId: number): Promise<any> {
    // 🔎 Buscar quién está asignando
    const asignador = await this.usuarioRepo.findOne({
      where: { id: asignadoPorId },
      relations: ['rol'],
    });

    if (!asignador) {
      throw new NotFoundException(
        `Usuario asignador con ID ${asignadoPorId} no encontrado`,
      );
    }

    // 🚫 Validar que sea super_admin
    if (asignador.rol.role !== 'Super_Admin') {
      throw new BadRequestException(
        `Solo el Super_Admin puede asignar créditos (usuario ${asignador.nombre} no tiene permisos)`,
      );
    }

    // 🔎 Validar que el cliente exista y sea Cliente
    const cliente = await this.usuarioRepo.findOne({
      where: { id: dto.usuarios_id },
      relations: ['rol'],
    });

    if (!cliente) {
      throw new NotFoundException(
        `Cliente con ID ${dto.usuarios_id} no encontrado`,
      );
    }

    if (cliente.rol.role !== 'Cliente') {
      throw new BadRequestException(
        `Solo se pueden asignar créditos a usuarios con rol "Cliente"`,
      );
    }

    // 🔎 Verificar si ya existe un crédito activo o pagando
    const creditoExistente = await this.creditoRepo.findOne({
      where: {
        cliente: { id: dto.usuarios_id },
        estado: { id: In([1, 8]) }, // 1 = Activo, 8 = Pagando
      },
      relations: ['estado', 'cliente'],
    });

    if (creditoExistente) {
      throw new BadRequestException(
        `El cliente ya tiene un crédito en estado "${creditoExistente.estado.estado}"`,
      );
    }

    // ✅ Crear nuevo crédito
    const nuevo = this.creditoRepo.create({
      codigo: dto.codigo,
      monto: dto.monto,
      saldo: dto.monto, // 🔹 saldo igual al monto
      deuda: 0, // 🔹 deuda en cero
      cuota_pago: dto.cuota_pago,
      cliente: { id: cliente.id },
      asignadoPor: { id: asignador.id },
      estado: { id: dto.estados_id },
    });
    const guardado = await this.creditoRepo.save(nuevo);

    const completo = await this.creditoRepo.findOne({
      where: { id: guardado.id },
      relations: ['cliente', 'asignadoPor', 'estado'],
    });

    if (!completo) {
      throw new NotFoundException(
        `Crédito con ID ${guardado.id} no encontrado`,
      );
    }

    return {
      message: 'Credito creado exitosamente',
    };
  }

  async findAll(): Promise<{ message: string; data: any[] }> {
    const creditos = await this.creditoRepo.find({
      relations: ['cliente', 'asignadoPor', 'estado'],
    });

    return {
      message: 'Créditos obtenidos correctamente',
      data: creditos.map((credito) => ({
        id: credito.id,
        codigo: credito.codigo,
        monto: credito.monto,
        saldo: credito.saldo,
        deuda: credito.deuda,
        cuota_pago: credito.cuota_pago,
        cliente: {
          id: credito.cliente?.id,
          nombre: credito.cliente?.nombre,
          apellido: credito.cliente?.apellido,
          contrato: credito.cliente?.contrato,
          dni: credito.cliente?.dni,
        },
        asignadoPor: {
          id: credito.asignadoPor.id,
          nombre: credito.asignadoPor?.nombre,
          apellido: credito.asignadoPor?.apellido,
          contrato: credito.asignadoPor?.contrato,
          dni: credito.asignadoPor?.dni,
        },
        estado: {
          id: credito.estado?.id,
          estado: credito.estado?.estado,
        },
        createdAt: credito.createdAt,
        updatedAt: credito.updatedAt,
      })),
    };
  }

  async findOne(id: number): Promise<{ message: string; data: any }> {
    const credito = await this.creditoRepo.findOne({
      where: { id },
      relations: ['cliente', 'asignadoPor', 'estado'],
    });

    if (!credito) {
      throw new NotFoundException(`Crédito con ID ${id} no encontrado`);
    }

    return {
      message: 'Crédito obtenido correctamente',
      data: {
        id: credito.id,
        codigo: credito.codigo,
        monto: credito.monto,
        saldo: credito.saldo,
        deuda: credito.deuda,
        cuota_pago: credito.cuota_pago,
        cliente: {
          id: credito.cliente?.id,
          nombre: credito.cliente?.nombre,
          apellido: credito.cliente?.apellido,
          contrato: credito.cliente?.contrato,
          dni: credito.cliente?.dni,
        },
        asignadoPor: {
          id: credito.asignadoPor.id,
          nombre: credito.asignadoPor?.nombre,
          apellido: credito.asignadoPor?.apellido,
          contrato: credito.asignadoPor?.contrato,
          dni: credito.asignadoPor?.dni,
        },
        estado: {
          id: credito.estado?.id,
          estado: credito.estado?.estado,
        },
        createdAt: credito.createdAt,
        updatedAt: credito.updatedAt,
      },
    };
  }

  async findByUser(userId: number): Promise<{ message: string; data: any[] }> {
    const creditos = await this.creditoRepo.find({
      where: { cliente: { id: userId } },
      relations: ['cliente', 'asignadoPor', 'estado'],
    });

    if (!creditos.length) {
      throw new NotFoundException(
        `El usuario con ID ${userId} no tiene créditos`,
      );
    }

    const data = creditos.map((credito) => ({
      id: credito.id,
      codigo: credito.codigo,
      monto: credito.monto,
      saldo: credito.saldo,
      deuda: credito.deuda,
      cuota_pago: credito.cuota_pago,
      cliente: {
        id: credito.cliente?.id,
        nombre: credito.cliente?.nombre,
        apellido: credito.cliente?.apellido,
        contrato: credito.cliente?.contrato,
        dni: credito.cliente?.dni,
      },
      asignadoPor: {
        id: credito.asignadoPor?.id,
        nombre: credito.asignadoPor?.nombre,
        apellido: credito.asignadoPor?.apellido,
        contrato: credito.asignadoPor?.contrato,
        dni: credito.asignadoPor?.dni,
      },
      estado: {
        id: credito.estado?.id,
        estado: credito.estado?.estado,
      },
      createdAt: credito.createdAt,
      updatedAt: credito.updatedAt,
    }));

    return {
      message: `Créditos del usuario ${userId} obtenidos correctamente`,
      data,
    };
  }

  async findByAsignador(
    asignadorId: number,
  ): Promise<{ message: string; data: any[] }> {
    const creditos = await this.creditoRepo.find({
      where: { asignadoPor: { id: asignadorId } },
      relations: ['cliente', 'asignadoPor', 'estado'],
      order: { createdAt: 'DESC' },
    });

    if (!creditos.length) {
      throw new NotFoundException(
        `No se encontraron créditos asignados por el usuario con ID ${asignadorId}`,
      );
    }

    const data = creditos.map((credito) => ({
      id: credito.id,
      codigo: credito.codigo,
      monto: credito.monto,
      saldo: credito.saldo,
      deuda: credito.deuda,
      cuota_pago: credito.cuota_pago,
      cliente: {
        id: credito.cliente?.id,
        nombre: credito.cliente?.nombre,
        apellido: credito.cliente?.apellido,
        contrato: credito.cliente?.contrato,
        dni: credito.cliente?.dni,
      },
      estado: {
        id: credito.estado?.id,
        estado: credito.estado?.estado,
      },
      createdAt: credito.createdAt,
      updatedAt: credito.updatedAt,
    }));

    return {
      message: `Créditos asignados por el usuario ${asignadorId} obtenidos correctamente`,
      data,
    };
  }

  async update(
    id: number,
    dto: UpdateCreditoDto,
    asignadoPorId: number,
  ): Promise<any> {
    const credito = await this.creditoRepo.findOne({
      where: { id },
      relations: ['cliente', 'asignadoPor', 'estado'],
    });

    if (!credito) {
      throw new NotFoundException(`Crédito con ID ${id} no encontrado`);
    }

    const clienteId = dto.usuarios_id ?? credito.cliente?.id;

    // Validar si se quiere cambiar el estado a uno prohibido
    if (dto.estados_id && clienteId) {
      const nuevoEstado = await this.estadoRepo.findOne({
        where: { id: dto.estados_id },
      });

      if (!nuevoEstado) {
        throw new NotFoundException(
          `Estado con ID ${dto.estados_id} no encontrado`,
        );
      }

      if (
        ['activo', 'pagando', 'pagado'].includes(
          nuevoEstado.estado.toLowerCase(),
        )
      ) {
        // Buscar si el cliente ya tiene otro crédito activo/pagando
        const creditosExistentes = await this.creditoRepo.find({
          where: {
            cliente: { id: clienteId },
            estado: { estado: In(['activo', 'pagando']) },
          },
          relations: ['estado', 'cliente'],
        });

        const yaTieneCredito = creditosExistentes.some((c) => c.id !== id); // Excluir el mismo crédito

        if (yaTieneCredito) {
          throw new BadRequestException(
            `El cliente con ID ${clienteId} ya tiene un crédito en estado 'activo' o 'pagando'`,
          );
        }
      }
    }

    // Actualizar campos si vienen en el dto
    credito.codigo = dto.codigo ?? credito.codigo;
    credito.monto = dto.monto ?? credito.monto;
    credito.cuota_pago = dto.cuota_pago ?? credito.cuota_pago;

    if (dto.usuarios_id) {
      credito.cliente = { id: dto.usuarios_id } as any;
    }

    credito.asignadoPor = { id: asignadoPorId } as any;

    if (dto.estados_id) {
      credito.estado = { id: dto.estados_id } as any;
    }

    const actualizado = await this.creditoRepo.save(credito);

    const completo = await this.creditoRepo.findOne({
      where: { id: actualizado.id },
      relations: ['cliente', 'asignadoPor', 'estado'],
    });

    if (!completo) {
      throw new NotFoundException(
        `Crédito con ID ${actualizado.id} no encontrado después de actualizar`,
      );
    }

    return {
      message: 'Credito actualizado exitosamente',
    };
  }

  async remove(id: number): Promise<{ message: string }> {
    const result = await this.creditoRepo.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException(`Crédito con ID ${id} no encontrado`);
    }

    return { message: `Crédito con ID ${id} eliminado exitosamente` };
  }
}
