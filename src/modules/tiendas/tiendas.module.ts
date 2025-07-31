// tiendas.module.ts
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';

import { Tienda } from './entities/tienda.entity';
import { Estado } from '../estados/entities/estado.entity';
import { TiendasService } from './tiendas.service';
import { TiendasController } from './tiendas.controller';
import { UsuariosModule } from '../usuarios/usuarios.module'; 

@Module({
  imports: [
    TypeOrmModule.forFeature([Tienda, Estado]),
    UsuariosModule, 
  ],
  controllers: [TiendasController],
  providers: [TiendasService],
})
export class TiendasModule {}
