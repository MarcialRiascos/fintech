import {
  Injectable,
  UnauthorizedException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Usuario } from '../../modules/usuarios/entities/usuario.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { MailerService } from '@nestjs-modules/mailer';
import { RefreshTokenDto } from './dto/refresh-token.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Usuario)
    private readonly usuarioRepo: Repository<Usuario>,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly mailerService: MailerService,
  ) {}

  async validateUser(
    identificador: string,
    password: string,
  ): Promise<Usuario> {
    const usuario = await this.usuarioRepo
      .createQueryBuilder('usuario')
      .leftJoinAndSelect('usuario.rol', 'rol')
      .leftJoinAndSelect('usuario.estado', 'estado')
      .leftJoinAndSelect('usuario.sexo', 'sexo')
      .leftJoinAndSelect('usuario.dniTipo', 'dniTipo')
      .where('usuario.contrato = :identificador', { identificador })
      .orWhere('usuario.dni = :identificador', { identificador })
      .getOne();

    if (!usuario || !usuario.password) {
      throw new UnauthorizedException('Identificador o contraseña inválidos');
    }

   /*  if (!usuario.emailVerificado) {
      throw new UnauthorizedException(
        'Debes verificar tu correo antes de iniciar sesión',
      );
    } */

    const isMatch = await bcrypt.compare(password, usuario.password);
    if (!isMatch) {
      throw new UnauthorizedException('Identificador o contraseña inválidos');
    }

    return usuario;
  }

  async login(usuario: Usuario) {
    const payload = {
      sub: usuario.id,
      contrato: usuario.contrato,
      rol: usuario.rol?.role,
    };

    const access_token = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
      expiresIn: this.configService.get<string>('JWT_ACCESS_EXPIRES_IN'),
    });

    const refresh_token = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
      expiresIn: this.configService.get<string>('JWT_REFRESH_EXPIRES_IN'),
    });

    return {
      access_token,
      refresh_token,
      usuario: {
        id: usuario.id,
        nombre: usuario.nombre,
        apellido: usuario.apellido,
        dniTipo: usuario.dniTipo
          ? { id: usuario.dniTipo.id, nombre: usuario.dniTipo.nombre }
          : null,
        dni: usuario.dni,
        contrato: usuario.contrato,
        rol: usuario.rol
          ? { id: usuario.rol.id, nombre: usuario.rol.role }
          : null,
        estado: usuario.estado
          ? { id: usuario.estado.id, nombre: usuario.estado.estado }
          : null,
      },
    };
  }

   async refreshTokens(dto: RefreshTokenDto) {
    try {
      // 1️⃣ Verificar el refresh token
      const payload = this.jwtService.verify(dto.refresh_token, {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
      });

      // 2️⃣ Buscar el usuario correspondiente
      const usuario = await this.usuarioRepo.findOne({
        where: { id: payload.sub },
        relations: ['dniTipo', 'rol', 'estado'],
      });

      if (!usuario) {
        throw new UnauthorizedException('Usuario no encontrado.');
      }

      // 3️⃣ Generar nuevos tokens
      const newPayload = {
        sub: usuario.id,
        contrato: usuario.contrato,
        rol: usuario.rol?.role,
      };

      const access_token = this.jwtService.sign(newPayload, {
        secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
        expiresIn: this.configService.get<string>('JWT_ACCESS_EXPIRES_IN'),
      });

      const refresh_token = this.jwtService.sign(newPayload, {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
        expiresIn: this.configService.get<string>('JWT_REFRESH_EXPIRES_IN'),
      });

      // 4️⃣ Retornar los nuevos tokens
      return {
        message: 'Tokens renovados correctamente',
        access_token,
        refresh_token,
        usuario: {
          id: usuario.id,
          nombre: usuario.nombre,
          apellido: usuario.apellido,
          dniTipo: usuario.dniTipo
            ? { id: usuario.dniTipo.id, nombre: usuario.dniTipo.nombre }
            : null,
          dni: usuario.dni,
          contrato: usuario.contrato,
          rol: usuario.rol
            ? { id: usuario.rol.id, nombre: usuario.rol.role }
            : null,
          estado: usuario.estado
            ? { id: usuario.estado.id, nombre: usuario.estado.estado }
            : null,
        },
      };
    } catch (err) {
      throw new UnauthorizedException('Refresh token inválido o expirado.');
    }
  }

  async sendEmailVerification(email: string) {
    const usuario = await this.usuarioRepo.findOne({ where: { email } });
    if (!usuario) {
      throw new NotFoundException('No existe un usuario con ese correo');
    }

    if (usuario.emailVerificado) {
      throw new BadRequestException('El correo ya está verificado');
    }

    const payload = { sub: usuario.id, email: usuario.email };
    const token = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_EMAIL_SECRET'),
      expiresIn: '1h', // Token válido por 1 hora
    });

    const domain = this.configService.get<string>('APP_DOMAIN');
    const verifyUrl = `${domain}/auth/verify-email?token=${token}`;

    if (!usuario.email) {
      throw new Error('El usuario no tiene un email válido');
    }
    await this.mailerService.sendMail({
      to: usuario.email,
      subject: 'Verificación de correo electrónico',
      template: './verify-email',
      context: {
        name: usuario.nombre ?? usuario.apellido ?? '',
        url: verifyUrl,
      },
    });

    return { message: '📧 Correo de verificación enviado' };
  }

  async verifyEmail(token: string) {
    try {
      const payload = this.jwtService.verify(token, {
        secret: this.configService.get<string>('JWT_EMAIL_SECRET'),
      });

      const usuario = await this.usuarioRepo.findOne({
        where: { id: payload.sub },
      });

      if (!usuario) {
        throw new NotFoundException('Usuario no encontrado');
      }

      usuario.emailVerificado = true;
      await this.usuarioRepo.save(usuario);

      return { message: '✅ Email verificado correctamente' };
    } catch (error) {
      throw new BadRequestException('Token inválido o expirado');
    }
  }

  async forgotPassword(email: string) {
    const usuario = await this.usuarioRepo.findOne({ where: { email } });
    if (!usuario) {
      throw new NotFoundException('No se encontró un usuario con ese correo');
    }

    // Crear el payload del token
    const payload = { email: usuario.email, sub: usuario.id };

    // Firmar el token JWT temporal
    const token = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_SECRET'),
      expiresIn: this.configService.get<string>('JWT_SECRET_EXPIRES_IN'), // '15m'
    });

    // Guardar el token temporal y expiración manual (opcional si solo quieres validar el token como JWT)

    await this.usuarioRepo.save(usuario);

    const domain = this.configService.get<string>('APP_DOMAIN');
    const resetUrl = `${domain}/auth/reset-password?token=${token}`;

    await this.mailerService.sendMail({
      to: email,
      subject: 'Recuperación de contraseña',
      template: './forgot-password',
      context: {
        name: usuario.nombre ?? usuario.apellido,
        url: resetUrl,
      },
    });

    return {
      message:
        '📧 Si el correo existe, se ha enviado un enlace de recuperación',
    };
  }

  async resetPassword(token: string, newPassword: string) {
    try {
      // Verificamos el token JWT
      const payload = this.jwtService.verify(token, {
        secret: this.configService.get<string>('JWT_SECRET'),
      });

      // payload.email viene del token
      const usuario = await this.usuarioRepo.findOne({
        where: { email: payload.email },
      });

      if (!usuario) {
        throw new NotFoundException('Usuario no encontrado');
      }

      // Guardar nueva contraseña
      usuario.password = await bcrypt.hash(newPassword, 10);

      await this.usuarioRepo.save(usuario);

      return {
        message: '✅ Contraseña actualizada correctamente',
      };
    } catch (error) {
      throw new BadRequestException('Token inválido o expirado');
    }
  }
}
