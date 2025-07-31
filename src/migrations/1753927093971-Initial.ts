import { MigrationInterface, QueryRunner } from "typeorm";

export class Initial1753927093971 implements MigrationInterface {
    name = 'Initial1753927093971'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`dni_tipos\` (\`created_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`id\` int UNSIGNED NOT NULL AUTO_INCREMENT, \`dni_tipos\` varchar(45) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`estados\` (\`created_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`id\` int UNSIGNED NOT NULL AUTO_INCREMENT, \`estado\` varchar(45) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`sexos\` (\`created_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`id\` int UNSIGNED NOT NULL AUTO_INCREMENT, \`sexo\` varchar(45) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`estratos\` (\`created_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`id\` int UNSIGNED NOT NULL AUTO_INCREMENT, \`estrato\` varchar(45) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`roles\` (\`created_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`id\` int UNSIGNED NOT NULL AUTO_INCREMENT, \`role\` varchar(45) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`creditos\` (\`id\` int NOT NULL AUTO_INCREMENT, \`codigo\` varchar(45) NOT NULL, \`monto\` decimal(15,2) NOT NULL, \`cuota_pago\` decimal(15,2) NOT NULL, \`cliente_id\` int UNSIGNED NULL, \`asignado_por_id\` int UNSIGNED NULL, \`estado_id\` int UNSIGNED NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`usuarios\` (\`created_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`id\` int UNSIGNED NOT NULL AUTO_INCREMENT, \`nombre\` varchar(100) NULL, \`apellido\` varchar(100) NULL, \`dni\` varchar(100) NULL, \`contrato\` varchar(100) NULL, \`nacionalidad\` varchar(100) NULL, \`codigo_departamento\` varchar(100) NULL, \`departamento\` varchar(100) NULL, \`codigo_municipio\` varchar(100) NULL, \`municipio\` varchar(100) NULL, \`via_principal_clave\` varchar(100) NULL, \`via_principal_valor\` varchar(100) NULL, \`via_secundaria_clave\` varchar(100) NULL, \`via_secundaria_valor\` varchar(100) NULL, \`tipo_unidad_uno_clave\` varchar(100) NULL, \`tipo_unidad_uno_valor\` varchar(100) NULL, \`tipo_unidad_dos_clave\` varchar(100) NULL, \`tipo_unidad_dos_valor\` varchar(100) NULL, \`barrio\` varchar(100) NULL, \`latitud\` varchar(100) NULL, \`longitud\` varchar(100) NULL, \`direccion\` varchar(100) NULL, \`telefono_uno\` varchar(100) NULL, \`telefono_dos\` varchar(100) NULL, \`telefono_tres\` varchar(100) NULL, \`password\` text NULL, \`email\` varchar(100) NULL, \`fecha_nacimiento\` varchar(100) NULL, \`anexo\` text NULL, \`emailVerificado\` tinyint NOT NULL DEFAULT 0, \`reset_password_token\` varchar(255) NULL, \`reset_password_expires\` datetime NULL, \`dni_tipos_id\` int UNSIGNED NULL, \`estados_id\` int UNSIGNED NULL, \`sexos_id\` int UNSIGNED NULL, \`estratos_id\` int UNSIGNED NULL, \`roles_id\` int UNSIGNED NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`tiendas\` (\`id\` int NOT NULL AUTO_INCREMENT, \`nombre\` varchar(100) NOT NULL, \`descripcion\` varchar(100) NOT NULL, \`nit\` varchar(45) NOT NULL, \`dv\` int NOT NULL, \`nacionalidad\` varchar(45) NOT NULL, \`codigo_departamento\` varchar(45) NOT NULL, \`departamento\` varchar(45) NOT NULL, \`codigo_municipio\` varchar(45) NOT NULL, \`municipio\` varchar(45) NOT NULL, \`via_principal_clave\` varchar(45) NOT NULL, \`via_principal_valor\` varchar(45) NOT NULL, \`via_secundaria_clave\` varchar(45) NOT NULL, \`via_secundaria_valor\` varchar(45) NOT NULL, \`tipo_unidad_uno_clave\` varchar(45) NOT NULL, \`tipo_unidad_uno_valor\` varchar(45) NOT NULL, \`tipo_unidad_dos_clave\` varchar(45) NOT NULL, \`tipo_unidad_dos_valor\` varchar(45) NOT NULL, \`barrio\` varchar(45) NOT NULL, \`latitud\` varchar(45) NOT NULL, \`longitud\` varchar(45) NOT NULL, \`direccion\` varchar(45) NOT NULL, \`telefono_uno\` varchar(45) NOT NULL, \`telefono_dos\` varchar(45) NOT NULL, \`telefono_tres\` varchar(45) NOT NULL, \`estados_id\` int UNSIGNED NULL, \`usuarios_id\` int UNSIGNED NULL, \`usuarios_id1\` int UNSIGNED NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`creditos\` ADD CONSTRAINT \`FK_c7fc008cb8acdeb47f47d637894\` FOREIGN KEY (\`cliente_id\`) REFERENCES \`usuarios\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`creditos\` ADD CONSTRAINT \`FK_b6614e2581874640998d489c4d1\` FOREIGN KEY (\`asignado_por_id\`) REFERENCES \`usuarios\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`creditos\` ADD CONSTRAINT \`FK_c3430f966e885709d6b9202b5f7\` FOREIGN KEY (\`estado_id\`) REFERENCES \`estados\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`usuarios\` ADD CONSTRAINT \`FK_ce3ae280065412e091a080372f5\` FOREIGN KEY (\`dni_tipos_id\`) REFERENCES \`dni_tipos\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`usuarios\` ADD CONSTRAINT \`FK_2085bf8ad0172da09676fa67d76\` FOREIGN KEY (\`estados_id\`) REFERENCES \`estados\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`usuarios\` ADD CONSTRAINT \`FK_ad0600ba0c3ccd924ddfd2de481\` FOREIGN KEY (\`sexos_id\`) REFERENCES \`sexos\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`usuarios\` ADD CONSTRAINT \`FK_81432c4eb8f9e176a4dc0f8c0fb\` FOREIGN KEY (\`estratos_id\`) REFERENCES \`estratos\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`usuarios\` ADD CONSTRAINT \`FK_28de221731be7761ba1b165df08\` FOREIGN KEY (\`roles_id\`) REFERENCES \`roles\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`tiendas\` ADD CONSTRAINT \`FK_fea61e28ed4e34fb184461c41c3\` FOREIGN KEY (\`estados_id\`) REFERENCES \`estados\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`tiendas\` ADD CONSTRAINT \`FK_5b0a19520cde0223e62c31b03d3\` FOREIGN KEY (\`usuarios_id\`) REFERENCES \`usuarios\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`tiendas\` ADD CONSTRAINT \`FK_a10ad254b6af53bd0ae207ab13d\` FOREIGN KEY (\`usuarios_id1\`) REFERENCES \`usuarios\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`tiendas\` DROP FOREIGN KEY \`FK_a10ad254b6af53bd0ae207ab13d\``);
        await queryRunner.query(`ALTER TABLE \`tiendas\` DROP FOREIGN KEY \`FK_5b0a19520cde0223e62c31b03d3\``);
        await queryRunner.query(`ALTER TABLE \`tiendas\` DROP FOREIGN KEY \`FK_fea61e28ed4e34fb184461c41c3\``);
        await queryRunner.query(`ALTER TABLE \`usuarios\` DROP FOREIGN KEY \`FK_28de221731be7761ba1b165df08\``);
        await queryRunner.query(`ALTER TABLE \`usuarios\` DROP FOREIGN KEY \`FK_81432c4eb8f9e176a4dc0f8c0fb\``);
        await queryRunner.query(`ALTER TABLE \`usuarios\` DROP FOREIGN KEY \`FK_ad0600ba0c3ccd924ddfd2de481\``);
        await queryRunner.query(`ALTER TABLE \`usuarios\` DROP FOREIGN KEY \`FK_2085bf8ad0172da09676fa67d76\``);
        await queryRunner.query(`ALTER TABLE \`usuarios\` DROP FOREIGN KEY \`FK_ce3ae280065412e091a080372f5\``);
        await queryRunner.query(`ALTER TABLE \`creditos\` DROP FOREIGN KEY \`FK_c3430f966e885709d6b9202b5f7\``);
        await queryRunner.query(`ALTER TABLE \`creditos\` DROP FOREIGN KEY \`FK_b6614e2581874640998d489c4d1\``);
        await queryRunner.query(`ALTER TABLE \`creditos\` DROP FOREIGN KEY \`FK_c7fc008cb8acdeb47f47d637894\``);
        await queryRunner.query(`DROP TABLE \`tiendas\``);
        await queryRunner.query(`DROP TABLE \`usuarios\``);
        await queryRunner.query(`DROP TABLE \`creditos\``);
        await queryRunner.query(`DROP TABLE \`roles\``);
        await queryRunner.query(`DROP TABLE \`estratos\``);
        await queryRunner.query(`DROP TABLE \`sexos\``);
        await queryRunner.query(`DROP TABLE \`estados\``);
        await queryRunner.query(`DROP TABLE \`dni_tipos\``);
    }

}
