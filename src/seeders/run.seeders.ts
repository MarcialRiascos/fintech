import { AppDataSource } from '../data-source';
import { seedRoles } from './roles.seeder';
import { seedEstados } from './estados.seeder';
import { seedSexos } from './sexos.seeder';
import { seedEstratos } from './estratos.seeder';
import { seedDniTipos } from './dni-tipos.seeder';
import { seedUsuarios } from './usuarios.seeder';

async function runSeeders() {
  try {
    await AppDataSource.initialize();
    console.log('✅ Base de datos conectada');

    await seedRoles();
    await seedEstados();
    await seedSexos();
    await seedEstratos();
    await seedDniTipos();
    await seedUsuarios();

    console.log('🌱 Seeding completo');
    process.exit(0); // Finaliza corr
  } catch (error) {
    console.error('❌ Error durante el seeding:', error);
    process.exit(1); // Finaliza con error
  }
}

runSeeders();