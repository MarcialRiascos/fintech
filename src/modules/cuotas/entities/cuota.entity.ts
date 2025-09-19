import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { OrdenCompra } from '../../orden-compra/entities/orden-compra.entity';
import { Estado } from '../../estados/entities/estado.entity';
import { PagoCuota } from '../../pagos-has-cuotas/entities/pago-cuota.entity';
import { BaseEntity } from 'src/common/entities/base.entity';

@Entity('cuotas')
export class Cuota extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  numero_cuota: number;

  @Column('decimal', { precision: 15, scale: 2 })
  valor_cuota: number;

  @Column('decimal', { precision: 15, scale: 2 })
  saldo_cuota: number;

  @Column({ type: 'date' })
  fecha_vencimiento: Date;

  @ManyToOne(() => OrdenCompra, orden => orden.cuotas)
  @JoinColumn({ name: 'orden_compra_id' })
  orden: OrdenCompra;

  @ManyToOne(() => Estado)
  @JoinColumn({ name: 'estado_id' })
  estado: Estado;

  @OneToMany(() => PagoCuota, pagoCuota => pagoCuota.cuota)
  pagos: PagoCuota[];
}
