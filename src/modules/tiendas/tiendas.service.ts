import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tienda } from './entities/tienda.entity';
import { CreateTiendaDto } from './dto/create-tienda.dto';
import { UpdateTiendaDto } from './dto/update-tienda.dto';
import { Estado } from '../estados/entities/estado.entity';
import { Usuario } from '../usuarios/entities/usuario.entity'; // Asegúrate de ajustar la ruta

@Injectable()
export class TiendasService {
  constructor(
    @InjectRepository(Tienda)
    private readonly tiendaRepo: Repository<Tienda>,
    @InjectRepository(Estado)
    private readonly estadoRepo: Repository<Estado>,
    @InjectRepository(Usuario)
    private readonly usuarioRepo: Repository<Usuario>, // INYECTAMOS USUARIO
  ) {}

  async create(dto: CreateTiendaDto, asignadoPorId: number): Promise<any> {
    // Verificamos que el usuario tenga rol REPRESENTANTE
    const usuario = await this.usuarioRepo.findOne({
      where: { id: dto.usuarios_id },
      relations: ['rol'],
    });

    if (!usuario || usuario.rol?.id !== 4) {
      throw new BadRequestException(
        'El usuario debe tener rol REPRESENTANTE (id: 4)',
      );
    }

    const nueva = this.tiendaRepo.create({
      ...dto,
      estado: { id: dto.estados_id },
      representante: { id: dto.usuarios_id },
      asignadoPor: { id: asignadoPorId },
    });

    const guardada = await this.tiendaRepo.save(nueva);

    const completa = await this.tiendaRepo.findOne({
      where: { id: guardada.id },
      relations: ['representante', 'asignadoPor', 'estado'],
    });

    if (!completa) {
      throw new NotFoundException(`Error al cargar la tienda recién creada`);
    }

    return this.formatResponse(completa);
  }

  async findAll(): Promise<any[]> {
  const tiendas = await this.tiendaRepo.find({
    relations: ['representante', 'asignadoPor', 'estado', 'imagenes'], // agregamos imagenes
  });

  return tiendas.map(this.formatResponse);
}

  async findOne(id: number): Promise<any> {
    const tienda = await this.tiendaRepo.findOne({
      where: { id },
      relations: ['representante', 'asignadoPor', 'estado'],
    });

    if (!tienda) {
      throw new NotFoundException(`Tienda con ID ${id} no encontrada`);
    }

    return this.formatResponse(tienda);
  }

  async update(
    id: number,
    dto: UpdateTiendaDto,
    asignadoPorId: number,
  ): Promise<any> {
    const tienda = await this.tiendaRepo.findOne({ where: { id } });

    if (!tienda) {
      throw new NotFoundException(`Tienda con ID ${id} no encontrada`);
    }

    // Si se está actualizando el representante, validar su rol
    if (dto.usuarios_id) {
      const usuario = await this.usuarioRepo.findOne({
        where: { id: dto.usuarios_id },
        relations: ['rol'],
      });

      if (!usuario || usuario.rol?.id !== 4) {
        throw new BadRequestException(
          'El usuario debe tener rol REPRESENTANTE (id: 4)',
        );
      }
    }

    Object.assign(tienda, {
      ...dto,
      estado: dto.estados_id ? { id: dto.estados_id } : tienda.estado,
      representante: dto.usuarios_id
        ? { id: dto.usuarios_id }
        : tienda.representante,
      asignadoPor: { id: asignadoPorId },
    });

    await this.tiendaRepo.save(tienda);

    const completa = await this.tiendaRepo.findOne({
      where: { id },
      relations: ['representante', 'asignadoPor', 'estado'],
    });

    if (!completa) {
      throw new NotFoundException(
        `Tienda con ID ${id} no encontrada tras actualizar`,
      );
    }

    return this.formatResponse(completa);
  }

  async remove(id: number): Promise<{ message: string }> {
    const result = await this.tiendaRepo.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException(`Tienda con ID ${id} no encontrada`);
    }

    return { message: `Tienda con ID ${id} eliminada correctamente` };
  }

 private formatResponse(tienda: Tienda): any {
  return {
    id: tienda.id,
    nombre: tienda.nombre,
    descripcion: tienda.descripcion,
    nit: tienda.nit,
    dv: tienda.dv,
    direccion: tienda.direccion,
    barrio: tienda.barrio,
    telefonos: {
      uno: tienda.telefono_uno,
    },
    representante: {
      id: tienda.representante?.id,
      nombre: tienda.representante?.nombre,
      apellido: tienda.representante?.apellido,
      dni: tienda.representante?.dni,
    },
    asignadoPor: {
      id: tienda.asignadoPor?.id,
      nombre: tienda.asignadoPor?.nombre,
      apellido: tienda.asignadoPor?.apellido,
      dni: tienda.asignadoPor?.dni,
    },
    estado: {
      id: tienda.estado?.id,
      estado: tienda.estado?.estado,
    },
    imagenes: tienda.imagenes?.map(img => ({
      id: img.id,
      url: img.url,
      createdAt: img.createdAt,
    updatedAt: img.updatedAt,
    })) || [], // agregamos las imágenes
    createdAt: tienda.createdAt,
    updatedAt: tienda.updatedAt,
  };
}
}
