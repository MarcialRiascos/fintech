// src/auth/auth.service.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Usuario } from '../../modules/usuarios/entities/usuario.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Usuario)
    private readonly usuarioRepo: Repository<Usuario>,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(contrato: string, password: string): Promise<Usuario> {
    const usuario = await this.usuarioRepo.findOne({
      where: { contrato },
      relations: ['rol', 'estado'], // Ajusta según tus necesidades
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
    const payload = { sub: usuario.id, contrato: usuario.contrato, rol: usuario.rol?.role };
    return {
      access_token: this.jwtService.sign(payload),
      usuario,
    };
  }
}
