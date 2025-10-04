// src/modules/cuentas-cobro/entities/cuenta-cobro.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { Tienda } from 'src/modules/tiendas/entities/tienda.entity';
import { Estado } from 'src/modules/estados/entities/estado.entity';
import { OrdenCompra } from 'src/modules/orden-compra/entities/orden-compra.entity';
import { BaseEntity } from 'src/common/entities/base.entity';

@Entity('cuentas_cobro')
export class CuentaCobro extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Tienda, (tienda) => tienda.id)
  @JoinColumn({ name: 'tiendas_id' })
  tienda: Tienda;

  @ManyToOne(() => Estado)
  @JoinColumn({ name: 'estados_id' })
  estado: Estado;

  @Column('decimal', { precision: 15, scale: 2, default: 0 })
  total: number;

  @Column({ type: 'date' })
  fecha_corte: Date;

  @Column({ type: 'int' })
  mes: number;

  @Column({ type: 'int' })
  anio: number;

  @OneToMany(() => OrdenCompra, (orden) => orden.cuentaCobro)
  ordenes: OrdenCompra[];
}
