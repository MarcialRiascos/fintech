// src/modules/estados/entities/estado.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { Producto } from '../../productos/entities/producto.entity';

@Entity('estados')
export class Estado extends BaseEntity {
  @PrimaryGeneratedColumn({ unsigned: true })
  id: number;

  @Column({ type: 'varchar', length: 45 })
  estado: string;

  @OneToMany(() => Producto, producto => producto.estado)
  productos: Producto[];
} 