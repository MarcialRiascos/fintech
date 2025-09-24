// src/modules/usuarios/usuarios.service.ts
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ObjectLiteral, Not } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { parse } from 'csv-parse';
import * as fs from 'fs';
import * as path from 'path';
import { promisify } from 'util';

import { Usuario } from './entities/usuario.entity';
import { CreateUsuarioDto } from './dto/create-usuario.dto';

import { DniTipo } from '../dni-tipos/entities/dni-tipo.entity';
import { Estado } from '../estados/entities/estado.entity';
import { Sexo } from '../sexos/entities/sexo.entity';
import { Estrato } from '../estratos/entities/estrato.entity';
import { Rol } from '../roles/entities/rol.entity';

import { JwtService } from '@nestjs/jwt';
import { MailerService } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';
import { instanceToPlain } from 'class-transformer';

@Injectable()
export class UsuariosService {
  constructor(
    @InjectRepository(Usuario)
    private readonly usuarioRepo: Repository<Usuario>,

    @InjectRepository(DniTipo)
    private readonly dniTipoRepo: Repository<DniTipo>,

    @InjectRepository(Estado)
    private readonly estadoRepo: Repository<Estado>,

    @InjectRepository(Sexo)
    private readonly sexoRepo: Repository<Sexo>,

    @InjectRepository(Estrato)
    private readonly estratoRepo: Repository<Estrato>,

    @InjectRepository(Rol)
    private readonly rolRepo: Repository<Rol>,

    private readonly jwtService: JwtService,
    private readonly mailerService: MailerService,
    private readonly configService: ConfigService,
  ) {}

  async create(dto: CreateUsuarioDto): Promise<any> {
    // ✅ Validaciones únicas
    const existsDni = await this.usuarioRepo.findOneBy({ dni: dto.dni });
    if (existsDni) {
      throw new BadRequestException('El DNI ya está registrado');
    }

    if (dto.roles_id === 3 && dto.contrato) {
      const existsContrato = await this.usuarioRepo.findOneBy({
        contrato: dto.contrato,
      });
      if (existsContrato) {
        throw new BadRequestException('El contrato ya está registrado');
      }
    }

    if (dto.email) {
      const existsEmail = await this.usuarioRepo.findOneBy({
        email: dto.email,
      });
      if (existsEmail) {
        throw new BadRequestException(
          'El correo electrónico ya está registrado',
        );
      }
    }

    if (!dto.contrato) {
      throw new BadRequestException('El contrato es obligatorio');
    }
    // ✅ Hashear contraseña
    const password = await bcrypt.hash(dto.contrato, 10);

    // ✅ Normalización de tipos
    const fechaNacimiento = dto.fecha_nacimiento
      ? new Date(dto.fecha_nacimiento)
      : null;
    const mes =
      dto.mes !== undefined && dto.mes !== null ? Number(dto.mes) : null;
    const ult_p =
      dto.ult_p !== undefined && dto.ult_p !== null ? Number(dto.ult_p) : null;
    const saldo =
      dto.saldo !== undefined && dto.saldo !== null ? Number(dto.saldo) : null;
    const mora =
      dto.mora !== undefined && dto.mora !== null ? Number(dto.mora) : null;

    // ✅ Crear usuario con relaciones por ID
    const usuario = this.usuarioRepo.create({
      ...dto,
      password: password,
      fecha_nacimiento: fechaNacimiento,
      mes,
      ult_p,
      saldo,
      mora,
      dniTipo: { id: dto.dni_tipos_id },
      estado: { id: dto.estados_id },
      sexo: dto.sexos_id ? { id: dto.sexos_id } : undefined,
      rol: { id: dto.roles_id },
    });

    const savedUser = await this.usuarioRepo.save(usuario);

    return {
      status: 200,
      success: true,
      message: 'Usuario creado exitosamente',
    };
  }

  private async obtenerIdPorNombre<T extends ObjectLiteral>(
    repo: Repository<T>,
    campo: keyof T,
    valor: string,
    entidad: string,
  ): Promise<number> {
    const encontrado = await repo.findOne({ where: { [campo]: valor } as any });
    if (!encontrado) {
      throw new Error(`${entidad} "${valor}" no encontrado`);
    }
    return (encontrado as any).id;
  }

