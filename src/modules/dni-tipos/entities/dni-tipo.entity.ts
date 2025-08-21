// src/modules/dni-tipos/entities/dni-tipo.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { Usuario } from '../../usuarios/entities/usuario.entity';


@Entity('dni_tipos')
export class DniTipo extends BaseEntity {
  @PrimaryGeneratedColumn({ unsigned: true })
  id: number;

  @Column({ name: 'dni_tipos', type: 'varchar', length: 45 })
  nombre: string;

   @OneToMany(() => Usuario, (usuario) => usuario.dniTipo)
  usuarios: Usuario[];
}