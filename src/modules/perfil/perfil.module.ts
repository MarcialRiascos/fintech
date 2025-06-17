import { Module } from '@nestjs/common';
import { PerfilController } from './perfil.controller';
import { UsuariosModule } from '../usuarios/usuarios.module';
import { PerfilService } from './perfil.service';

@Module({
  imports: [UsuariosModule],
  controllers: [PerfilController],
   providers: [PerfilService],
})
export class PerfilModule {}
