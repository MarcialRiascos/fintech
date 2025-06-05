import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Usuario } from '../../modules/usuarios/entities/usuario.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Usuario)
    private readonly usuarioRepo: Repository<Usuario>,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}
async validateUser(identificador: string, password: string): Promise<Usuario> {
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
}
