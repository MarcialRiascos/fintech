// src/seeders/roles.seeder.ts
import { AppDataSource } from '../data-source';  // ruta a tu data-source en la raíz
import { DniTipo } from '../modules/dni-tipos/entities/dni-tipo.entity';

export async function seedDniTipos() {
  const repo = AppDataSource.getRepository(DniTipo);
  const nombres = ['CC', 'PAS', 'CE', 'NIT'];

  for (const nombre of nombres) {
    const exist = await repo.findOne({ where: { nombre } });
    if (!exist) {
      await repo.save({ nombre });
    }
  }
  console.log('✅ DniTpos insertados');
}