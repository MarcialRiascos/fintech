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
  Delete,
  UseGuards,
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
import { JwtAuthGuard } from '../auth/jwt.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from 'src/common/constants/roles.enum';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('img-tiendas')
export class ImgTiendasController {
  constructor(
    private readonly imgTiendasService: ImgTiendasService,
    @InjectRepository(Tienda)
    private readonly tiendaRepo: Repository<Tienda>,
  ) {}

  @Post('upload/:tiendaId')
  // @Roles(Role.SUPER_ADMIN, Role.ADMIN)
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

    // 📂 Guardar en public/uploads/tiendas
    const uploadDir = path.join(
      __dirname,
      '..',
      '..',
      '..',
      'public',
      'uploads',
      'tiendas',
    );
    const uploadPath = path.join(uploadDir, fileName);

    // Crear carpeta si no existe
    fs.mkdirSync(uploadDir, { recursive: true });

    // Guardar la imagen físicamente
    fs.writeFileSync(uploadPath, file.buffer);

    // 🌐 Generar URL pública (accesible desde el navegador)
    const url = `/public/uploads/tiendas/${fileName}`;

    // Guardar en base de datos
    return this.imgTiendasService.create({ tiendaId, url });
  }

  @Get(':tiendaId')
  //@Roles(Role.SUPER_ADMIN, Role.ADMIN)
  @ApiOperation({
    summary: 'Obtener imágenes de una tienda',
    description:
      'Devuelve todas las imágenes asociadas a una tienda por su ID.',
  })
  async findByTienda(@Param('tiendaId', ParseIntPipe) tiendaId: number) {
    return this.imgTiendasService.findByTienda(tiendaId);
  }

  @Delete(':id')
  // @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  @ApiOperation({
    summary: 'Eliminar una imagen de tienda',
    description: 'Elimina una imagen del sistema por su ID.',
  })
  async deleteImage(@Param('id', ParseIntPipe) id: number) {
    return this.imgTiendasService.remove(id);
  }
}
