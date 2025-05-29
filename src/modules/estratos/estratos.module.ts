import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Estrato } from './entities/estrato.entity';
import { EstratosService } from './estratos.service';
import { EstratosController } from './estratos.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Estrato])],
  controllers: [EstratosController],
  providers: [EstratosService],
  exports: [TypeOrmModule],
})
export class EstratosModule {}
