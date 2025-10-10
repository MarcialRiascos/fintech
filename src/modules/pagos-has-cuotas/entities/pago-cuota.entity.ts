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
import { ApiProperty } from '@nestjs/swagger';


@Entity('pagos_has_cuotas')
export class PagoCuota extends BaseEntity {
  @ApiProperty({
    description: 'Identificador único del registro del pago-cuota.',
    example: 1,
  })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    description: 'Monto del pago aplicado a la cuota específica.',
    example: 2500.75,
  })
  @Column('decimal', { precision: 15, scale: 2 })
  monto_aplicado: number;

  @ApiProperty({
    description: 'Pago asociado a esta cuota (relación con la entidad Pago).',
    type: () => Pago,
  })
  @ManyToOne(() => Pago, pago => pago.cuotas, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'pago_id' })
  pago: Pago;

  @ApiProperty({
    description: 'Cuota a la que se aplica este pago (relación con la entidad Cuota).',
    type: () => Cuota,
  })
  @ManyToOne(() => Cuota, cuota => cuota.pagos, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'cuota_id' })
  cuota: Cuota;
}