  async registrarUsuariosDesdeCsv(filePath: string): Promise<any> {
    const registrados: string[] = [];
    const actualizados: string[] = [];
    const fallidos: { identificador: string; motivo: string }[] = [];

    const parser = fs
      .createReadStream(filePath)
      .pipe(parse({ columns: true, skip_empty_lines: true }));

    for await (const row of parser) {
      const {
        'Nombre(s)': nombre,
        'Apellido(s)': apellido,
        DNI: dni,
        'Tipo DNI': dni_tipos_id,
        Contr: contrato,
        Nacionalidad: nacionalidad,
        Barrio: barrio,
        Dirección: direccion,
        Teléfonos,
        Correo: email,
        'F Nac': fecha_nacimiento,
        '$ mes': mes,
        'F prim Act': f_prim_act,
        'F Ult DX': f_ult_dx,
        'F Ult P': f_ult_p,
        '$ Ult P': ult_p,
        Saldo: saldo,
        Mora: mora,
        EmailVerificado: emailVerificado,
        Est: estados_id,
        Sexo: sexos_id,
      } = row;

      const identificador =
        contrato?.trim() ?? dni?.trim() ?? '[sin identificador]';

      try {
        if (!nombre?.trim() || !apellido?.trim() || !contrato?.trim()) {
          throw new Error(
            'Faltan campos obligatorios (Nombre, Apellido o Contrato)',
          );
        }

        // 🔎 Buscar entidades relacionadas por nombre
        const estado = await this.estadoRepo.findOne({
          where: { estado: estados_id?.trim() },
        });
        const rol = await this.rolRepo.findOne({
          where: { role: 'Cliente' }, // 🚩 siempre Cliente
        });
        const dniTipo = dni_tipos_id
          ? await this.dniTipoRepo.findOne({
              where: { nombre: dni_tipos_id?.trim() },
            })
          : null;

        if (!estado) throw new Error(`Estado no encontrado: ${estados_id}`);
        if (!rol) throw new Error(`Rol Cliente no encontrado en la DB`);
        if (dni_tipos_id && !dniTipo)
          throw new Error(`Tipo de DNI no encontrado: ${dni_tipos_id}`);

        const contratoLimpio = contrato?.trim() || null;

        if (!contratoLimpio) {
          throw new Error('El contrato es obligatorio');
        }

        const usuarioExistente = await this.usuarioRepo.findOne({
          where: { contrato: contratoLimpio },
        });

        const baseDto: Partial<Usuario> = {
          nombre: nombre?.trim() || null,
          apellido: apellido?.trim() || null,
          dni: dni?.trim() || null,
          contrato: contratoLimpio,
          nacionalidad: nacionalidad?.trim() || null,
          barrio: barrio?.trim() || null,
          direccion: direccion?.trim() || null,
          telefono_uno: Teléfonos?.trim() || null,
          email: email?.trim() || null,
          fecha_nacimiento: fecha_nacimiento
            ? new Date(fecha_nacimiento)
            : null,
          mes: mes ? parseFloat(mes) : null,
          f_prim_act: f_prim_act?.trim() || null,
          f_ult_dx: f_ult_dx?.trim() || null,
          f_ult_p: f_ult_p?.trim() || null,
          ult_p: ult_p ? parseFloat(ult_p) : null,
          saldo: saldo ? parseFloat(saldo) : null,
          mora: mora ? parseInt(mora, 10) : null,
          emailVerificado:
            emailVerificado === 'true' || emailVerificado === true || false,
        };

        if (usuarioExistente) {
          await this.usuarioRepo.update(usuarioExistente.id, {
            ...baseDto,
            dniTipo: dniTipo ? { id: dniTipo.id } : null,
            estado: { id: estado.id },
            rol: { id: rol.id }, // siempre Cliente
          });

          actualizados.push(identificador);
          continue;
        }

        // 🚩 Generar contraseña desde el número de contrato y cifrarla
        const hashedPassword = await bcrypt.hash(contratoLimpio, 10);

        // Validar contrato único para nuevos usuarios
        const contratoExistente = await this.usuarioRepo.findOne({
          where: { contrato: contratoLimpio },
        });
        if (contratoExistente) {
          throw new Error(
            `El contrato '${contratoLimpio}' ya está registrado por otro usuario`,
          );
        }

        const nuevoUsuario = this.usuarioRepo.create({
          ...baseDto,
          password: hashedPassword,
          dniTipo: dniTipo ? { id: dniTipo.id } : null,
          estado: { id: estado.id },
          rol: { id: rol.id }, // 🚩 siempre Cliente
        });

        const guardado = await this.usuarioRepo.save(nuevoUsuario);
        registrados.push(guardado.contrato ?? guardado.dni ?? '');
      } catch (error: any) {
        fallidos.push({
          identificador,
          motivo: error.message || 'Error desconocido',
        });
      }
    }

    await fs.promises.unlink(filePath);
    return { registrados, actualizados, fallidos };
  }

