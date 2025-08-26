import { Column, Entity, ManyToOne, PrimaryGeneratedColumn, JoinColumn, OneToMany } from 'typeorm';
import { Usuario } from 'src/modules/usuarios/entities/usuario.entity';
import { Estado } from 'src/modules/estados/entities/estado.entity';
import { Producto } from '../../productos/entities/producto.entity';
import { ImgTienda } from '../../img-tiendas/entities/img-tienda.entity';
import { BaseEntity } from '../../../common/entities/base.entity';

@Entity('tiendas')
export class Tienda extends BaseEntity {
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
  barrio: string;

  @Column({ length: 100 })
  direccion: string;

  @Column({ length: 20 })
  telefono_uno: string;

  @Column('decimal', { precision: 15, scale: 2 })
  porcentaje: number;

  @ManyToOne(() => Estado)
  @JoinColumn({ name: 'estados_id' })
  estado: Estado;

  @ManyToOne(() => Usuario)
  @JoinColumn({ name: 'usuarios_id' }) // Representante
  representante: Usuario;

  @ManyToOne(() => Usuario)
  @JoinColumn({ name: 'usuarios_id1' }) // Asignado por
  asignadoPor: Usuario;

  @OneToMany(() => Producto, producto => producto.tienda)
  productos: Producto[];

  @OneToMany(() => ImgTienda, imgTienda => imgTienda.tienda)
  imagenes: ImgTienda[];
}
