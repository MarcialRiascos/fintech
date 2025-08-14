// src/seeders/usuarios.seeder.ts
import { AppDataSource } from '../data-source';
import { Usuario } from '../modules/usuarios/entities/usuario.entity';
import * as bcrypt from 'bcrypt';
import { DniTipo } from '../modules/dni-tipos/entities/dni-tipo.entity';
import { Estado } from '../modules/estados/entities/estado.entity';
import { Sexo } from '../modules/sexos/entities/sexo.entity';
import { Rol } from '../modules/roles/entities/rol.entity';

export async function seedUsuarios() {
  const usuarioRepo = AppDataSource.getRepository(Usuario);

  const dniTipo1 = await AppDataSource.getRepository(DniTipo).findOneByOrFail({
    id: 1,
  });
  const dniTipo2 = await AppDataSource.getRepository(DniTipo).findOneByOrFail({
    id: 2,
  });

  const estado1 = await AppDataSource.getRepository(Estado).findOneByOrFail({
    id: 1,
  });

  const sexo1 = await AppDataSource.getRepository(Sexo).findOneByOrFail({
    id: 1,
  });
  const sexo2 = await AppDataSource.getRepository(Sexo).findOneByOrFail({
    id: 2,
  });

  const rol1 = await AppDataSource.getRepository(Rol).findOneByOrFail({
    id: 1,
  });
  const rol2 = await AppDataSource.getRepository(Rol).findOneByOrFail({
    id: 2,
  });

  const usuarios = [
    {
      nombre: 'Juan',
      apellido: 'Pérez',
      dni: '123456789',
      dniTipo: dniTipo1, // FK del tipo de documento
      contrato: 'Contrato-001',
      nacionalidad: 'Colombiana',
      barrio: 'El Poblado',
      direccion: 'Cra 30 #50-302',
      telefono_uno: '3001234567',
      password: await bcrypt.hash('123456', 10),
      email: 'juan.perez@example.com',
      fecha_nacimiento: '1990-05-20',
      estado: estado1, // FK estado
      sexo: sexo1, // FK sexo
      rol: rol1, // Cliente
      mes: 'Enero',
      f_prim_act: '2024-01-01',
      f_ult_dx: '2024-02-01',
      f_ult_p: '2024-03-01',
      ult_p: 'Pago 3',
      saldo: '500000',
      mora: '0',
      emailVerificado: true,
    },
    {
      nombre: 'Ana',
      apellido: 'Gómez',
      dni: '987654321',
      dniTipo: dniTipo2,
      contrato: 'Contrato-002',
      nacionalidad: 'Colombiana',
      barrio: 'El Prado',
      direccion: 'Av 10 #12-5',
      telefono_uno: '3007654321',
      password: await bcrypt.hash('123456', 10),
      email: 'ana.gomez@example.com',
      fecha_nacimiento: '1985-08-10',
      estado: estado1,
      sexo: sexo2,
      rol: rol2,
      mes: 'Febrero',
      f_prim_act: '2024-02-01',
      f_ult_dx: '2024-03-01',
      f_ult_p: '2024-04-01',
      ult_p: 'Pago 1',
      saldo: '300000',
      mora: '0',
      emailVerificado: false,
    },
  ];

  for (const userData of usuarios) {
    const exist = await usuarioRepo.findOne({ where: { dni: userData.dni } });
    if (!exist) {
      const user = usuarioRepo.create(userData);
      await usuarioRepo.save(user);
    }
  }

  console.log('✅ Usuarios insertados');
}
