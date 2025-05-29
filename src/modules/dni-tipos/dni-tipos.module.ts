import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DniTipo } from './entities/dni-tipo.entity';
import { DniTiposService } from './dni-tipos.service';
import { DniTiposController } from './dni-tipos.controller';

@Module({
  imports: [TypeOrmModule.forFeature([DniTipo])],
  controllers: [DniTiposController],
  providers: [DniTiposService],
  exports: [TypeOrmModule],
})
export class DniTiposModule {}
