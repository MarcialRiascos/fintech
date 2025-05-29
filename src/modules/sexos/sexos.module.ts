import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Sexo } from './entities/sexo.entity';
import { SexosService } from './sexos.service';
import { SexosController } from './sexos.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Sexo])],
  controllers: [SexosController],
  providers: [SexosService],
  exports: [TypeOrmModule],
})
export class SexosModule {} 
