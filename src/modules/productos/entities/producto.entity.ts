import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { Estado } from '../../estados/entities/estado.entity';
import { Tienda } from '../../tiendas/entities/tienda.entity';
import { Usuario } from '../../usuarios/entities/usuario.entity';
import { ImgProducto } from '../../img-productos/entities/img-producto.entity';

@Entity('productos')
export class Producto {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 45 })
  nombre: string;

  @Column({ length: 45 })
  descripcion: string;

  @Column({ type: 'decimal', precision: 15, scale: 2 })
  precio: number;

  @Column({ type: 'int' })
  stock: number;

  @ManyToOne(() => Estado, (estado) => estado.productos)
  @JoinColumn({ name: 'estados_id' })
  estado: Estado;

  @ManyToOne(() => Tienda, (tienda) => tienda.productos)
  @JoinColumn({ name: 'tiendas_id' })
  tienda: Tienda;

  @ManyToOne(() => Usuario, (usuario) => usuario.productos)
  @JoinColumn({ name: 'usuarios_id' })
  usuario: Usuario;

  @OneToMany(() => ImgProducto, (img) => img.producto, { cascade: true })
  imagenes: ImgProducto[];

}
