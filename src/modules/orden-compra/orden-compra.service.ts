import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OrdenCompra } from './entities/orden-compra.entity';
import { CreateOrdenCompraDto } from './dto/create-orden-compra.dto';
import { ProductoOrdenCompra } from '../producto-orden-compra/entities/producto-orden-compra.entity';
import { UpdateOrdenCompraDto } from './dto/update-orden-compra.dto';
import { Producto } from '../productos/entities/producto.entity';
import { Estado } from '../estados/entities/estado.entity';
import { Credito } from '../creditos/entities/credito.entity';
import { Cuota } from '../cuotas/entities/cuota.entity';

@Injectable()
export class OrdenCompraService {
  constructor(
    @InjectRepository(OrdenCompra)
    private readonly ordenCompraRepo: Repository<OrdenCompra>,

    @InjectRepository(ProductoOrdenCompra)
    private readonly productoOrdenCompraRepo: Repository<ProductoOrdenCompra>,

    @InjectRepository(Producto)
    private readonly productoRepo: Repository<Producto>,

    @InjectRepository(Credito)
    private readonly creditoRepo: Repository<Credito>,

    @InjectRepository(Cuota)
    private readonly cuotaRepo: Repository<Cuota>,
  ) {}

  /**
   * Crear nueva orden de compra con sus productos
   */
  async create(dto: CreateOrdenCompraDto) {
    // 🧮 Calcular monto_senda automáticamente
    const monto_senda = dto.productos.reduce(
      (acc, p) => acc + p.precio_senda * p.cantidad,
      0,
    );

    // 🆕 Crear instancia de orden
    const nuevaOrden = this.ordenCompraRepo.create({
      monto: dto.monto, // sigue viniendo del DTO
      monto_senda, // se calcula automáticamente
      cuotas: dto.cuotas,
      usuario: { id: dto.usuarios_id },
      tienda: { id: dto.tiendas_id },
      estado: { id: 11 },
    });

    // 💾 Guardar orden primero
    const ordenGuardada = await this.ordenCompraRepo.save(nuevaOrden);

    // 📦 Guardar productos relacionados
    const productos = dto.productos.map((p) =>
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

    // 🔄 Respuesta
    return { message: 'Orden de compra creada exitosamente' };
  }

  /**
   * Obtener todas las órdenes de compra
   */
 async findAll() {
  const ordenes = await this.ordenCompraRepo.find({
    relations: [
      'usuario',
      'tienda',
      'estado',
      'productos',
      'productos.producto',
      'cuotasGeneradas',
      'cuotasGeneradas.estado',
    ],
    order: { createdAt: 'DESC' },
  });

  const data = ordenes.map((orden) => ({
   id: orden.id,
    monto: orden.monto,
    monto_senda: orden.monto_senda,
    cuotas: orden.cuotas,
    estado: orden.estado?.estado,
    tienda: orden.tienda?.nombre,
    cuotasGeneradas: orden.cuotasGeneradas?.map((cuota) => ({
      numero_cuota: cuota.numero_cuota,
      valor_cuota: cuota.valor_cuota,
      saldo_cuota: cuota.saldo_cuota,
      fecha_vencimiento: cuota.fecha_vencimiento,
      estado: cuota.estado?.estado,
      createdAt: cuota.createdAt,
      updatedAt: cuota.updatedAt,
    })) || [],
    productos: orden.productos?.map((p) => ({
      nombre: p.producto?.nombre,
      cantidad: p.cantidad,
      precio_tienda: p.precio_tienda,
    })) || [],
     createdAt: orden.createdAt,
    updatedAt: orden.updatedAt
  }));

  return {
    message: 'Órdenes de compra obtenidas exitosamente',
    data,
  };
}


  /**
   * Obtener una orden por ID
   */
async findOne(id: number) {
  const orden = await this.ordenCompraRepo.findOne({
    where: { id },
    relations: [
      'usuario',
      'tienda',
      'estado',
      'productos',
      'productos.producto',
      'cuotasGeneradas',
      'cuotasGeneradas.estado',
    ],
  });

  if (!orden) {
    throw new NotFoundException(`Orden de compra con ID ${id} no encontrada`);
  }

  const data = {
   id: orden.id,
    monto: orden.monto,
    monto_senda: orden.monto_senda,
    cuotas: orden.cuotas,
    estado: orden.estado?.estado,
    tienda: orden.tienda?.nombre,
    cuotasGeneradas: orden.cuotasGeneradas?.map((cuota) => ({
      numero_cuota: cuota.numero_cuota,
      valor_cuota: cuota.valor_cuota,
      saldo_cuota: cuota.saldo_cuota,
      fecha_vencimiento: cuota.fecha_vencimiento,
      estado: cuota.estado?.estado,
      createdAt: cuota.createdAt,
      updatedAt: cuota.updatedAt,
    })) || [],
    productos: orden.productos?.map((p) => ({
      nombre: p.producto?.nombre,
      cantidad: p.cantidad,
      precio_tienda: p.precio_tienda,
    })) || [],
    createdAt: orden.createdAt,
      updatedAt: orden.updatedAt,
  };

  return {
    message: 'Orden de compra encontrada exitosamente',
    data,
  };
}


  async consultarOrdenesPorRol(usuarioId: number, rol: string) {
  let ordenes: any[] = [];

  if (rol === 'Cliente') {
    // 🧍 Cliente
    ordenes = await this.ordenCompraRepo.find({
      where: { usuario: { id: usuarioId } },
      relations: [
        'estado',
        'tienda',
        'productos',
        'productos.producto',
        'cuotasGeneradas',
        'cuotasGeneradas.estado',
      ],
      order: { createdAt: 'DESC' },
    });
  } else if (rol === 'Representante') {
    // 🏪 Representante
    ordenes = await this.ordenCompraRepo
      .createQueryBuilder('orden')
      .leftJoinAndSelect('orden.estado', 'estado')
      .leftJoinAndSelect('orden.tienda', 'tienda')
      .leftJoinAndSelect('orden.productos', 'productos')
      .leftJoinAndSelect('productos.producto', 'producto')
      .leftJoinAndSelect('orden.cuotasGeneradas', 'cuotasGeneradas')
      .leftJoinAndSelect('cuotasGeneradas.estado', 'estadoCuota')
      .where('tienda.representante.id = :usuarioId', { usuarioId })
      .orderBy('orden.createdAt', 'DESC')
      .getMany();
  } else {
    throw new Error(`Rol no soportado para la consulta de órdenes: ${rol}`);
  }

  // 🧩 Transformamos los datos al formato deseado
  const data = ordenes.map((orden) => ({
    id: orden.id,
    monto: orden.monto,
    monto_senda: orden.monto_senda,
    cuotas: orden.cuotas,
    estado: orden.estado?.estado,
    tienda: orden.tienda?.nombre,
    cuotasGeneradas: orden.cuotasGeneradas?.map((cuota) => ({
      numero_cuota: cuota.numero_cuota,
      valor_cuota: cuota.valor_cuota,
      saldo_cuota: cuota.saldo_cuota,
      fecha_vencimiento: cuota.fecha_vencimiento,
      estado: cuota.estado?.estado,
      createdAt: cuota.createdAt,
      updatedAt: cuota.updatedAt,
    })) || [],
    productos: orden.productos?.map((p) => ({
      nombre: p.producto?.nombre,
      cantidad: p.cantidad,
      precio_tienda: p.precio_tienda,
    })) || [],
    createdAt: orden.createdAt,
      updatedAt: orden.updatedAt,
  }));

  return {
    message: 'Órdenes consultadas exitosamente',
    data,
  };
}


  async update(id: number, dto: UpdateOrdenCompraDto) {
    const orden = await this.ordenCompraRepo.findOne({
      where: { id },
      relations: [
        'estado',
        'productos',
        'productos.producto',
        'productos.estado',
        'usuario',
      ],
    });

    if (!orden) {
      throw new NotFoundException(`Orden de compra con ID ${id} no encontrada`);
    }

    const estadoAnterior = orden.estado?.id;

    // 🔹 Cambiar estado de la orden si viene en el DTO
    if (dto.estadoId) {
      orden.estado = { id: dto.estadoId } as Estado;
    }

    const esPendiente = orden.estado?.id === 11;

    // 🔹 Solo si está pendiente permitimos modificar productos
    if (dto.productos && esPendiente) {
      for (const p of dto.productos) {
        if (p.id) {
          const existente = orden.productos.find((det) => det.id === p.id);
          if (existente) {
            if (p.cantidad !== undefined) existente.cantidad = p.cantidad;
            if (p.precio_tienda !== undefined)
              existente.precio_tienda = p.precio_tienda;
            if (p.precio_senda !== undefined)
              existente.precio_senda = p.precio_senda;
            if (p.estadoId) existente.estado = { id: p.estadoId } as Estado;
          }
        } else {
          const nuevo = this.productoOrdenCompraRepo.create({
            producto: { id: p.productoId } as Producto,
            ordenCompra: { id: orden.id } as OrdenCompra,
            cantidad: p.cantidad ?? 1,
            precio_tienda: p.precio_tienda ?? 0,
            precio_senda: p.precio_senda ?? 0,
            estado: p.estadoId ? ({ id: p.estadoId } as Estado) : undefined,
          });
          orden.productos.push(nuevo);
        }
      }
    } else if (dto.productos && !esPendiente) {
      throw new BadRequestException(
        'Solo se pueden modificar productos si la orden está en estado pendiente',
      );
    }

    // 🔹 Recalcular el monto total con precio_tienda
    orden.monto = orden.productos.reduce((total, det) => {
      const precio = det.precio_tienda ?? 0;
      return total + Number(det.cantidad) * Number(precio);
    }, 0);

    // 🔹 Recalcular el monto total con precio_senda
    orden.monto_senda = orden.productos.reduce((total, det) => {
      const precio = det.precio_senda ?? 0;
      return total + Number(det.cantidad) * Number(precio);
    }, 0);

    // 🔹 Si el estado cambió de Pendiente (11) → Confirmado (12)
    if (estadoAnterior === 11 && orden.estado?.id === 12) {
      // 🔽 1. Descontar stock
      for (const detalle of orden.productos) {
        const producto = await this.productoRepo.findOne({
          where: { id: detalle.producto.id },
        });
        if (!producto) {
          throw new NotFoundException(
            `Producto con ID ${detalle.producto.id} no encontrado`,
          );
        }

        if (producto.stock < detalle.cantidad) {
          throw new BadRequestException(
            `No hay suficiente stock para el producto ${producto.nombre} (ID ${producto.id})`,
          );
        }

        producto.stock -= detalle.cantidad;
        await this.productoRepo.save(producto);
      }

      // 🔽 2. Actualizar crédito del usuario
      const credito = await this.creditoRepo.findOne({
        where: {
          cliente: { id: orden.usuario.id },
          estado: { id: 1 },
        },
        relations: ['cliente', 'estado'],
      });

      if (!credito) {
        throw new NotFoundException(
          `El usuario con ID ${orden.usuario.id} no tiene crédito activo`,
        );
      }

      const saldoActual = Number(credito.saldo);
      const deudaActual = Number(credito.deuda);
      const montoOrden = Number(orden.monto);

      if (saldoActual < montoOrden) {
        throw new BadRequestException(
          `Saldo insuficiente en crédito. Saldo: ${saldoActual}, requerido: ${montoOrden}`,
        );
      }

      credito.saldo = saldoActual - montoOrden;
      credito.deuda = deudaActual + montoOrden;

      await this.creditoRepo.save(credito);

      // 🔽 3. Crear cuotas
      const numeroCuotas = orden.cuotas; // número de cuotas definido en la orden
      const valorCuota = montoOrden / numeroCuotas;
      const hoy = new Date();

      const cuotas: Cuota[] = [];
      for (let i = 1; i <= numeroCuotas; i++) {
        const cuota = this.cuotaRepo.create({
          numero_cuota: i,
          valor_cuota: valorCuota,
          saldo_cuota: valorCuota,
          fecha_vencimiento: new Date(
            hoy.getFullYear(),
            hoy.getMonth() + i,
            28,
          ), // cada mes
          estado: { id: 1 } as Estado, // 👈 1 = Pendiente
          orden: { id: orden.id } as OrdenCompra,
        });
        cuotas.push(cuota);
      }

      await this.cuotaRepo.save(cuotas);
    }

    await this.ordenCompraRepo.save(orden);

    // 🔄 Devolver con todas sus relaciones actualizadas
     return {
        message: 'Orden de compra actualizada correctamente',
     };
  }

  /**
   * Eliminar una orden de compra
   */
  /* async remove(id: number) {
    const orden = await this.findOne(id);
    return this.ordenCompraRepo.remove(orden);
  } */
}
