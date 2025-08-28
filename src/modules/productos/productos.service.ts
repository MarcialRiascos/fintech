import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Producto } from './entities/producto.entity';
import { CreateProductoDto } from './dto/create-producto.dto';
import { UpdateProductoDto } from './dto/update-producto.dto';
import { Usuario } from '../usuarios/entities/usuario.entity';
import { Estado } from '../estados/entities/estado.entity';
import { Tienda } from '../tiendas/entities/tienda.entity';

@Injectable()
export class ProductoService {
  constructor(
    @InjectRepository(Producto)
    private readonly productoRepo: Repository<Producto>,

    @InjectRepository(Usuario)
    private readonly usuarioRepo: Repository<Usuario>,

    @InjectRepository(Estado)
    private readonly estadoRepo: Repository<Estado>,

    @InjectRepository(Tienda)
    private readonly tiendaRepo: Repository<Tienda>,
  ) {}

  // Crear un nuevo producto
  // Cambia la firma de este método:
  async create(dto: CreateProductoDto, usuarioAsignadorId: number) {
    const [usuario, tienda, estado] = await Promise.all([
      this.usuarioRepo.findOne({ where: { id: dto.usuarios_id } }),
      this.tiendaRepo.findOne({ where: { id: dto.tiendas_id } }),
      this.estadoRepo.findOne({ where: { id: dto.estados_id } }),
    ]);

    if (!usuario) throw new BadRequestException('Usuario no válido');
    if (!tienda) throw new BadRequestException('Tienda no válida');
    if (!estado) throw new BadRequestException('Estado no válido');

    // 👇 Calcular precio_senda en base al porcentaje de la tienda
    const precio_senda =
      Number(dto.precio_tienda) -
      (Number(dto.precio_tienda) * Number(tienda.porcentaje)) / 100;

    // 👇 Asegurar que quede con 2 decimales
    const precio_senda_redondeado = Number(precio_senda.toFixed(2));

    const producto = this.productoRepo.create({
      ...dto,
      precio_senda: precio_senda_redondeado, // 👈 se asigna aquí
      usuario,
      tienda,
      estado,
    });

    const guardado = await this.productoRepo.save(producto);

    const completo = await this.productoRepo.findOne({
      where: { id: guardado.id },
      relations: ['tienda', 'estado', 'usuario', 'imagenes'],
    });

    if (!completo)
      throw new NotFoundException('Producto no encontrado después de guardar');

    return this.formatResponse(completo);
  }

  async findAll() {
    const productos = await this.productoRepo.find({
      relations: ['tienda', 'estado', 'usuario', 'imagenes'],
    });

    return productos.map(this.formatResponse);
  }

  // Obtener un producto por ID
  async findOne(id: number) {
    const producto = await this.productoRepo.findOne({
      where: { id },
      relations: ['tienda', 'estado', 'usuario', 'imagenes'],
    });

    if (!producto) throw new NotFoundException('Producto no encontrado');

    return this.formatResponse(producto);
  }

  // Actualizar un producto
  async update(id: number, dto: UpdateProductoDto) {
    const producto = await this.productoRepo.findOne({
      where: { id },
      relations: ['tienda', 'estado', 'usuario', 'imagenes'],
    });

    if (!producto) throw new NotFoundException('Producto no encontrado');

    if (dto.usuarios_id) {
      const usuario = await this.usuarioRepo.findOne({
        where: { id: dto.usuarios_id },
      });
      if (!usuario) throw new BadRequestException('Usuario no válido');
      producto.usuario = usuario;
    }

    if (dto.tiendas_id) {
      const tienda = await this.tiendaRepo.findOne({
        where: { id: dto.tiendas_id },
      });
      if (!tienda) throw new BadRequestException('Tienda no válida');
      producto.tienda = tienda;
    }

    if (dto.estados_id) {
      const estado = await this.estadoRepo.findOne({
        where: { id: dto.estados_id },
      });
      if (!estado) throw new BadRequestException('Estado no válido');
      producto.estado = estado;
    }

    // Mezclamos cambios
    this.productoRepo.merge(producto, dto);

    // Si se actualiza precio_tienda, recalculamos precio_senda
    if (dto.precio_tienda && producto.tienda) {
      const porcentaje = Number(producto.tienda.porcentaje) || 0;
      producto.precio_senda =
        Number(dto.precio_tienda) -
        (Number(dto.precio_tienda) * porcentaje) / 100;
    }

    const actualizado = await this.productoRepo.save(producto);

    const completo = await this.productoRepo.findOne({
      where: { id: actualizado.id },
      relations: ['tienda', 'estado', 'usuario', 'imagenes'],
    });

    if (!completo)
      throw new NotFoundException(
        'Producto no encontrado después de actualizar',
      );

    return this.formatResponse(completo);
  }

  // Eliminar un producto
  async remove(id: number) {
    const producto = await this.productoRepo.findOne({ where: { id } });
    if (!producto) throw new NotFoundException('Producto no encontrado');

    await this.productoRepo.remove(producto);

    return { mensaje: 'Producto eliminado correctamente' };
  }

  // Formatear respuesta
  private formatResponse(producto: Producto): any {
    return {
      id: producto.id,
      nombre: producto.nombre,
      descripcion: producto.descripcion,
      precio_tienda: producto.precio_tienda,
      precio_senda: producto.precio_senda,
      stock: producto.stock,
      tienda: {
        id: producto.tienda?.id,
        nombre: producto.tienda?.nombre,
      },
      estado: {
        id: producto.estado?.id,
        estado: producto.estado?.estado,
      },
      usuario: {
        id: producto.usuario?.id,
        nombre: producto.usuario?.nombre,
        apellido: producto.usuario?.apellido,
        dni: producto.usuario?.dni,
      },
      imagenes:
        producto.imagenes?.map((img) => ({
          id: img.id,
          url: img.url,
          createdAt: img.createdAt,
          updatedAt: img.updatedAt,
        })) || [], // agregamos las imágen
      createdAt: producto.createdAt,
      updatedAt: producto.updatedAt,
    };
  }
}
