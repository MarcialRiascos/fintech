import { Module, MiddlewareConsumer } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { getTypeOrmConfig } from './config/typeorm.config';
import { LoggerMiddleware } from './common/middleware/logger.middleware';
import { AuthModule } from './modules/auth/auth.module';
import { DniTiposModule } from './modules/dni-tipos/dni-tipos.module';
import { EstadosModule } from './modules/estados/estados.module';
import { SexosModule } from './modules/sexos/sexos.module';
import { EstratosModule } from './modules/estratos/estratos.module';
import { RolesModule } from './modules/roles/roles.module';
import { UsuariosModule } from './modules/usuarios/usuarios.module';
import { PerfilModule } from './modules/perfil/perfil.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: getTypeOrmConfig,
    }),
    DniTiposModule,
    EstadosModule,
    SexosModule,
    EstratosModule,
    RolesModule,
    UsuariosModule,
    PerfilModule,
    AuthModule, 
    
  ],
})

export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*'); // aplica a todas las rutas
  }
}