  async findAll(): Promise<any> {
    const usuarios = await this.usuarioRepo.find({
      relations: ['dniTipo', 'estado', 'sexo', 'rol'],
    });

    if (usuarios.length === 0) {
      return {
        message: 'No hay registros de usuarios',
        data: [],
      };
    }

    return {
      message: 'Registros encontrados exitosamente',
      data: usuarios,
    };
  }

async findByContratoODni(identificador: string): Promise<any> {
  const identificadorLimpio = identificador.trim();

  const usuario = await this.usuarioRepo
    .createQueryBuilder('usuario')
    .leftJoinAndSelect('usuario.dniTipo', 'dniTipo')
    .leftJoinAndSelect('usuario.estado', 'estado')
    .leftJoinAndSelect('usuario.sexo', 'sexo')
    .leftJoinAndSelect('usuario.rol', 'rol')
    .where('usuario.contrato = :identificador', {
      identificador: identificadorLimpio,
    })
    .orWhere('usuario.dni = :identificador', {
      identificador: identificadorLimpio,
    })
    .getOne();

  if (!usuario) {
    return {
      message: `Usuario con contrato o DNI "${identificadorLimpio}" no encontrado.`,
      data: null,
    };
  }

  return {
    message: 'Usuario encontrado exitosamente',
    data: instanceToPlain(usuario),
  };
}

async updateByIdentificador(
  identificador: string,
  dto: UpdateUsuarioDto,
): Promise<{ message: string }> {
  const usuario = await this.usuarioRepo.findOne({
    where: [{ contrato: identificador }, { dni: identificador }],
    relations: ['dniTipo', 'estado', 'sexo', 'rol'],
  });

  if (!usuario) {
    throw new NotFoundException(
      `Usuario con contrato o DNI "${identificador}" no encontrado.`,
    );
  }

  if ('password' in dto) {
    delete dto.password;
  }

  // 🔎 Validar DNI único
  if (dto.dni && dto.dni !== usuario.dni) {
    const existeDni = await this.usuarioRepo.findOne({
      where: { dni: dto.dni },
    });
    if (existeDni && existeDni.id !== usuario.id) {
      throw new BadRequestException(
        `El DNI "${dto.dni}" ya está registrado en otro usuario.`,
      );
    }
  }

  // 🔎 Validar Contrato único
  if (dto.contrato && dto.contrato !== usuario.contrato) {
    const existeContrato = await this.usuarioRepo.findOne({
      where: { contrato: dto.contrato },
    });
    if (existeContrato && existeContrato.id !== usuario.id) {
      throw new BadRequestException(
        `El contrato "${dto.contrato}" ya está registrado en otro usuario.`,
      );
    }
  }

  // 🔎 Validar Email único
  if (dto.email && dto.email !== usuario.email) {
    const existeEmail = await this.usuarioRepo.findOne({
      where: { email: dto.email },
    });
    if (existeEmail && existeEmail.id !== usuario.id) {
      throw new BadRequestException(
        `El email "${dto.email}" ya está registrado en otro usuario.`,
      );
    }
    usuario.emailVerificado = false;
  }

  // ✅ Actualizar campos
  Object.assign(usuario, dto);

  // ✅ Relaciones
  if (dto.dni_tipos_id) {
    const dniTipo = await this.dniTipoRepo.findOneBy({ id: dto.dni_tipos_id });
    if (!dniTipo) {
      throw new NotFoundException(
        `DNI Tipo con id ${dto.dni_tipos_id} no encontrado.`,
      );
    }
    usuario.dniTipo = dniTipo;
  }

  if (dto.estados_id) {
    const estado = await this.estadoRepo.findOneBy({ id: dto.estados_id });
    if (!estado) {
      throw new NotFoundException(
        `Estado con id ${dto.estados_id} no encontrado.`,
      );
    }
    usuario.estado = estado;
  }

  if (dto.sexos_id) {
    const sexo = await this.sexoRepo.findOneBy({ id: dto.sexos_id });
    if (!sexo) {
      throw new NotFoundException(
        `Sexo con id ${dto.sexos_id} no encontrado.`,
      );
    }
    usuario.sexo = sexo;
  }

  if (dto.roles_id) {
    const rol = await this.rolRepo.findOneBy({ id: dto.roles_id });
    if (!rol) {
      throw new NotFoundException(
        `Rol con id ${dto.roles_id} no encontrado.`,
      );
    }
    usuario.rol = rol;
  }

  await this.usuarioRepo.save(usuario);

  return { message: 'Usuario actualizado exitosamente.' };
}


  /*  async eliminarPorContrato(contrato: string): Promise<boolean> {
    const resultado = await this.usuarioRepo.delete({ contrato });
    return (resultado.affected ?? 0) > 0;
  } */
}
