// src/seeders/usuarios.seeder.ts
import { AppDataSource } from '../data-source';
import { Usuario } from '../modules/usuarios/entities/usuario.entity';
import { hash } from 'bcrypt';
import { DniTipo } from '../modules/dni-tipos/entities/dni-tipo.entity';
import { Estado } from '../modules/estados/entities/estado.entity';
import { Sexo } from '../modules/sexos/entities/sexo.entity';
import { Estrato } from '../modules/estratos/entities/estrato.entity';
import { Rol } from '../modules/roles/entities/rol.entity';

export async function seedUsuarios() {
  const usuarioRepo = AppDataSource.getRepository(Usuario);

  const dniTipo1 = await AppDataSource.getRepository(DniTipo).findOneByOrFail({ id: 1 });
  const dniTipo2 = await AppDataSource.getRepository(DniTipo).findOneByOrFail({ id: 2 });

  const estado1 = await AppDataSource.getRepository(Estado).findOneByOrFail({ id: 1 });

  const sexo1 = await AppDataSource.getRepository(Sexo).findOneByOrFail({ id: 1 });
  const sexo2 = await AppDataSource.getRepository(Sexo).findOneByOrFail({ id: 2 });

  const estrato1 = await AppDataSource.getRepository(Estrato).findOneByOrFail({ id: 1 });
  const estrato2 = await AppDataSource.getRepository(Estrato).findOneByOrFail({ id: 2 });

  const rol1 = await AppDataSource.getRepository(Rol).findOneByOrFail({ id: 1 });
  const rol2 = await AppDataSource.getRepository(Rol).findOneByOrFail({ id: 2 });

   const usuarios = [
    {
      nombre: 'Juan',
      apellido: 'Pérez',
      dniTipo: dniTipo1,
      dni: '123456789',
      contrato: 'Contrato-001',
      nacionalidad: 'Colombiana',
      codigo_departamento: '05',
      departamento: 'Antioquia',
      codigo_municipio: '05001',
      municipio: 'Medellín',
      via_principal_clave: 'CL',
      via_principal_valor: '50',
      via_secundaria_clave: 'CR',
      via_secundaria_valor: '30',
      tipo_unidad_uno_clave: 'AP',
      tipo_unidad_uno_valor: '302',
      tipo_unidad_dos_clave: 'ET',
      tipo_unidad_dos_valor: '1',
      barrio: 'El Poblado',
      latitud: '6.2442',
      longitud: '-75.5812',
      direccion: 'Cra 30 #50-302',
      telefono_uno: '3001234567',
      telefono_dos: '3107654321',
      Telefono_tres: '3201112233',
      password: await hash('123456', 10), // 👈 Cifrado con bcrypt
      email: 'juan.perez@example.com',
      fecha_nacimiento: new Date('1990-05-20'),
      anexo: '',
      estado: estado1,
      sexo: sexo1,
      estrato: estrato1,
      rol: rol1,
    },
    {
      nombre: 'Ana',
      apellido: 'Gómez',
      dniTipo: dniTipo2,
      dni: '987654321',
      contrato: 'Contrato-002',
      nacionalidad: 'Colombiana',
      codigo_departamento: '08',
      departamento: 'Atlántico',
      codigo_municipio: '08001',
      municipio: 'Barranquilla',
      via_principal_clave: 'AV',
      via_principal_valor: '10',
      via_secundaria_clave: 'CL',
      via_secundaria_valor: '12',
      tipo_unidad_uno_clave: 'CA',
      tipo_unidad_uno_valor: '5',
      tipo_unidad_dos_clave: 'PT',
      tipo_unidad_dos_valor: '1',
      barrio: 'El Prado',
      latitud: '10.9685',
      longitud: '-74.7813',
      direccion: 'Av 10 #12-5',
      telefono_uno: '3007654321',
      telefono_dos: '3101234567',
      Telefono_tres: '3203334444',
      password: await hash('123456', 10), // Idealmente ya cifrada
      email: 'ana.gomez@example.com',
      fecha_nacimiento: new Date('1985-08-10'),
      anexo: '',
      estado: estado1,
      sexo: sexo2,
      estrato: estrato2,
      rol: rol2,
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
