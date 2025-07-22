// src/seeders/roles.seeder.ts
import { AppDataSource } from '../data-source';  // ruta a tu data-source en la raíz
import { Rol } from '../modules/roles/entities/rol.entity';

export async function seedRoles() {
  const repo = AppDataSource.getRepository(Rol);
  const roles = ['Super_Admin', 'Admin', 'Cliente', 'Representante', 'Recaudador'];

  for (const role of roles) {
    const exist = await repo.findOne({ where: { role } });
    if (!exist) {
      await repo.save({ role });
    }
  }
  console.log('✅ Roles insertados');
}