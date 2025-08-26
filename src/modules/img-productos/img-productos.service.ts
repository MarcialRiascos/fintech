// src/modules/img-productos/img-productos.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ImgProducto } from './entities/img-producto.entity';
import { CreateImgProductoDto } from './dto/create-img-producto.dto';
import { Producto } from '../productos/entities/producto.entity';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class ImgProductosService {
  constructor(
    @InjectRepository(ImgProducto)
    private imgRepo: Repository<ImgProducto>,
    @InjectRepository(Producto)
    private productoRepo: Repository<Producto>,
  ) {}

  async create(dto: CreateImgProductoDto): Promise<any> {
    const producto = await this.productoRepo.findOne({
      where: { id: dto.productoId },
    });

    if (!producto) throw new NotFoundException('Producto no encontrado');

    const nueva = this.imgRepo.create({
      url: dto.url,
      producto,
    });

    const guardada = await this.imgRepo.save(nueva);

    return {
      id: guardada.id,
      url: guardada.url,
      producto: {
        id: producto.id,
        nombre: producto.nombre,
      },
      createdAt: guardada.createdAt,
      updatedAt: guardada.updatedAt,
    };
  }

  async findByProducto(productoId: number): Promise<ImgProducto[]> {
    return this.imgRepo.find({
      where: { producto: { id: productoId } },
    });
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
