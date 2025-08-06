// src/modules/img-tiendas/img-tiendas.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ImgTiendasService } from './img-tiendas.service';
import { ImgTiendasController } from './img-tiendas.controller';
import { ImgTienda } from './entities/img-tienda.entity';
import { Tienda } from '../tiendas/entities/tienda.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ImgTienda, Tienda])],
  controllers: [ImgTiendasController],
  providers: [ImgTiendasService],
})
export class ImgTiendasModule {}
