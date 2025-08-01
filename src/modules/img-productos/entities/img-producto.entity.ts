import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Producto } from '../../productos/entities/producto.entity';

@Entity('img_productos')
export class ImgProducto {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 45 })
  url: string;

  @ManyToOne(() => Producto, producto => producto.imagenes, { onDelete: 'CASCADE' })
  producto: Producto;
}
