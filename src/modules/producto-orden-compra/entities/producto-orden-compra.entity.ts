// src/modules/orden-compra/entities/producto-orden-compra.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Producto } from '../../productos/entities/producto.entity';
import { OrdenCompra } from '../../orden-compra/entities/orden-compra.entity';
import { Estado } from '../../estados/entities/estado.entity';
import { BaseEntity } from 'src/common/entities/base.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity('productos_has_orden_compra')
export class ProductoOrdenCompra extends BaseEntity {
  @ApiProperty({
    example: 1,
    description: 'Identificador único del producto en la orden de compra.',
  })
  @PrimaryGeneratedColumn()
  id: number;

   @ApiProperty({
    type: () => Producto,
    description: 'Producto vinculado a la orden de compra.',
  })
  @ManyToOne(() => Producto)
  @JoinColumn({ name: 'productos_id' })
  producto: Producto;

  @ApiProperty({
    type: () => OrdenCompra,
    description:
      'Orden de compra en la que se encuentra este producto. Una orden puede tener múltiples productos asociados.',
  })
  @ManyToOne(() => OrdenCompra, orden => orden.productos)
  @JoinColumn({ name: 'orden_compra_id' })
  ordenCompra: OrdenCompra;

  @ApiProperty({
    example: 125000.5,
    description: 'Precio asignado por la tienda para el producto.',
    type: 'number',
    format: 'decimal',
  })
  @Column('decimal', { precision: 15, scale: 2 })
  precio_tienda: number;

  @ApiProperty({
    example: 115000.75,
    description: 'Precio definido por la plataforma Senda.',
    type: 'number',
    format: 'decimal',
  })
  @Column('decimal', { precision: 15, scale: 2 })
  precio_senda: number;

   @ApiProperty({
    example: 3,
    description: 'Cantidad del producto solicitada en la orden.',
    type: 'number',
    format: 'decimal',
  })
  @Column('decimal', { precision: 8, scale: 2 })
  cantidad: number;

    @ApiProperty({
    type: () => Estado,
    description:
      'Estado actual del producto dentro de la orden (por ejemplo: Pendiente, Enviado, Entregado).',
  })
  @ManyToOne(() => Estado)
  @JoinColumn({ name: 'estados_id' })
  estado: Estado;
}
