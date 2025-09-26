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
import { BaseEntity } from 'src/common/entities/base.entity';
import { Usuario } from 'src/modules/usuarios/entities/usuario.entity';

@Entity('pagos')
export class Pago extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('decimal', { precision: 15, scale: 2 })
  monto_pagado: number;

  @Column({ length: 100, nullable: true })
  referencia: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  fecha_pago: Date;

  @ManyToOne(() => OrdenCompra, (orden) => orden.pagos)
  @JoinColumn({ name: 'orden_compra_id' })
  orden: OrdenCompra;

  @ManyToOne(() => Usuario, (usuario) => usuario.pagosRegistrados) // 👈 Apunta a la nueva propiedad
  @JoinColumn({ name: 'asignado_por_id' })
  asignadoPor: Usuario;

  @OneToMany(() => PagoCuota, (pagoCuota) => pagoCuota.pago)
  cuotas: PagoCuota[];
}
