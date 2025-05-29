// src/modules/usuarios/entities/usuario.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, } from 'typeorm';
import { DniTipo } from '../../dni-tipos/entities/dni-tipo.entity';
import { Estado } from '../../estados/entities/estado.entity';
import { Sexo } from '../../sexos/entities/sexo.entity';
import { Estrato } from '../../estratos/entities/estrato.entity';
import { Rol } from '../../roles/entities/rol.entity';
import { BaseEntity } from '../../../common/entities/base.entity';

@Entity('usuarios')
export class Usuario extends BaseEntity {
  @PrimaryGeneratedColumn({ unsigned: true })
  id: number;

  @Column({ nullable: true })
  nombre: string;

  @Column({ nullable: true })
  apellido: string;

  @ManyToOne(() => DniTipo)
  @JoinColumn({ name: 'dni_tipos_id' })
  dniTipo: DniTipo;

  @Column({ nullable: true })
  dni: string;

  @Column()
  contrato: string;

  @Column({ nullable: true })
  nacionalidad: string;

  @Column({ nullable: true })
  codigo_departamento: string;

  @Column({ nullable: true })
  departamento: string;

  @Column({ nullable: true })
  codigo_municipio: string;

  @Column({ nullable: true })
  municipio: string;

  @Column({ nullable: true })
  via_principal_clave: string;

  @Column({ nullable: true })
  via_principal_valor: string;

  @Column({ nullable: true })
  via_secundaria_clave: string;

  @Column({ nullable: true })
  via_secundaria_valor: string;

  @Column({ nullable: true })
  tipo_unidad_uno_clave: string;

  @Column({ nullable: true })
  tipo_unidad_uno_valor: string;

  @Column({ nullable: true })
  tipo_unidad_dos_clave: string;

  @Column({ nullable: true })
  tipo_unidad_dos_valor: string;

  @Column({ nullable: true })
  barrio: string;

  @Column({ nullable: true })
  latitud: string;

  @Column({ nullable: true })
  longitud: string;

  @Column({ nullable: true })
  direccion: string;

  @Column({ nullable: true })
  telefono_uno: string;

  @Column({ nullable: true })
  telefono_dos: string;

  @Column({ nullable: true })
  Telefono_tres: string;

  @Column({ type: 'text', nullable: true })
  password: string;

  @Column({ nullable: true })
  email: string;

  @Column({ nullable: true })
  fecha_nacimiento: Date;

  @Column({ type: 'text', nullable: true })
  anexo: string;

  @ManyToOne(() => Estado)
  @JoinColumn({ name: 'estados_id' })
  estado: Estado;

  @ManyToOne(() => Sexo)
  @JoinColumn({ name: 'sexos_id' })
  sexo: Sexo;

  @ManyToOne(() => Estrato)
  @JoinColumn({ name: 'estratos_id' })
  estrato: Estrato;

  @ManyToOne(() => Rol)
  @JoinColumn({ name: 'roles_id' })
  rol: Rol;
}
