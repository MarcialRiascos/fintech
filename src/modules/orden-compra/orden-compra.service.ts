import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OrdenCompra } from './entities/orden-compra.entity';
import { CreateOrdenCompraDto } from './dto/create-orden-compra.dto';
import { ProductoOrdenCompra } from '../producto-orden-compra/entities/producto-orden-compra.entity';

@Injectable()
export class OrdenCompraService {
  constructor(
    @InjectRepository(OrdenCompra)
    private readonly ordenCompraRepo: Repository<OrdenCompra>,

    @InjectRepository(ProductoOrdenCompra)
    private readonly productoOrdenCompraRepo: Repository<ProductoOrdenCompra>,
  ) {}

  /**
   * Crear nueva orden de compra con sus productos
   */
  async create(dto: CreateOrdenCompraDto) {
    // 🆕 Crear instancia de orden
    const nuevaOrden = this.ordenCompraRepo.create({
      monto: dto.monto,
      cuotas: dto.cuotas,
      usuario: { id: dto.usuarios_id },
      tienda: { id: dto.tiendas_id },
      estado: { id: 11 },
    });

    // 💾 Guardar orden primero
    const ordenGuardada = await this.ordenCompraRepo.save(nuevaOrden);

    // 📦 Guardar productos relacionados
    const productos = dto.productos.map(p =>
      this.productoOrdenCompraRepo.create({
        producto: { id: p.productos_id },
        ordenCompra: { id: ordenGuardada.id },
        precio_tienda: p.precio_tienda,
        precio_senda: p.precio_senda,
        cantidad: p.cantidad,
        estado: { id: p.estados_id },
      }),
    );

    await this.productoOrdenCompraRepo.save(productos);

    // 🔄 Traer la orden completa con relaciones
    return this.ordenCompraRepo.findOne({
      where: { id: ordenGuardada.id },
      relations: ['usuario', 'tienda', 'estado', 'productos', 'productos.producto'],
    });
  }

  /**
   * Obtener todas las órdenes de compra
   */
  async findAll() {
    return this.ordenCompraRepo.find({
      relations: ['usuario', 'tienda', 'estado', 'productos', 'productos.producto'],
    });
  }

  /**
   * Obtener una orden por ID
   */
  async findOne(id: number) {
    const orden = await this.ordenCompraRepo.findOne({
      where: { id },
      relations: ['usuario', 'tienda', 'estado', 'productos', 'productos.producto'],
    });

    if (!orden) {
      throw new NotFoundException(`Orden de compra con ID ${id} no encontrada`);
    }

    return orden;
  }

async consultarOrdenesPorRol(usuarioId: number, rol: string) {
  if (rol === 'Cliente') {
    // Cliente
    return this.ordenCompraRepo.find({
      where: { usuario: { id: usuarioId } },
      relations: ['usuario', 'tienda', 'estado', 'productos', 'productos.producto'],
    });
  }

  if (rol === 'Representante') {
    // Representante
    return this.ordenCompraRepo
      .createQueryBuilder('orden')
      .leftJoinAndSelect('orden.usuario', 'usuario')
      .leftJoinAndSelect('orden.tienda', 'tienda')
      .leftJoinAndSelect('orden.estado', 'estado')
      .leftJoinAndSelect('orden.productos', 'productos')
      .leftJoinAndSelect('productos.producto', 'producto')
      .where('tienda.representante.id = :usuarioId', { usuarioId })
      .getMany();
  }

  throw new Error(`Rol no soportado para la consulta de órdenes: ${rol}`);
}



  /**
   * Eliminar una orden de compra
   */
  async remove(id: number) {
    const orden = await this.findOne(id);
    return this.ordenCompraRepo.remove(orden);
  }
}
