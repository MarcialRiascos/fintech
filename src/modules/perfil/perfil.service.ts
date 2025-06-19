import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { compare, hash } from 'bcrypt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Usuario } from '../usuarios/entities/usuario.entity';
import { UpdatePerfilDto } from '../usuarios/dto/update-perfil.dto';
import { Sexo } from '../sexos/entities/sexo.entity';
import { Estrato } from '../estratos/entities/estrato.entity';
import { DniTipo } from '../dni-tipos/entities/dni-tipo.entity';
import { UpdatePasswordDto } from './dto/update-password.dto';


@Injectable()
export class PerfilService {
  constructor(
    @InjectRepository(Usuario)
    private readonly usuarioRepository: Repository<Usuario>,
  ) {}

  async actualizarPerfil(contrato: string, dto: UpdatePerfilDto): Promise<Usuario> {
  const usuario = await this.usuarioRepository.findOne({ where: { contrato } });

  if (!usuario) {
    throw new NotFoundException(`No se encontró el usuario con contrato: ${contrato}`);
  }

  // Campos permitidos (excluyendo password, contrato, estado, rol)
  usuario.nombre = dto.nombre ?? usuario.nombre;
usuario.apellido = dto.apellido ?? usuario.apellido;
if (dto.dni_tipos_id) {
  usuario.dniTipo = { id: dto.dni_tipos_id } as DniTipo;
}

usuario.dni = dto.dni ?? usuario.dni;
usuario.nacionalidad = dto.nacionalidad ?? usuario.nacionalidad;
usuario.codigo_departamento = dto.codigo_departamento ?? usuario.codigo_departamento;
usuario.departamento = dto.departamento ?? usuario.departamento;
usuario.codigo_municipio = dto.codigo_municipio ?? usuario.codigo_municipio;
usuario.municipio = dto.municipio ?? usuario.municipio;
usuario.via_principal_clave = dto.via_principal_clave ?? usuario.via_principal_clave;
usuario.via_principal_valor = dto.via_principal_valor ?? usuario.via_principal_valor;
usuario.via_secundaria_clave = dto.via_secundaria_clave ?? usuario.via_secundaria_clave;
usuario.via_secundaria_valor = dto.via_secundaria_valor ?? usuario.via_secundaria_valor;
usuario.tipo_unidad_uno_clave = dto.tipo_unidad_uno_clave ?? usuario.tipo_unidad_uno_clave;
usuario.tipo_unidad_uno_valor = dto.tipo_unidad_uno_valor ?? usuario.tipo_unidad_uno_valor;
usuario.tipo_unidad_dos_clave = dto.tipo_unidad_dos_clave ?? usuario.tipo_unidad_dos_clave;
usuario.tipo_unidad_dos_valor = dto.tipo_unidad_dos_valor ?? usuario.tipo_unidad_dos_valor;
usuario.barrio = dto.barrio ?? usuario.barrio;
usuario.latitud = dto.latitud ?? usuario.latitud;
usuario.longitud = dto.longitud ?? usuario.longitud;
usuario.direccion = dto.direccion ?? usuario.direccion;
usuario.telefono_uno = dto.telefono_uno ?? usuario.telefono_uno;
usuario.telefono_dos = dto.telefono_dos ?? usuario.telefono_dos;
usuario.telefono_tres = dto.telefono_tres ?? usuario.telefono_tres;
usuario.email = dto.email ?? usuario.email;
usuario.fecha_nacimiento = dto.fecha_nacimiento ?? usuario.fecha_nacimiento;
usuario.anexo = dto.anexo ?? usuario.anexo;
if (dto.sexos_id) {
  usuario.sexo = { id: dto.sexos_id } as Sexo;
}
if (dto.estratos_id) {
  usuario.estrato = { id: dto.estratos_id } as Estrato;
}

  await this.usuarioRepository.save(usuario);

 try {
  return await this.usuarioRepository.findOneOrFail({
    where: { contrato },
    relations: ['dniTipo', 'estado', 'sexo', 'estrato', 'rol'],
  });
} catch (error) {
  throw new NotFoundException(`No se encontró el usuario con contrato: ${contrato}`);
}
}

async cambiarPassword(userId: number, dto: UpdatePasswordDto): Promise<{ message: string }> {
  const usuario = await this.usuarioRepository.findOneBy({ id: userId });

  if (!usuario) {
    throw new NotFoundException('Usuario no encontrado');
  }

  if (!usuario.password) {
  throw new BadRequestException('El usuario no tiene contraseña registrada');
}

const passwordValido = await compare(dto.currentPassword, usuario.password);

  if (!passwordValido) {
    throw new BadRequestException('La contraseña actual es incorrecta');
  }

  usuario.password = await hash(dto.newPassword, 10);
  await this.usuarioRepository.save(usuario);

  return { message: 'Contraseña actualizada correctamente' };
}

}
