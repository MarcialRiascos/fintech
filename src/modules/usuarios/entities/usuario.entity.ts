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
import { Estrato } from '../../estratos/entities/estrato.entity';
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

  @ManyToOne(() => DniTipo)
  @JoinColumn({ name: 'dni_tipos_id' })
  dniTipo: DniTipo;

  @Column('varchar', { length: 100, nullable: true })
  dni: string | null;

  @Column('varchar', { length: 100, nullable: true })
  contrato: string | null;

  @Column('varchar', { length: 100, nullable: true })
  nacionalidad: string | null;

  @Column('varchar', { length: 100, nullable: true })
  codigo_departamento: string | null;

  @Column('varchar', { length: 100, nullable: true })
  departamento: string | null;

  @Column('varchar', { length: 100, nullable: true })
  codigo_municipio: string | null;

  @Column('varchar', { length: 100, nullable: true })
  municipio: string | null;

  @Column('varchar', { length: 100, nullable: true })
  via_principal_clave: string | null;

  @Column('varchar', { length: 100, nullable: true })
  via_principal_valor: string | null;

  @Column('varchar', { length: 100, nullable: true })
  via_secundaria_clave: string | null;

  @Column('varchar', { length: 100, nullable: true })
  via_secundaria_valor: string | null;

  @Column('varchar', { length: 100, nullable: true })
  tipo_unidad_uno_clave: string | null;

  @Column('varchar', { length: 100, nullable: true })
  tipo_unidad_uno_valor: string | null;

  @Column('varchar', { length: 100, nullable: true })
  tipo_unidad_dos_clave: string | null;

  @Column('varchar', { length: 100, nullable: true })
  tipo_unidad_dos_valor: string | null;

  @Column('varchar', { length: 100, nullable: true })
  barrio: string | null;

  @Column('varchar', { length: 100, nullable: true })
  latitud: string | null;

  @Column('varchar', { length: 100, nullable: true })
  longitud: string | null;

  @Column('varchar', { length: 100, nullable: true })
  direccion: string | null;

  @Column('varchar', { length: 100, nullable: true })
  telefono_uno: string | null;

  @Column('varchar', { length: 100, nullable: true })
  telefono_dos: string | null;

  @Column('varchar', { length: 100, nullable: true })
  telefono_tres: string | null;

  @Column({ type: 'text', nullable: true })
  @Exclude()
  password: string | null;

  @Column('varchar', { length: 100, nullable: true })
  email: string | null;

  @Column('varchar', { length: 100, nullable: true })
  fecha_nacimiento: Date | null;

  @Column({ type: 'text', nullable: true })
  anexo: string | null;

  @Column({ default: false })
  emailVerificado: boolean;

  @Column('varchar', {
    name: 'reset_password_token',
    length: 255,
    nullable: true,
  })
  resetPasswordToken?: string | null;

  @Column('datetime', { name: 'reset_password_expires', nullable: true })
  resetPasswordExpires?: Date | null;

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

  @OneToMany(() => Credito, credito => credito.cliente)
creditosRecibidos: Credito[];

@OneToMany(() => Credito, credito => credito.asignadoPor)
creditosAsignados: Credito[];

@OneToMany(() => Producto, producto => producto.usuario)
productos: Producto[];

}
