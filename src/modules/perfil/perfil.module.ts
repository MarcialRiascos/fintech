import { Module } from '@nestjs/common';
import { PerfilController } from './perfil.controller';
import { PerfilService } from './perfil.service';
import { UsuariosModule } from '../usuarios/usuarios.module';
import { JwtModule } from '@nestjs/jwt';
import { MailerModule } from '@nestjs-modules/mailer';

@Module({
  imports: [
    UsuariosModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'default_secret',
      signOptions: { expiresIn: '1h' },
    }),
    MailerModule, // Asegúrate de configurar MailerModule según tu proveedor de correo
  ],
  controllers: [PerfilController],
  providers: [PerfilService],
})
export class PerfilModule {}
