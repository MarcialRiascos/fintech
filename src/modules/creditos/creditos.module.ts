import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CreditosService } from './creditos.service';
import { CreditosController } from './creditos.controller';

import { Credito } from './entities/credito.entity';
import { Usuario } from '../usuarios/entities/usuario.entity';
import { Estado } from '../estados/entities/estado.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Credito, Usuario, Estado]),
  ],
  controllers: [CreditosController],
  providers: [CreditosService],
})
export class CreditosModule {}
