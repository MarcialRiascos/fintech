import { Column, Entity, ManyToOne, PrimaryGeneratedColumn, JoinColumn, OneToMany } from 'typeorm';
import { Usuario } from 'src/modules/usuarios/entities/usuario.entity';
import { Estado } from 'src/modules/estados/entities/estado.entity';
import { Producto } from '../../productos/entities/producto.entity';
import { ImgTienda } from '../../img-tiendas/entities/img-tienda.entity';
import { BaseEntity } from '../../../common/entities/base.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity('tiendas')
export class Tienda extends BaseEntity {
   @ApiProperty({
    example: 1,
    description: 'Identificador único de la tienda',
  })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    example: 'Tienda Central Senda',
    description: 'Nombre de la tienda o establecimiento comercial',
  })
  @Column({ length: 100 })
  nombre: string;

  @ApiProperty({
    example: 'Tienda principal con variedad de productos alimenticios',
    description: 'Descripción general de la tienda',
  })
  @Column({ length: 100 })
  descripcion: string;

  @ApiProperty({
    example: '901456789',
    description: 'Número de identificación tributaria (NIT) de la tienda',
  })
  @Column({ length: 45 })
  nit: string;

  @ApiProperty({
    example: 1,
    description: 'Dígito de verificación del NIT',
  })
  @Column()
  dv: number;

  @ApiProperty({
    example: 'Centro',
    description: 'Barrio o zona donde se encuentra la tienda',
  })
  @Column({ length: 45 })
  barrio: string;

  @ApiProperty({
    example: 'Cra 45 #12-45',
    description: 'Dirección física de la tienda',
  })
  @Column({ length: 100 })
  direccion: string;

  @ApiProperty({
    example: '+57 3124567890',
    description: 'Teléfono principal de contacto de la tienda',
  })
  @Column({ length: 20 })
  telefono_uno: string;

  @ApiProperty({
    example: 15.5,
    description: 'Porcentaje de comisión o margen asignado a la tienda',
  })
  @Column('decimal', { precision: 15, scale: 2 })
  porcentaje: number;

  @ApiProperty({
    description: 'Estado actual de la tienda (activa, inactiva, etc.)',
    type: () => Estado,
  })
  @ManyToOne(() => Estado)
  @JoinColumn({ name: 'estados_id' })
  estado: Estado;

  @ApiProperty({
    description: 'Usuario asignado como representante de la tienda',
    type: () => Usuario,
  })
  @ManyToOne(() => Usuario)
  @JoinColumn({ name: 'usuarios_id' }) // Representante
  representante: Usuario;

  @ApiProperty({
    description: 'Usuario que asignó o registró la tienda',
    type: () => Usuario,
  })
  @ManyToOne(() => Usuario)
  @JoinColumn({ name: 'usuarios_id1' }) // Asignado por
  asignadoPor: Usuario;

   @ApiProperty({
    description: 'Lista de productos asociados a la tienda',
    type: () => [Producto],
  })
  @OneToMany(() => Producto, producto => producto.tienda)
  productos: Producto[];

  @ApiProperty({
    description: 'Imágenes asociadas a la tienda (logos, fachada, etc.)',
    type: () => [ImgTienda],
  })
  @OneToMany(() => ImgTienda, imgTienda => imgTienda.tienda)
  imagenes: ImgTienda[];
}
