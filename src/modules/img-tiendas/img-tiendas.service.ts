// src/modules/img-tiendas/img-tiendas.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ImgTienda } from './entities/img-tienda.entity';
import { CreateImgTiendaDto } from './dto/create-img-tienda.dto';
import { Tienda } from '../tiendas/entities/tienda.entity';

@Injectable()
export class ImgTiendasService {
  constructor(
    @InjectRepository(ImgTienda)
    private imgRepo: Repository<ImgTienda>,
    @InjectRepository(Tienda)
    private tiendaRepo: Repository<Tienda>,
  ) {}

async create(dto: CreateImgTiendaDto): Promise<any> {
  const tienda = await this.tiendaRepo.findOne({
    where: { id: dto.tiendaId },
  });

  if (!tienda) throw new NotFoundException('Tienda no encontrada');

  const nueva = this.imgRepo.create({
    url: dto.url,
    tienda: tienda,
  });

  const guardada = await this.imgRepo.save(nueva);

  return {
    id: guardada.id,
    url: guardada.url,
    tienda: {
      id: tienda.id,
      nombre: tienda.nombre,
    },
  };
}




  async findByTienda(tiendaId: number): Promise<ImgTienda[]> {
    return this.imgRepo.find({
      where: { tienda: { id: tiendaId } },
    });
  }
}
