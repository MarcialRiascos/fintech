import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Usuario } from '../../usuarios/entities/usuario.entity';
import { Estado } from '../../estados/entities/estado.entity';
import { BaseEntity } from '../../../common/entities/base.entity';

@Entity('creditos')
export class Credito extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 45, nullable: false })
  codigo: string;

  @Column('decimal', { precision: 15, scale: 2, nullable: false })
  monto: number;

  @Column('decimal', { precision: 15, scale: 2, nullable: false })
  cuota_pago: number;

  /**
   * Usuario que recibe el crédito (beneficiario)
   */
  @ManyToOne(() => Usuario, usuario => usuario.creditosRecibidos)
  @JoinColumn({ name: 'cliente_id' })
  cliente: Usuario;

  /**
   * Usuario que asigna el crédito
   */
  @ManyToOne(() => Usuario, usuario => usuario.creditosAsignados)
  @JoinColumn({ name: 'asignado_por_id' })
  asignadoPor: Usuario;

  /**
   * Estado del crédito
   */
  @ManyToOne(() => Estado)
  @JoinColumn({ name: 'estado_id' })
  estado: Estado;
}
