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

  async create(dto: CreateUsuarioDto): Promise<Usuario> {
    const existsContrato = await this.usuarioRepo.findOneBy({
      contrato: dto.contrato,
    });
    if (existsContrato) {
      throw new BadRequestException('El contrato ya está registrado');
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

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    const usuario = this.usuarioRepo.create({
      ...dto,
      password: hashedPassword,
    });

    // Relaciones
    const dniTipo = await this.dniTipoRepo.findOneBy({ id: dto.dni_tipos_id });
    if (!dniTipo) throw new NotFoundException('DniTipo no encontrado');
    usuario.dniTipo = dniTipo;

    const estado = await this.estadoRepo.findOneBy({ id: dto.estados_id });
    if (!estado) throw new NotFoundException('Estado no encontrado');
    usuario.estado = estado;

    const sexo = await this.sexoRepo.findOneBy({ id: dto.sexos_id });
    if (!sexo) throw new NotFoundException('Sexo no encontrado');
    usuario.sexo = sexo;

    const estrato = await this.estratoRepo.findOneBy({ id: dto.estratos_id });
    if (!estrato) throw new NotFoundException('Estrato no encontrado');
    usuario.estrato = estrato;

    const rol = await this.rolRepo.findOneBy({ id: dto.roles_id });
    if (!rol) throw new NotFoundException('Rol no encontrado');
    usuario.rol = rol;

    usuario.emailVerificado = false;

    const nuevoUsuario = await this.usuarioRepo.save(usuario);

    const token = this.jwtService.sign(
      { sub: nuevoUsuario.id, email: nuevoUsuario.email },
      {
        secret: this.configService.get('JWT_VERIFICATION_SECRET'),
        expiresIn: this.configService.get('JWT_VERIFICATION_EXPIRES_IN'),
      },
    );

    return nuevoUsuario;
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

    for await (const usuario of parser) {
      const {
        nombre,
        apellido,
        dni,
        dni_tipos_id,
        contrato,
        nacionalidad,
        codigo_departamento,
        departamento,
        codigo_municipio,
        municipio,
        via_principal_clave,
        via_principal_valor,
        via_secundaria_clave,
        via_secundaria_valor,
        tipo_unidad_uno_clave,
        tipo_unidad_uno_valor,
        tipo_unidad_dos_clave,
        tipo_unidad_dos_valor,
        barrio,
        latitud,
        longitud,
        direccion,
        telefono_uno,
        telefono_dos,
        telefono_tres,
        password,
        email,
        fecha_nacimiento,
        anexo,
        emailVerificado,
        resetPasswordToken,
        resetPasswordExpires,
        estados_id,
        sexos_id,
        estratos_id,
        roles_id,
      } = usuario;

      const identificador = dni ?? '[sin identificador]';

      try {
        if (!nombre?.trim() || !apellido?.trim() || !dni?.trim()) {
          throw new Error('Faltan campos obligatorios');
        }

        const estado = await this.estadoRepo.findOne({
          where: { estado: estados_id?.trim() },
        });
        const sexo = await this.sexoRepo.findOne({
          where: { sexo: sexos_id?.trim() },
        });
        const estrato = await this.estratoRepo.findOne({
          where: { estrato: estratos_id?.trim() },
        });
        const rol = await this.rolRepo.findOne({
          where: { role: roles_id?.trim() },
        });
        const dniTipo = await this.dniTipoRepo.findOne({
          where: { nombre: dni_tipos_id?.trim() },
        });

        if (!estado) throw new Error(`Estado no encontrado: ${estados_id}`);
        if (!sexo) throw new Error(`Sexo no encontrado: ${sexos_id}`);
        if (!estrato) throw new Error(`Estrato no encontrado: ${estratos_id}`);
        if (!rol) throw new Error(`Rol no encontrado: ${roles_id}`);
        if (!dniTipo)
          throw new Error(`Tipo de DNI no encontrado: ${dni_tipos_id}`);

        const contratoLimpio = contrato?.trim() || null;

        if (rol.role === 'Cliente' && !contratoLimpio) {
          throw new Error('El contrato es obligatorio para el rol Cliente');
        }

        const usuarioExistente = await this.usuarioRepo.findOne({
          where: { dni: dni.trim() },
        });

        const baseDto: Partial<CreateUsuarioDto> = {
          nombre: nombre.trim(),
          apellido: apellido.trim(),
          dni: dni.trim(),
          contrato: contratoLimpio,
          nacionalidad: nacionalidad?.trim() || undefined,
          codigo_departamento: codigo_departamento?.trim() || undefined,
          departamento: departamento?.trim() || undefined,
          codigo_municipio: codigo_municipio?.trim() || undefined,
          municipio: municipio?.trim() || undefined,
          via_principal_clave: via_principal_clave?.trim() || undefined,
          via_principal_valor: via_principal_valor?.trim() || undefined,
          via_secundaria_clave: via_secundaria_clave?.trim() || undefined,
          via_secundaria_valor: via_secundaria_valor?.trim() || undefined,
          tipo_unidad_uno_clave: tipo_unidad_uno_clave?.trim() || undefined,
          tipo_unidad_uno_valor: tipo_unidad_uno_valor?.trim() || undefined,
          tipo_unidad_dos_clave: tipo_unidad_dos_clave?.trim() || undefined,
          tipo_unidad_dos_valor: tipo_unidad_dos_valor?.trim() || undefined,
          barrio: barrio?.trim() || undefined,
          latitud: latitud?.trim() || undefined,
          longitud: longitud?.trim() || undefined,
          direccion: direccion?.trim() || undefined,
          telefono_uno: telefono_uno?.trim() || undefined,
          telefono_dos: telefono_dos?.trim() || undefined,
          telefono_tres: telefono_tres?.trim() || undefined,
          email: email?.trim() || undefined,
          fecha_nacimiento: fecha_nacimiento
            ? new Date(fecha_nacimiento)
            : undefined,
          anexo: anexo?.trim() || undefined,
          emailVerificado:
            emailVerificado === 'true' || emailVerificado === true || false,
          resetPasswordToken: resetPasswordToken?.trim() || undefined,
          resetPasswordExpires: resetPasswordExpires
            ? new Date(resetPasswordExpires)
            : undefined,
        };

        if (usuarioExistente) {
          // Validar email único
          if (
            baseDto.email &&
            usuarioExistente.email !== baseDto.email &&
            (await this.usuarioRepo.findOne({
              where: { email: baseDto.email, id: Not(usuarioExistente.id) },
            }))
          ) {
            throw new Error(
              `El correo '${baseDto.email}' ya está registrado por otro usuario`,
            );
          }

          // Validar contrato único
          const contratoConflicto = contratoLimpio
            ? await this.usuarioRepo.findOne({
                where: {
                  contrato: contratoLimpio,
                  id: Not(usuarioExistente.id),
                },
              })
            : null;

          if (contratoConflicto) {
            throw new Error(
              `El contrato '${contratoLimpio}' ya está registrado por otro usuario`,
            );
          }

          // ❌ Excluir emailVerificado de la actualización
          const { emailVerificado: _, ...dtoSinEmailVerificado } = baseDto;

          await this.usuarioRepo.update(usuarioExistente.id, {
            ...dtoSinEmailVerificado,
            dniTipo: { id: dniTipo.id },
            estado: { id: estado.id },
            sexo: { id: sexo.id },
            estrato: { id: estrato.id },
            rol: { id: rol.id },
          });

          actualizados.push(identificador);
          continue;
        }

        // Solo se requiere password si es nuevo usuario
        if (!password?.trim()) {
          throw new Error('La contraseña es obligatoria para nuevos usuarios');
        }

        const hashedPassword = await bcrypt.hash(password.trim(), 10);

        // Validar contrato único para nuevos usuarios
        if (contratoLimpio) {
          const contratoExistente = await this.usuarioRepo.findOne({
            where: { contrato: contratoLimpio },
          });
          if (contratoExistente) {
            throw new Error(
              `El contrato '${contratoLimpio}' ya está registrado por otro usuario`,
            );
          }
        }

        const nuevoUsuario = this.usuarioRepo.create({
          ...baseDto,
          password: hashedPassword,
          dniTipo: { id: dniTipo.id },
          estado: { id: estado.id },
          sexo: { id: sexo.id },
          estrato: { id: estrato.id },
          rol: { id: rol.id },
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

  async findAll(): Promise<Usuario[]> {
    return this.usuarioRepo.find({
      relations: ['dniTipo', 'estado', 'sexo', 'estrato', 'rol'], // si usas relaciones
    });
  }

  async findByContratoODni(identificador: string): Promise<Usuario> {
    const identificadorLimpio = identificador.trim();

    const usuario = await this.usuarioRepo
      .createQueryBuilder('usuario')
      .leftJoinAndSelect('usuario.dniTipo', 'dniTipo')
      .leftJoinAndSelect('usuario.estado', 'estado')
      .leftJoinAndSelect('usuario.sexo', 'sexo')
      .leftJoinAndSelect('usuario.estrato', 'estrato')
      .leftJoinAndSelect('usuario.rol', 'rol')
      .where('usuario.contrato = :identificador', {
        identificador: identificadorLimpio,
      })
      .orWhere('usuario.dni = :identificador', {
        identificador: identificadorLimpio,
      })
      .getOne();

    if (!usuario) {
      throw new NotFoundException(
        `Usuario con contrato o DNI "${identificadorLimpio}" no encontrado.`,
      );
    }

    return usuario;
  }

  /* async updateByContrato(
    contrato: string,
    dto: UpdateUsuarioDto,
  ): Promise<Usuario> {
    const usuario = await this.usuarioRepo.findOne({
      where: { contrato },
      relations: ['dniTipo', 'estado', 'sexo', 'estrato', 'rol'],
    });

    if (!usuario) {
      throw new NotFoundException(
        `Usuario con contrato "${contrato}" no encontrado.`,
      );
    }

    // Si viene password, cifrarla antes de asignarla
    if (dto.password) {
      const saltRounds = 10;
      dto.password = await bcrypt.hash(dto.password, saltRounds);
    }

    // Actualizar campos básicos
    Object.assign(usuario, dto);

    // Actualizar relaciones si vienen
    if (dto.dni_tipos_id) {
      const dniTipo = await this.dniTipoRepo.findOneBy({
        id: dto.dni_tipos_id,
      });
      if (!dniTipo) {
        throw new NotFoundException(
          `DNI Tipo con id ${dto.dni_tipos_id} no encontrado`,
        );
      }
      usuario.dniTipo = dniTipo;
    }

    if (dto.estados_id) {
      const estado = await this.estadoRepo.findOneBy({ id: dto.estados_id });
      if (!estado) {
        throw new NotFoundException(
          `Estado con id ${dto.estados_id} no encontrado`,
        );
      }
      usuario.estado = estado;
    }

    if (dto.sexos_id) {
      const sexo = await this.sexoRepo.findOneBy({ id: dto.sexos_id });
      if (!sexo) {
        throw new NotFoundException(
          `Sexo con id ${dto.sexos_id} no encontrado`,
        );
      }
      usuario.sexo = sexo;
    }

    if (dto.estratos_id) {
      const estrato = await this.estratoRepo.findOneBy({ id: dto.estratos_id });
      if (!estrato) {
        throw new NotFoundException(
          `Estrato con id ${dto.estratos_id} no encontrado`,
        );
      }
      usuario.estrato = estrato;
    }

    if (dto.roles_id) {
      const rol = await this.rolRepo.findOneBy({ id: dto.roles_id });
      if (!rol) {
        throw new NotFoundException(`Rol con id ${dto.roles_id} no encontrado`);
      }
      usuario.rol = rol;
    }

    return this.usuarioRepo.save(usuario);
  } */

  /*  async eliminarPorContrato(contrato: string): Promise<boolean> {
    const resultado = await this.usuarioRepo.delete({ contrato });
    return (resultado.affected ?? 0) > 0;
  } */
}
