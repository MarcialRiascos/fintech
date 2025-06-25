import {
  Injectable,
  UnauthorizedException,
  NotFoundException,
  BadRequestException
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Usuario } from '../../modules/usuarios/entities/usuario.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { MailerService } from '@nestjs-modules/mailer';




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
      .leftJoinAndSelect('usuario.estrato', 'estrato')
      .leftJoinAndSelect('usuario.dniTipo', 'dniTipo')
      .where('usuario.contrato = :identificador', { identificador })
      .orWhere('usuario.dni = :identificador', { identificador })
      .getOne();
      

    if (!usuario || !usuario.password) {
      throw new UnauthorizedException('Identificador o contraseña inválidos');
    }

     if (!usuario.emailVerificado) {
    throw new UnauthorizedException('Debes verificar tu correo antes de iniciar sesión');
  }

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
      usuario,
    };
  }

  // auth.service.ts
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
  usuario.resetPasswordToken = token;
  usuario.resetPasswordExpires = new Date(Date.now() + 15 * 60 * 1000); // 15 minutos
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
    message: '📧 Si el correo existe, se ha enviado un enlace de recuperación',
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
    usuario.resetPasswordToken = null;
    usuario.resetPasswordExpires = null;

    await this.usuarioRepo.save(usuario);

    return {
      message: '✅ Contraseña actualizada correctamente',
    };
  } catch (error) {
    throw new BadRequestException('Token inválido o expirado');
  }
}

}
