import { MigrationInterface, QueryRunner } from "typeorm";

export class Initial1755651733124 implements MigrationInterface {
    name = 'Initial1755651733124'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`dni_tipos\` (\`created_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`id\` int UNSIGNED NOT NULL AUTO_INCREMENT, \`dni_tipos\` varchar(45) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`tiendas\` (\`id\` int NOT NULL AUTO_INCREMENT, \`nombre\` varchar(100) NOT NULL, \`descripcion\` varchar(100) NOT NULL, \`nit\` varchar(45) NOT NULL, \`dv\` int NOT NULL, \`nacionalidad\` varchar(45) NOT NULL, \`codigo_departamento\` varchar(45) NOT NULL, \`departamento\` varchar(45) NOT NULL, \`codigo_municipio\` varchar(45) NOT NULL, \`municipio\` varchar(45) NOT NULL, \`via_principal_clave\` varchar(45) NOT NULL, \`via_principal_valor\` varchar(45) NOT NULL, \`via_secundaria_clave\` varchar(45) NOT NULL, \`via_secundaria_valor\` varchar(45) NOT NULL, \`tipo_unidad_uno_clave\` varchar(45) NOT NULL, \`tipo_unidad_uno_valor\` varchar(45) NOT NULL, \`tipo_unidad_dos_clave\` varchar(45) NOT NULL, \`tipo_unidad_dos_valor\` varchar(45) NOT NULL, \`barrio\` varchar(45) NOT NULL, \`latitud\` varchar(45) NOT NULL, \`longitud\` varchar(45) NOT NULL, \`direccion\` varchar(45) NOT NULL, \`telefono_uno\` varchar(45) NOT NULL, \`telefono_dos\` varchar(45) NOT NULL, \`telefono_tres\` varchar(45) NOT NULL, \`estados_id\` int UNSIGNED NULL, \`representante_id\` int UNSIGNED NULL, \`asignado_por_id\` int UNSIGNED NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`img_productos\` (\`id\` int NOT NULL AUTO_INCREMENT, \`url\` varchar(45) NOT NULL, \`productoId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`productos\` (\`id\` int NOT NULL AUTO_INCREMENT, \`nombre\` varchar(45) NOT NULL, \`descripcion\` varchar(45) NOT NULL, \`precio\` decimal(15,2) NOT NULL, \`stock\` int NOT NULL, \`estados_id\` int UNSIGNED NULL, \`tiendas_id\` int NULL, \`usuarios_id\` int UNSIGNED NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`estados\` (\`created_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`id\` int UNSIGNED NOT NULL AUTO_INCREMENT, \`estado\` varchar(45) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`sexos\` (\`created_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`id\` int UNSIGNED NOT NULL AUTO_INCREMENT, \`sexo\` varchar(45) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`roles\` (\`created_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`id\` int UNSIGNED NOT NULL AUTO_INCREMENT, \`role\` varchar(45) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`creditos\` (\`id\` int NOT NULL AUTO_INCREMENT, \`codigo\` varchar(45) NOT NULL, \`monto\` decimal(15,2) NOT NULL, \`cuota_pago\` decimal(15,2) NOT NULL, \`cliente_id\` int UNSIGNED NULL, \`asignado_por_id\` int UNSIGNED NULL, \`estado_id\` int UNSIGNED NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`usuarios\` (\`created_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`id\` int UNSIGNED NOT NULL AUTO_INCREMENT, \`nombre\` varchar(100) NULL, \`apellido\` varchar(100) NULL, \`dni\` varchar(100) NULL, \`contrato\` varchar(100) NULL, \`nacionalidad\` varchar(100) NULL, \`barrio\` varchar(100) NULL, \`direccion\` varchar(100) NULL, \`telefono_uno\` varchar(100) NULL, \`password\` text NULL, \`email\` varchar(100) NULL, \`fecha_nacimiento\` date NULL, \`mes\` decimal(15,2) NULL, \`f_prim_act\` varchar(45) NULL, \`f_ult_dx\` varchar(45) NULL, \`f_ult_p\` varchar(45) NULL, \`ult_p\` decimal(15,2) NULL, \`saldo\` decimal(15,2) NULL, \`mora\` int NULL, \`emailVerificado\` tinyint NOT NULL DEFAULT 0, \`dni_tipos_id\` int UNSIGNED NULL, \`estados_id\` int UNSIGNED NULL, \`sexos_id\` int UNSIGNED NULL, \`roles_id\` int UNSIGNED NULL, UNIQUE INDEX \`IDX_446adfc18b35418aac32ae0b7b\` (\`email\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`img_tiendas\` (\`id\` int NOT NULL AUTO_INCREMENT, \`url\` varchar(255) NOT NULL, \`tiendas_id\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`estratos\` (\`created_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`id\` int UNSIGNED NOT NULL AUTO_INCREMENT, \`estrato\` varchar(45) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`tiendas\` ADD CONSTRAINT \`FK_fea61e28ed4e34fb184461c41c3\` FOREIGN KEY (\`estados_id\`) REFERENCES \`estados\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`tiendas\` ADD CONSTRAINT \`FK_0cb853d9d6d7fa91fb8a2a2c54c\` FOREIGN KEY (\`representante_id\`) REFERENCES \`usuarios\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`tiendas\` ADD CONSTRAINT \`FK_7c0d0dda7b043f31b38c9d531e3\` FOREIGN KEY (\`asignado_por_id\`) REFERENCES \`usuarios\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`img_productos\` ADD CONSTRAINT \`FK_197f0a2e21a9a84e61e981dec89\` FOREIGN KEY (\`productoId\`) REFERENCES \`productos\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`productos\` ADD CONSTRAINT \`FK_3d15ed26b1a30ca6413affe2331\` FOREIGN KEY (\`estados_id\`) REFERENCES \`estados\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`productos\` ADD CONSTRAINT \`FK_ded5721b59c2820361f6cca4c33\` FOREIGN KEY (\`tiendas_id\`) REFERENCES \`tiendas\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`productos\` ADD CONSTRAINT \`FK_fbfa501f834c0bff5b73c650056\` FOREIGN KEY (\`usuarios_id\`) REFERENCES \`usuarios\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`creditos\` ADD CONSTRAINT \`FK_c7fc008cb8acdeb47f47d637894\` FOREIGN KEY (\`cliente_id\`) REFERENCES \`usuarios\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`creditos\` ADD CONSTRAINT \`FK_b6614e2581874640998d489c4d1\` FOREIGN KEY (\`asignado_por_id\`) REFERENCES \`usuarios\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`creditos\` ADD CONSTRAINT \`FK_c3430f966e885709d6b9202b5f7\` FOREIGN KEY (\`estado_id\`) REFERENCES \`estados\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`usuarios\` ADD CONSTRAINT \`FK_ce3ae280065412e091a080372f5\` FOREIGN KEY (\`dni_tipos_id\`) REFERENCES \`dni_tipos\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`usuarios\` ADD CONSTRAINT \`FK_2085bf8ad0172da09676fa67d76\` FOREIGN KEY (\`estados_id\`) REFERENCES \`estados\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`usuarios\` ADD CONSTRAINT \`FK_ad0600ba0c3ccd924ddfd2de481\` FOREIGN KEY (\`sexos_id\`) REFERENCES \`sexos\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`usuarios\` ADD CONSTRAINT \`FK_28de221731be7761ba1b165df08\` FOREIGN KEY (\`roles_id\`) REFERENCES \`roles\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`img_tiendas\` ADD CONSTRAINT \`FK_de574cc0de8f1f56c34db1dcffa\` FOREIGN KEY (\`tiendas_id\`) REFERENCES \`tiendas\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`img_tiendas\` DROP FOREIGN KEY \`FK_de574cc0de8f1f56c34db1dcffa\``);
        await queryRunner.query(`ALTER TABLE \`usuarios\` DROP FOREIGN KEY \`FK_28de221731be7761ba1b165df08\``);
        await queryRunner.query(`ALTER TABLE \`usuarios\` DROP FOREIGN KEY \`FK_ad0600ba0c3ccd924ddfd2de481\``);
        await queryRunner.query(`ALTER TABLE \`usuarios\` DROP FOREIGN KEY \`FK_2085bf8ad0172da09676fa67d76\``);
        await queryRunner.query(`ALTER TABLE \`usuarios\` DROP FOREIGN KEY \`FK_ce3ae280065412e091a080372f5\``);
        await queryRunner.query(`ALTER TABLE \`creditos\` DROP FOREIGN KEY \`FK_c3430f966e885709d6b9202b5f7\``);
        await queryRunner.query(`ALTER TABLE \`creditos\` DROP FOREIGN KEY \`FK_b6614e2581874640998d489c4d1\``);
        await queryRunner.query(`ALTER TABLE \`creditos\` DROP FOREIGN KEY \`FK_c7fc008cb8acdeb47f47d637894\``);
        await queryRunner.query(`ALTER TABLE \`productos\` DROP FOREIGN KEY \`FK_fbfa501f834c0bff5b73c650056\``);
        await queryRunner.query(`ALTER TABLE \`productos\` DROP FOREIGN KEY \`FK_ded5721b59c2820361f6cca4c33\``);
        await queryRunner.query(`ALTER TABLE \`productos\` DROP FOREIGN KEY \`FK_3d15ed26b1a30ca6413affe2331\``);
        await queryRunner.query(`ALTER TABLE \`img_productos\` DROP FOREIGN KEY \`FK_197f0a2e21a9a84e61e981dec89\``);
        await queryRunner.query(`ALTER TABLE \`tiendas\` DROP FOREIGN KEY \`FK_7c0d0dda7b043f31b38c9d531e3\``);
        await queryRunner.query(`ALTER TABLE \`tiendas\` DROP FOREIGN KEY \`FK_0cb853d9d6d7fa91fb8a2a2c54c\``);
        await queryRunner.query(`ALTER TABLE \`tiendas\` DROP FOREIGN KEY \`FK_fea61e28ed4e34fb184461c41c3\``);
        await queryRunner.query(`DROP TABLE \`estratos\``);
        await queryRunner.query(`DROP TABLE \`img_tiendas\``);
        await queryRunner.query(`DROP INDEX \`IDX_446adfc18b35418aac32ae0b7b\` ON \`usuarios\``);
        await queryRunner.query(`DROP TABLE \`usuarios\``);
        await queryRunner.query(`DROP TABLE \`creditos\``);
        await queryRunner.query(`DROP TABLE \`roles\``);
        await queryRunner.query(`DROP TABLE \`sexos\``);
        await queryRunner.query(`DROP TABLE \`estados\``);
        await queryRunner.query(`DROP TABLE \`productos\``);
        await queryRunner.query(`DROP TABLE \`img_productos\``);
        await queryRunner.query(`DROP TABLE \`tiendas\``);
        await queryRunner.query(`DROP TABLE \`dni_tipos\``);
    }

}
