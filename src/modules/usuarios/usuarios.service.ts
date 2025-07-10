// src/modules/usuarios/usuarios.service.ts
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ObjectLiteral  } from 'typeorm';
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
  const existsContrato = await this.usuarioRepo.findOneBy({ contrato: dto.contrato });
  if (existsContrato) {
    throw new BadRequestException('El contrato ya está registrado');
  }

  if (dto.email) {
    const existsEmail = await this.usuarioRepo.findOneBy({ email: dto.email });
    if (existsEmail) {
      throw new BadRequestException('El correo electrónico ya está registrado');
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

  const domain = this.configService.get<string>('APP_DOMAIN');
  const url = `${domain}/auth/verify-email?token=${token}`;

  if (!nuevoUsuario.email) {
    throw new BadRequestException(
      'El correo electrónico es obligatorio para enviar el email de verificación',
    );
  }

  await this.mailerService.sendMail({
    to: nuevoUsuario.email,
    subject: 'Verifica tu correo electrónico',
    template: './verify-email',
    context: {
      name: nuevoUsuario.nombre ?? nuevoUsuario.apellido ?? 'usuario',
      url,
    },
  });

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

async registrarUsuariosDesdeCsv(filePath: string): Promise<{
  registrados: string[];
  fallidos: { contrato: string; motivo: string }[];
}> {
  const registrados: string[] = [];
  const fallidos: { contrato: string; motivo: string }[] = [];

  const parser = fs
  .createReadStream(filePath, { encoding: 'utf8' }) // <-- Aquí se aplica
  .pipe(parse({ columns: true, skip_empty_lines: true }));


  for await (const row of parser) {
    try {
      const dto: CreateUsuarioDto = {
        ...row,
        password: (row.password || '123456').trim(),
        contrato: row.contrato,
        email: row.email,
        dni_tipos_id: await this.obtenerIdPorNombre(this.dniTipoRepo, 'nombre', row.dni_tipos, 'Tipo de documento'),
        estados_id: await this.obtenerIdPorNombre(this.estadoRepo, 'estado', row.estado, 'Estado'),
        sexos_id: await this.obtenerIdPorNombre(this.sexoRepo, 'sexo', row.sexo, 'Sexo'),
        estratos_id: await this.obtenerIdPorNombre(this.estratoRepo, 'estrato', row.estrato, 'Estrato'),
        roles_id: await this.obtenerIdPorNombre(this.rolRepo, 'role', row.role, 'Rol'),
      };

      const usuario = await this.create(dto);
      registrados.push(usuario.contrato ?? '[sin contrato]');
    } catch (error) {
      fallidos.push({
        contrato: row.contrato ?? '[desconocido]',
        motivo: error.message,
      });
    }
  }

  return { registrados, fallidos };
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

  async updateByContrato(
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
  }

  async eliminarPorContrato(contrato: string): Promise<boolean> {
    const resultado = await this.usuarioRepo.delete({ contrato });
    return (resultado.affected ?? 0) > 0;
  }
}
