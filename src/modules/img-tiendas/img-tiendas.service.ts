// src/modules/img-tiendas/img-tiendas.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ImgTienda } from './entities/img-tienda.entity';
import { CreateImgTiendaDto } from './dto/create-img-tienda.dto';
import { Tienda } from '../tiendas/entities/tienda.entity';
import * as fs from 'fs';
import * as path from 'path';

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
      message: 'Imagen guardada exitosamente',
    };
  }

async findByTienda(tiendaId: number): Promise<{ message: string; data: ImgTienda[] }> {
  const imagenes = await this.imgRepo.find({
    where: { tienda: { id: tiendaId } },
  });

  return {
    message: imagenes.length
      ? `Se encontraron ${imagenes.length} imágenes para la tienda con ID ${tiendaId}.`
      : `No se encontraron imágenes para la tienda con ID ${tiendaId}.`,
    data: imagenes,
  };
}


  async remove(id: number) {
    const img = await this.imgRepo.findOne({ where: { id } });
    if (!img) throw new NotFoundException('Imagen no encontrada');

    // Borrar archivo físico
    const filePath = path.join(__dirname, '..', '..', '..', img.url);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    // Eliminar de la base de datos
    await this.imgRepo.remove(img);

    return { message: 'Imagen eliminada correctamente' };
  }
}
