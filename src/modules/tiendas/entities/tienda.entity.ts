import { Column, Entity, ManyToOne, PrimaryGeneratedColumn, JoinColumn, OneToMany } from 'typeorm';
import { Usuario } from 'src/modules/usuarios/entities/usuario.entity';
import { Estado } from 'src/modules/estados/entities/estado.entity';
import { Producto } from '../../productos/entities/producto.entity';

@Entity('tiendas')
export class Tienda {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  nombre: string;

  @Column({ length: 100 })
  descripcion: string;

  @Column({ length: 45 })
  nit: string;

  @Column()
  dv: number;

  @Column({ length: 45 })
  nacionalidad: string;

  @Column({ length: 45 })
  codigo_departamento: string;

  @Column({ length: 45 })
  departamento: string;

  @Column({ length: 45 })
  codigo_municipio: string;

  @Column({ length: 45 })
  municipio: string;

  @Column({ length: 45 })
  via_principal_clave: string;

  @Column({ length: 45 })
  via_principal_valor: string;

  @Column({ length: 45 })
  via_secundaria_clave: string;

  @Column({ length: 45 })
  via_secundaria_valor: string;

  @Column({ length: 45 })
  tipo_unidad_uno_clave: string;

  @Column({ length: 45 })
  tipo_unidad_uno_valor: string;

  @Column({ length: 45 })
  tipo_unidad_dos_clave: string;

  @Column({ length: 45 })
  tipo_unidad_dos_valor: string;

  @Column({ length: 45 })
  barrio: string;

  @Column({ length: 45 })
  latitud: string;

  @Column({ length: 45 })
  longitud: string;

  @Column({ length: 45 })
  direccion: string;

  @Column({ length: 45 })
  telefono_uno: string;

  @Column({ length: 45 })
  telefono_dos: string;

  @Column({ length: 45 })
  telefono_tres: string;

  @ManyToOne(() => Estado)
  @JoinColumn({ name: 'estados_id' })
  estado: Estado;

  @ManyToOne(() => Usuario)
  @JoinColumn({ name: 'representante_id' }) // Representante
  representante: Usuario;

  @ManyToOne(() => Usuario)
  @JoinColumn({ name: 'asignado_por_id' }) // Asignado por
  asignadoPor: Usuario;

  @OneToMany(() => Producto, producto => producto.usuario)
  productos: Producto[];
}
