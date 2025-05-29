// src/modules/sexos/entities/sexo.entity.ts
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';

@Entity('sexos')
export class Sexo extends BaseEntity {
  @PrimaryGeneratedColumn({ unsigned: true })
  id: number;

  @Column({ type: 'varchar', length: 45 })
  sexo: string;
}
