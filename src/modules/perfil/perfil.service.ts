import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { compare, hash } from 'bcrypt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Usuario } from '../usuarios/entities/usuario.entity';
import { UpdatePerfilDto } from './dto/update-perfil.dto';
import { Sexo } from '../sexos/entities/sexo.entity';
import { Estrato } from '../estratos/entities/estrato.entity';
import { DniTipo } from '../dni-tipos/entities/dni-tipo.entity';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { JwtService } from '@nestjs/jwt';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class PerfilService {
  constructor(
    @InjectRepository(Usuario)
    private readonly usuarioRepository: Repository<Usuario>,
    private readonly jwtService: JwtService,
    private readonly mailerService: MailerService,
  ) {}

  async actualizarPerfil(contrato: string, dto: UpdatePerfilDto): Promise<any> {
    const usuario = await this.usuarioRepository.findOne({
      where: { contrato },
    });

    if (!usuario) {
      throw new NotFoundException(
        `No se encontró el usuario con contrato: ${contrato}`,
      );
    }

    // Validar si el DNI ya existe en otro usuario
    if (dto.dni && dto.dni !== usuario.dni) {
      const dniExistente = await this.usuarioRepository.findOne({
        where: { dni: dto.dni },
      });
      if (dniExistente) {
        throw new BadRequestException(
          `El DNI ${dto.dni} ya está registrado para otro usuario.`,
        );
      }
    }

    // Campos permitidos
    usuario.nombre = dto.nombre ?? usuario.nombre;
    usuario.apellido = dto.apellido ?? usuario.apellido;
    if (dto.dni_tipos_id) usuario.dniTipo = { id: dto.dni_tipos_id } as DniTipo;
    usuario.dni = dto.dni ?? usuario.dni;
    usuario.nacionalidad = dto.nacionalidad ?? usuario.nacionalidad;
    usuario.barrio = dto.barrio ?? usuario.barrio;
    usuario.direccion = dto.direccion ?? usuario.direccion;
    usuario.telefono_uno = dto.telefono_uno ?? usuario.telefono_uno;
    usuario.fecha_nacimiento = dto.fecha_nacimiento ?? usuario.fecha_nacimiento;
    if (dto.sexos_id) usuario.sexo = { id: dto.sexos_id } as Sexo;

    await this.usuarioRepository.save(usuario);

    // Obtener usuario actualizado con relaciones
    const usuarioActualizado = await this.usuarioRepository.findOneOrFail({
      where: { contrato },
      relations: ['dniTipo', 'estado', 'sexo', 'rol'],
    });

    // Eliminar password antes de retornar
    const { password, ...usuarioSinPassword } = usuarioActualizado;

    return {
      message: 'Perfil actualizado correctamente',
      data: usuarioSinPassword,
    };
  }

  async obtenerPerfilPorId(id: number): Promise<any> {
    const usuario = await this.usuarioRepository.findOne({
      where: { id },
      relations: ['dniTipo', 'estado', 'sexo', 'rol'],
    });

    if (!usuario) {
      throw new NotFoundException(`No se encontró el usuario con id: ${id}`);
    }

    // Excluir password y campos que no quieres mostrar
    const {
      password,
      createdAt,
      updatedAt,
      mes,
      f_prim_act,
      f_ult_dx,
      f_ult_p,
      ult_p,
      saldo,
      mora,
      ...usuarioFiltrado
    } = usuario;

    // Limpiar las relaciones
    const limpiarRelacion = (relacion: any) => {
      if (!relacion) return null;
      const { createdAt, updatedAt, ...rel } = relacion;
      return rel;
    };

    return {
      message: 'Perfil obtenido correctamente',
      data: {
        ...usuarioFiltrado,
        dniTipo: limpiarRelacion(usuarioFiltrado.dniTipo),
        estado: limpiarRelacion(usuarioFiltrado.estado),
        sexo: limpiarRelacion(usuarioFiltrado.sexo),
        rol: limpiarRelacion(usuarioFiltrado.rol),
      },
    };
  }

  async cambiarPassword(
    userId: number,
    dto: UpdatePasswordDto,
  ): Promise<{ message: string }> {
    const usuario = await this.usuarioRepository.findOneBy({ id: userId });

    if (!usuario) {
      throw new NotFoundException('Usuario no encontrado');
    }

    if (!usuario.password) {
      throw new BadRequestException(
        'El usuario no tiene contraseña registrada',
      );
    }

    const passwordValido = await compare(dto.currentPassword, usuario.password);

    if (!passwordValido) {
      throw new BadRequestException('La contraseña actual es incorrecta');
    }

    usuario.password = await hash(dto.newPassword, 10);
    await this.usuarioRepository.save(usuario);

    return { message: 'Contraseña actualizada correctamente' };
  }

  async solicitarCambioEmail(usuario: Usuario, nuevoEmail: string) {
    // Verificar que no exista otro usuario con ese email
    const emailExistente = await this.usuarioRepository.findOne({
      where: { email: nuevoEmail },
    });
    if (emailExistente) {
      throw new BadRequestException('Este email ya está registrado');
    }

    // Generar token temporal
    const token = this.jwtService.sign(
      { id: usuario.id, nuevoEmail },
      { expiresIn: '1h' },
    );

    // Enviar correo
    const url = `http://localhost:3000/perfil/verificar-email?token=${token}`;
    await this.mailerService.sendMail({
      to: nuevoEmail,
      subject: 'Verifica tu nuevo correo',
      html: `<p>Haz clic <a href="${url}">aquí</a> para verificar tu nuevo correo</p>`,
    });

    return { message: 'Correo de verificación enviado' };
  }

  async confirmarCambioEmail(token: string) {
    try {
      // Decodificar y verificar token JWT
      const payload = this.jwtService.verify(token);

      // Buscar usuario
      const usuario = await this.usuarioRepository.findOne({
        where: { id: payload.id },
      });
      if (!usuario) throw new NotFoundException('Usuario no encontrado');

      // Actualizar email y marcar como verificado
      usuario.email = payload.nuevoEmail;
      usuario.emailVerificado = true;
      await this.usuarioRepository.save(usuario);

      return { message: 'Correo actualizado correctamente' };
    } catch (error) {
      throw new BadRequestException('Token inválido o expirado');
    }
  }
}
