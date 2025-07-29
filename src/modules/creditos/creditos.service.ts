import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Credito } from './entities/credito.entity';
import { CreateCreditoDto } from './dto/create-credito.dto';
import { UpdateCreditoDto } from './dto/update-credito.dto';

@Injectable()
export class CreditosService {
  constructor(
    @InjectRepository(Credito)
    private readonly creditoRepo: Repository<Credito>,
  ) {}

 async create(dto: CreateCreditoDto, asignadoPorId: number): Promise<Credito> {
  const nuevo = this.creditoRepo.create({
    codigo: dto.codigo,
    monto: dto.monto,
    cuota_pago: dto.cuota_pago,
    cliente: { id: dto.usuarios_id },        // Cliente que recibe el crédito
    asignadoPor: { id: asignadoPorId },       // Usuario que lo asigna (desde sesión)
    estado: { id: dto.estados_id },
  });

  return await this.creditoRepo.save(nuevo);
}



  async findAll(): Promise<Credito[]> {
    return await this.creditoRepo.find({
      relations: ['cliente', 'asignadoPor', 'estado'],
    });
  }

  async findOne(id: number): Promise<Credito> {
    const credito = await this.creditoRepo.findOne({
      where: { id },
      relations: ['cliente', 'asignadoPor', 'estado'],
    });

    if (!credito) {
      throw new NotFoundException(`Crédito con ID ${id} no encontrado`);
    }

    return credito;
  }

  async update(id: number, dto: UpdateCreditoDto): Promise<Credito> {
    const credito = await this.findOne(id);

    credito.codigo = dto.codigo ?? credito.codigo;
    credito.monto = dto.monto ?? credito.monto;
    credito.cuota_pago = dto.cuota_pago ?? credito.cuota_pago;

    if (dto.usuarios_id) {
      credito.cliente = { id: dto.usuarios_id } as any;
    }
    if (dto.usuarios_id1) {
      credito.asignadoPor = { id: dto.usuarios_id1 } as any;
    }
    if (dto.estados_id) {
      credito.estado = { id: dto.estados_id } as any;
    }

    return await this.creditoRepo.save(credito);
  }

  async remove(id: number): Promise<void> {
    const result = await this.creditoRepo.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Crédito con ID ${id} no encontrado`);
    }
  }
}
