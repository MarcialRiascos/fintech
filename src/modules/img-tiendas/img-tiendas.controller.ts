// src/modules/img-tiendas/img-tiendas.controller.ts
import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  Param,
  ParseIntPipe,
  BadRequestException,
  Get,
  Delete
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { extname } from 'path';
import * as fs from 'fs';
import * as path from 'path';
import { ImgTiendasService } from './img-tiendas.service';
import { Tienda } from '../tiendas/entities/tienda.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ApiOperation } from '@nestjs/swagger';

@Controller('img-tiendas')
export class ImgTiendasController {
  constructor(
    private readonly imgTiendasService: ImgTiendasService,
    @InjectRepository(Tienda)
    private readonly tiendaRepo: Repository<Tienda>,
  ) {}

  @Post('upload/:tiendaId')
  @ApiOperation({
    summary: 'Subir imagen de una tienda',
    description:
      'Permite subir una imagen asociada a una tienda específica. La imagen se guarda en el servidor en la carpeta `uploads/tiendas`.',
  })
  @UseInterceptors(
    FileInterceptor('file', {
      storage: memoryStorage(),
    }),
  )
  async uploadImage(
    @UploadedFile() file: Express.Multer.File,
    @Param('tiendaId', ParseIntPipe) tiendaId: number,
  ) {
    const tienda = await this.tiendaRepo.findOne({ where: { id: tiendaId } });
    if (!tienda) throw new BadRequestException('La tienda no existe');

    const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = extname(file.originalname);
    const fileName = `tienda-${unique}${ext}`;

    // 🔁 Guardar en uploads/tiendas
    const uploadDir = path.join(
      __dirname,
      '..',
      '..',
      '..',
      'uploads',
      'tiendas',
    );
    const uploadPath = path.join(uploadDir, fileName);

    // Crear carpeta si no existe
    fs.mkdirSync(uploadDir, { recursive: true });

    // Guardar la imagen
    fs.writeFileSync(uploadPath, file.buffer);

    // Ruta pública
    const url = `/uploads/tiendas/${fileName}`;

    // Guardar en base de datos
    return this.imgTiendasService.create({ tiendaId, url });
  }

  @Get(':tiendaId')
  @ApiOperation({
    summary: 'Obtener imágenes de una tienda',
    description: 'Devuelve todas las imágenes asociadas a una tienda por su ID.',
  })
  async findByTienda(@Param('tiendaId', ParseIntPipe) tiendaId: number) {
    return this.imgTiendasService.findByTienda(tiendaId);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Eliminar una imagen de tienda',
    description: 'Elimina una imagen del sistema por su ID.',
  })
  async deleteImage(@Param('id', ParseIntPipe) id: number) {
    return this.imgTiendasService.remove(id);
  }
}
