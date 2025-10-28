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
      message: 'Imagen guardada exitosamente',
    };
  }

  async findAllWithImages() {
    const productos = await this.productoRepo.find({
      relations: ['imagenes'], // ⚡ Trae automáticamente todas las imágenes asociadas
      order: { id: 'ASC' }, // opcional: orden por id
    });

    return {
      message: 'Listado de productos con imágenes obtenido correctamente',
      data: productos,
    };
  }

  async findByProducto(
    productoId: number,
  ): Promise<{ message: string; data: ImgProducto[] }> {
    const imagenes = await this.imgRepo.find({
      where: { producto: { id: productoId } },
    });

    return {
      message: imagenes.length
        ? 'Imágenes encontradas correctamente'
        : 'No se encontraron imágenes para este producto',
      data: imagenes,
    };
  }

  async remove(id: number) {
    const img = await this.imgRepo.findOne({ where: { id } });
    if (!img) throw new NotFoundException('Imagen no encontrada');

    // Quitar posible slash inicial del path
    const relativePath = img.url.startsWith('/') ? img.url.slice(1) : img.url;

    // Ruta absoluta al archivo físico
    const filePath = path.join(__dirname, '..', '..', '..', relativePath);

    // Borrar archivo si existe
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    // Eliminar registro en la base de datos
    await this.imgRepo.remove(img);

    return { message: 'Imagen eliminada correctamente' };
  }
}
