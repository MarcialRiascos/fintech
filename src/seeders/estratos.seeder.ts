// src/seeders/roles.seeder.ts
import { AppDataSource } from '../data-source';  // ruta a tu data-source en la raíz
import { Estrato } from '../modules/estratos/entities/estrato.entity';

export async function seedEstratos() {
  const repo = AppDataSource.getRepository(Estrato);
  const estratos = ['1', '2', '3', '4', '5', '6'];

  for (const estrato of estratos) {
    const exist = await repo.findOne({ where: { estrato } });
    if (!exist) {
      await repo.save({ estrato });
    }
  }
  console.log('✅ Estratos insertados');
}