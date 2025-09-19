// src/seeders/roles.seeder.ts
import { AppDataSource } from '../data-source';  // ruta a tu data-source en la raíz
import { Estado } from '../modules/estados/entities/estado.entity';

export async function seedEstados() {
  const repo = AppDataSource.getRepository(Estado);
  const estados = ['Activo', 'Inactivo', 'Operativo', 'Suspendido', 'Desconectado', 'Registrado', 'Retirado', 'Pagando', 'Pagado', 'Cancelado', 'Pendiente', 'Confirmado'];

  for (const estado of estados) {
    const exist = await repo.findOne({ where: { estado } });
    if (!exist) {
      await repo.save({ estado });
    }
  }
  console.log('✅ Estados insertados');
}