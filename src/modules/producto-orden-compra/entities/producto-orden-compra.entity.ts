// src/modules/orden-compra/entities/producto-orden-compra.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Producto } from '../../productos/entities/producto.entity';
import { OrdenCompra } from '../../orden-compra/entities/orden-compra.entity';
import { Estado } from '../../estados/entities/estado.entity';
import { BaseEntity } from 'src/common/entities/base.entity';

@Entity('productos_has_orden_compra')
export class ProductoOrdenCompra extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Producto)
  @JoinColumn({ name: 'productos_id' })
  producto: Producto;

  @ManyToOne(() => OrdenCompra, orden => orden.productos)
  @JoinColumn({ name: 'orden_compra_id' })
  ordenCompra: OrdenCompra;

  @Column('decimal', { precision: 15, scale: 2 })
  precio_tienda: number;

  @Column('decimal', { precision: 15, scale: 2 })
  precio_senda: number;

  @Column('decimal', { precision: 8, scale: 2 })
  cantidad: number;

  @ManyToOne(() => Estado)
  @JoinColumn({ name: 'estados_id' })
  estado: Estado;
}
