import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
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

    return {
      message: 'Producto creado exitosamente'
    };
  }

  async createByRepresentante(
  dto: CreateProductoDto,
  representanteId: number,
): Promise<{ message: string }> {
  // 🔍 Verificar que la tienda existe y pertenece al representante
  const tienda = await this.tiendaRepo.findOne({
    where: { id: dto.tiendas_id },
    relations: ['representante'],
  });

  if (!tienda) {
    throw new NotFoundException('Tienda no encontrada');
  }

  if (tienda.representante?.id !== representanteId) {
    throw new ForbiddenException(
      'No tienes permiso para agregar productos a esta tienda.',
    );
  }

  // 🔍 Validar estado
  const estado = await this.estadoRepo.findOne({
    where: { id: dto.estados_id },
  });

  if (!estado) {
    throw new BadRequestException('Estado no válido');
  }

  // 💰 Calcular precio_senda según el porcentaje de la tienda
  const precio_senda =
    Number(dto.precio_tienda) -
    (Number(dto.precio_tienda) * Number(tienda.porcentaje)) / 100;

  const precio_senda_redondeado = Number(precio_senda.toFixed(2));

  // 🛠️ Crear producto
  const producto = this.productoRepo.create({
    ...dto,
    precio_senda: precio_senda_redondeado,
    usuario: { id: representanteId },
    tienda,
    estado,
  });

  await this.productoRepo.save(producto);

  return { message: 'Producto creado exitosamente por el representante' };
}

  async findByRepresentante(representanteId: number) {
    const productos = await this.productoRepo
      .createQueryBuilder('producto')
      .leftJoinAndSelect('producto.tienda', 'tienda')
      .leftJoinAndSelect('producto.estado', 'estado')
      .leftJoinAndSelect('producto.usuario', 'usuario')
      .leftJoinAndSelect('producto.imagenes', 'imagenes')
      .leftJoin('tienda.representante', 'representante')
      .where('representante.id = :representanteId', { representanteId })
      .getMany();

    return {
      message:
        'Listado de productos pertenecientes a las tiendas del representante obtenido correctamente',
      data: productos.map(this.formatResponse),
    };
  }


  async findAll() {
    const productos = await this.productoRepo.find({
      relations: ['tienda', 'estado', 'usuario', 'imagenes'],
    });

    return {
      message: 'Listado de productos obtenido correctamente',
      data: productos.map(this.formatResponse),
    };
  }

  async findOneByRepresentante(id: number, representanteId: number) {
  const producto = await this.productoRepo.findOne({
    where: {
      id,
      tienda: {
        representante: { id: representanteId },
      },
    },
    relations: ['tienda', 'estado', 'usuario', 'imagenes'],
  });

  if (!producto) {
    throw new NotFoundException('Producto no encontrado o no pertenece a sus tiendas');
  }

  return {
    message: 'Producto del representante obtenido correctamente',
    data: this.formatResponse(producto),
  };
}

  // Obtener un producto por ID
  async findOne(id: number) {
    const producto = await this.productoRepo.findOne({
      where: { id },
      relations: ['tienda', 'estado', 'usuario', 'imagenes'],
    });

    if (!producto) throw new NotFoundException('Producto no encontrado');

    return {
      message: 'Producto obtenido correctamente',
      data: this.formatResponse(producto),
    };
  }

  async updateByRepresentante(
  id: number,
  dto: UpdateProductoDto,
  representanteId: number,
) {
  // Buscar el producto que pertenece a una tienda del representante autenticado
  const producto = await this.productoRepo.findOne({
    where: {
      id,
      tienda: {
        representante: { id: representanteId },
      },
    },
    relations: ['tienda', 'estado', 'usuario', 'imagenes'],
  });

  if (!producto) {
    throw new NotFoundException('Producto no encontrado o no pertenece a sus tiendas');
  }

  // Validaciones iguales a las del update original
  if (dto.usuarios_id) {
    const usuario = await this.usuarioRepo.findOne({ where: { id: dto.usuarios_id } });
    if (!usuario) throw new BadRequestException('Usuario no válido');
    producto.usuario = usuario;
  }

  if (dto.tiendas_id) {
    const tienda = await this.tiendaRepo.findOne({
      where: {
        id: dto.tiendas_id,
        representante: { id: representanteId }, // 🔒 asegura que sea una tienda suya
      },
    });
    if (!tienda) throw new BadRequestException('Tienda no válida o no pertenece al representante');
    producto.tienda = tienda;
  }

  if (dto.estados_id) {
    const estado = await this.estadoRepo.findOne({ where: { id: dto.estados_id } });
    if (!estado) throw new BadRequestException('Estado no válido');
    producto.estado = estado;
  }

  // Mezclar los cambios
  this.productoRepo.merge(producto, dto);

  // Recalcular precio_senda si se cambia el precio_tienda
  if (dto.precio_tienda && producto.tienda) {
    const porcentaje = Number(producto.tienda.porcentaje) || 0;
    producto.precio_senda =
      Number(dto.precio_tienda) - (Number(dto.precio_tienda) * porcentaje) / 100;
  }

  await this.productoRepo.save(producto);

  return {
    message: 'Producto del representante actualizado correctamente',
  };
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

    return {
      message: 'Producto actualizado correctamente'
    };
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
