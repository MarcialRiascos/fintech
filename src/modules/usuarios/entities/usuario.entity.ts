// src/modules/usuarios/entities/usuario.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { Exclude } from 'class-transformer';
import { DniTipo } from '../../dni-tipos/entities/dni-tipo.entity';
import { Estado } from '../../estados/entities/estado.entity';
import { Sexo } from '../../sexos/entities/sexo.entity';
import { Rol } from '../../roles/entities/rol.entity';
import { BaseEntity } from '../../../common/entities/base.entity';
import { Credito } from '../../creditos/entities/credito.entity';
import { Producto } from '../../productos/entities/producto.entity';

@Entity('usuarios')
export class Usuario extends BaseEntity {
  @PrimaryGeneratedColumn({ unsigned: true })
  id: number;

  @Column('varchar', { length: 100, nullable: true })
  nombre: string | null;

  @Column('varchar', { length: 100, nullable: true })
  apellido: string | null;

  @ManyToOne(() => DniTipo, { nullable: true })
  @JoinColumn({ name: 'dni_tipos_id' })
  dniTipo: DniTipo | null;

  @Column('varchar', { length: 100, nullable: true })
  dni: string | null;

  @Column('varchar', { length: 100, nullable: true })
  contrato: string | null;

  @Column('varchar', { length: 100, nullable: true })
  nacionalidad: string | null;

  @Column('varchar', { length: 100, nullable: true })
  barrio: string | null;

  @Column('varchar', { length: 100, nullable: true })
  direccion: string | null;

  @Column('varchar', { length: 100, nullable: true })
  telefono_uno: string | null;

  @Column({ type: 'text', nullable: true })
  @Exclude()
  password: string | null;

  @Column('varchar', { length: 100, nullable: true, unique: true })
  email: string | null;

  @Column({ type: 'date', nullable: true })
  fecha_nacimiento: Date | null;

  @Column('decimal', { precision: 15, scale: 2, nullable: true })
  mes: number | null;

  @Column('varchar', { length: 45, nullable: true })
  f_prim_act: string | null;

  @Column('varchar', { length: 45, nullable: true })
  f_ult_dx: string | null;

  @Column('varchar', { length: 45, nullable: true })
  f_ult_p: string | null;

  @Column('decimal', { precision: 15, scale: 2, nullable: true })
  ult_p: number | null;

  @Column('decimal', { precision: 15, scale: 2, nullable: true })
  saldo: number | null;

  @Column('int', { nullable: true })
  mora: number | null;

  @Column({ default: false })
  emailVerificado: boolean;

  @ManyToOne(() => Estado)
  @JoinColumn({ name: 'estados_id' })
  estado: Estado;

  @ManyToOne(() => Sexo)
  @JoinColumn({ name: 'sexos_id' })
  sexo: Sexo;

  @ManyToOne(() => Rol)
  @JoinColumn({ name: 'roles_id' })
  rol: Rol;

  @OneToMany(() => Credito, (credito) => credito.cliente)
  creditosRecibidos: Credito[];

  @OneToMany(() => Credito, (credito) => credito.asignadoPor)
  creditosAsignados: Credito[];

  @OneToMany(() => Producto, (producto) => producto.usuario)
  productos: Producto[];
}
