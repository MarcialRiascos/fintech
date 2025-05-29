// src/modules/estratos/entities/estrato.entity.ts
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';

@Entity('estratos')
export class Estrato extends BaseEntity {
  @PrimaryGeneratedColumn({ unsigned: true })
  id: number;

  @Column({ type: 'varchar', length: 45 })
  estrato: string;
}
