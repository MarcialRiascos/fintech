// src/modules/orden-compra/entities/orden-compra.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { Usuario } from '../../usuarios/entities/usuario.entity';
import { Tienda } from '../../tiendas/entities/tienda.entity';
import { Estado } from '../../estados/entities/estado.entity';
import { ProductoOrdenCompra } from '../../producto-orden-compra/entities/producto-orden-compra.entity';
import { Cuota } from 'src/modules/cuotas/entities/cuota.entity';
import { Pago } from 'src/modules/pagos/entities/pago.entity';

@Entity('orden_compra')
export class OrdenCompra {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('decimal', { precision: 15, scale: 2 })
  monto: number;

  @Column('int')
  cuotas: number;

  @ManyToOne(() => Usuario)
  @JoinColumn({ name: 'usuarios_id' })
  usuario: Usuario;

  @ManyToOne(() => Tienda)
  @JoinColumn({ name: 'tiendas_id' })
  tienda: Tienda;

  @ManyToOne(() => Estado)
  @JoinColumn({ name: 'estados_id' })
  estado: Estado;

  @OneToMany(() => Cuota, cuota => cuota.orden)
  cuotasGeneradas: Cuota[];

  // 👉 Relación inversa con pagos
  @OneToMany(() => Pago, pago => pago.orden)
  pagos: Pago[];

  @OneToMany(() => ProductoOrdenCompra, poc => poc.ordenCompra, { cascade: true })
  productos: ProductoOrdenCompra[];
}
