import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { OrdenCompra } from '../../orden-compra/entities/orden-compra.entity';
import { PagoCuota } from '../../pagos-has-cuotas/entities/pago-cuota.entity';

@Entity('pagos')
export class Pago {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('decimal', { precision: 15, scale: 2 })
  monto_pagado: number;

  @Column({ length: 100, nullable: true })
  referencia: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  fecha_pago: Date;

  @ManyToOne(() => OrdenCompra, orden => orden.pagos)
  @JoinColumn({ name: 'orden_compra_id' })
  orden: OrdenCompra;

  @OneToMany(() => PagoCuota, pagoCuota => pagoCuota.pago)
  cuotas: PagoCuota[];
  
}
