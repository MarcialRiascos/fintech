// src/seeders/roles.seeder.ts
import { AppDataSource } from '../data-source';  // ruta a tu data-source en la raíz
import { Sexo } from '../modules/sexos/entities/sexo.entity';

export async function seedSexos() {
  const repo = AppDataSource.getRepository(Sexo);
  const sexos = ['Masculino', 'Femenino'];

  for (const sexo of sexos) {
    const exist = await repo.findOne({ where: { sexo } });
    if (!exist) {
      await repo.save({ sexo });
    }
  }
  console.log('✅ Sexos insertados');
}