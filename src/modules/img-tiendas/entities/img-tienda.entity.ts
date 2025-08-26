// src/modules/img-tiendas/entities/img-tienda.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Tienda } from 'src/modules/tiendas/entities/tienda.entity';
import { BaseEntity } from '../../../common/entities/base.entity';

@Entity('img_tiendas')
export class ImgTienda extends BaseEntity{
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 255 })
  url: string;

  @ManyToOne(() => Tienda, tienda => tienda.id, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'tiendas_id' })
  tienda: Tienda;
}
