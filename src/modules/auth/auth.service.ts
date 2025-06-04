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

  async validateUser(contrato: string, password: string): Promise<Usuario> {
    const usuario = await this.usuarioRepo.findOne({
      where: { contrato },
      relations: ['rol', 'estado', 'sexo', 'estrato', 'dniTipo'],
    });

    if (!usuario || !usuario.password) {
      throw new UnauthorizedException('Contrato o contraseña inválidos');
    }

    const isMatch = await bcrypt.compare(password, usuario.password);
    if (!isMatch) {
      throw new UnauthorizedException('Contrato o contraseña inválidos');
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
