// src/modules/img-productos/img-productos.controller.ts
import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  Param,
  ParseIntPipe,
  BadRequestException,
  Get,
  Delete,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { extname } from 'path';
import * as fs from 'fs';
import * as path from 'path';
import { ImgProductosService } from './img-productos.service';
import { Producto } from '../productos/entities/producto.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ApiOperation } from '@nestjs/swagger';

@Controller('img-productos')
export class ImgProductosController {
  constructor(
    private readonly imgProductosService: ImgProductosService,
    @InjectRepository(Producto)
    private readonly productoRepo: Repository<Producto>,
  ) {}

  @Post('upload/:productoId')
  @ApiOperation({
    summary: 'Subir imagen de un producto',
    description:
      'Permite subir una imagen asociada a un producto específico. La imagen se almacena en el servidor dentro de `uploads/productos`.',
  })
  @UseInterceptors(
    FileInterceptor('file', {
      storage: memoryStorage(),
    }),
  )
  async uploadImage(
    @UploadedFile() file: Express.Multer.File,
    @Param('productoId', ParseIntPipe) productoId: number,
  ) {
    const producto = await this.productoRepo.findOne({
      where: { id: productoId },
    });
    if (!producto) throw new BadRequestException('El producto no existe');

    const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = extname(file.originalname);
    const fileName = `producto-${unique}${ext}`;

    // Guardar en uploads/productos
    const uploadDir = path.join(
      __dirname,
      '..',
      '..',
      '..',
      'uploads',
      'productos',
    );
    const uploadPath = path.join(uploadDir, fileName);

    fs.mkdirSync(uploadDir, { recursive: true });
    fs.writeFileSync(uploadPath, file.buffer);

    const url = `/uploads/productos/${fileName}`;

    return this.imgProductosService.create({ productoId, url });
  }

  @Get()
  @ApiOperation({
    summary: 'Obtener todos los productos con sus imágenes',
    description: 'Devuelve una lista de todos los productos junto con sus imágenes asociadas.',
  })
  async getAllWithImages() {
    return this.imgProductosService.findAllWithImages();
  }

  @Get(':productoId')
  @ApiOperation({
    summary: 'Obtener imágenes de un producto específico',
    description: 'Devuelve todas las imágenes asociadas a un producto por su ID.',
  })
  async findByProducto(@Param('productoId', ParseIntPipe) productoId: number) {
    return this.imgProductosService.findByProducto(productoId);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Eliminar una imagen de producto',
    description: 'Elimina una imagen del sistema mediante su ID.',
  })
  async deleteImage(@Param('id', ParseIntPipe) id: number) {
    return this.imgProductosService.remove(id);
  }
}
