import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ImgProducto } from './entities/img-producto.entity';
import { CreateImgProductoDto } from './dto/create-img-producto.dto';

@Injectable()
export class ImgProductoService {
  constructor(
    @InjectRepository(ImgProducto)
    private readonly imgRepo: Repository<ImgProducto>,
  ) {}

  async create(data: CreateImgProductoDto) {
    const img = this.imgRepo.create({
      ...data,
      producto: { id: data.productos_id },
    });
    return await this.imgRepo.save(img);
  }

  async findAll() {
    return await this.imgRepo.find({
      relations: ['producto'],
    });
  }

  async findByProducto(productos_id: number) {
    return await this.imgRepo.find({
      where: { producto: { id: productos_id } },
    });
  }
}
