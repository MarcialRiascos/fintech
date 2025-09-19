import { BaseEntity } from 'src/common/entities/base.entity';
import { Cuota } from '../../cuotas/entities/cuota.entity';
import { Pago } from '../../pagos/entities/pago.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';


@Entity('pagos_has_cuotas')
export class PagoCuota extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('decimal', { precision: 15, scale: 2 })
  monto_aplicado: number;

  @ManyToOne(() => Pago, pago => pago.cuotas, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'pago_id' })
  pago: Pago;

  @ManyToOne(() => Cuota, cuota => cuota.pagos, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'cuota_id' })
  cuota: Cuota;
}
