import { MigrationInterface, QueryRunner } from "typeorm";

export class Initial1757640227859 implements MigrationInterface {
    name = 'Initial1757640227859'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`dni_tipos\` (\`created_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`id\` int UNSIGNED NOT NULL AUTO_INCREMENT, \`dni_tipos\` varchar(45) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`img_productos\` (\`created_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`id\` int NOT NULL AUTO_INCREMENT, \`url\` varchar(255) NOT NULL, \`productos_id\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`productos\` (\`created_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`id\` int NOT NULL AUTO_INCREMENT, \`nombre\` varchar(45) NOT NULL, \`descripcion\` varchar(45) NOT NULL, \`precio_tienda\` decimal(15,2) NOT NULL, \`precio_senda\` decimal(15,2) NOT NULL, \`stock\` int NOT NULL, \`estados_id\` int UNSIGNED NULL, \`tiendas_id\` int NULL, \`usuarios_id\` int UNSIGNED NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`estados\` (\`created_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`id\` int UNSIGNED NOT NULL AUTO_INCREMENT, \`estado\` varchar(45) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`sexos\` (\`created_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`id\` int UNSIGNED NOT NULL AUTO_INCREMENT, \`sexo\` varchar(45) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`roles\` (\`created_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`id\` int UNSIGNED NOT NULL AUTO_INCREMENT, \`role\` varchar(45) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`creditos\` (\`created_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`id\` int NOT NULL AUTO_INCREMENT, \`codigo\` varchar(45) NOT NULL, \`monto\` decimal(15,2) NOT NULL, \`saldo\` decimal(15,2) NOT NULL, \`deuda\` decimal(15,2) NOT NULL, \`cuota_pago\` decimal(15,2) NOT NULL, \`cliente_id\` int UNSIGNED NULL, \`asignado_por_id\` int UNSIGNED NULL, \`estado_id\` int UNSIGNED NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`usuarios\` (\`created_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`id\` int UNSIGNED NOT NULL AUTO_INCREMENT, \`nombre\` varchar(100) NULL, \`apellido\` varchar(100) NULL, \`dni\` varchar(100) NULL, \`contrato\` varchar(100) NULL, \`nacionalidad\` varchar(100) NULL, \`barrio\` varchar(100) NULL, \`direccion\` varchar(100) NULL, \`telefono_uno\` varchar(100) NULL, \`password\` text NULL, \`email\` varchar(100) NULL, \`fecha_nacimiento\` date NULL, \`mes\` decimal(15,2) NULL, \`f_prim_act\` varchar(45) NULL, \`f_ult_dx\` varchar(45) NULL, \`f_ult_p\` varchar(45) NULL, \`ult_p\` decimal(15,2) NULL, \`saldo\` decimal(15,2) NULL, \`mora\` int NULL, \`emailVerificado\` tinyint NOT NULL DEFAULT 0, \`dni_tipos_id\` int UNSIGNED NULL, \`estados_id\` int UNSIGNED NULL, \`sexos_id\` int UNSIGNED NULL, \`roles_id\` int UNSIGNED NULL, UNIQUE INDEX \`IDX_446adfc18b35418aac32ae0b7b\` (\`email\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`img_tiendas\` (\`created_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`id\` int NOT NULL AUTO_INCREMENT, \`url\` varchar(255) NOT NULL, \`tiendas_id\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`tiendas\` (\`created_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`id\` int NOT NULL AUTO_INCREMENT, \`nombre\` varchar(100) NOT NULL, \`descripcion\` varchar(100) NOT NULL, \`nit\` varchar(45) NOT NULL, \`dv\` int NOT NULL, \`barrio\` varchar(45) NOT NULL, \`direccion\` varchar(100) NOT NULL, \`telefono_uno\` varchar(20) NOT NULL, \`porcentaje\` decimal(15,2) NOT NULL, \`estados_id\` int UNSIGNED NULL, \`usuarios_id\` int UNSIGNED NULL, \`usuarios_id1\` int UNSIGNED NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`productos_has_orden_compra\` (\`id\` int NOT NULL AUTO_INCREMENT, \`precio_tienda\` decimal(15,2) NOT NULL, \`precio_senda\` decimal(15,2) NOT NULL, \`cantidad\` decimal(8,2) NOT NULL, \`productos_id\` int NULL, \`orden_compra_id\` int NULL, \`estados_id\` int UNSIGNED NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`pagos\` (\`id\` int NOT NULL AUTO_INCREMENT, \`monto_pagado\` decimal(15,2) NOT NULL, \`referencia\` varchar(100) NULL, \`fecha_pago\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, \`orden_compra_id\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`orden_compra\` (\`id\` int NOT NULL AUTO_INCREMENT, \`monto\` decimal(15,2) NOT NULL, \`cuotas\` int NOT NULL, \`usuarios_id\` int UNSIGNED NULL, \`tiendas_id\` int NULL, \`estados_id\` int UNSIGNED NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`cuotas\` (\`id\` int NOT NULL AUTO_INCREMENT, \`numero_cuota\` int NOT NULL, \`valor_cuota\` decimal(15,2) NOT NULL, \`saldo_cuota\` decimal(15,2) NOT NULL, \`fecha_vencimiento\` date NOT NULL, \`orden_compra_id\` int NULL, \`estado_id\` int UNSIGNED NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`pagos_has_cuotas\` (\`id\` int NOT NULL AUTO_INCREMENT, \`monto_aplicado\` decimal(15,2) NOT NULL, \`pago_id\` int NULL, \`cuota_id\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`estratos\` (\`created_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`id\` int UNSIGNED NOT NULL AUTO_INCREMENT, \`estrato\` varchar(45) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`img_productos\` ADD CONSTRAINT \`FK_c9f6328b75c778244953e665eee\` FOREIGN KEY (\`productos_id\`) REFERENCES \`productos\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
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
        await queryRunner.query(`ALTER TABLE \`tiendas\` ADD CONSTRAINT \`FK_fea61e28ed4e34fb184461c41c3\` FOREIGN KEY (\`estados_id\`) REFERENCES \`estados\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`tiendas\` ADD CONSTRAINT \`FK_5b0a19520cde0223e62c31b03d3\` FOREIGN KEY (\`usuarios_id\`) REFERENCES \`usuarios\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`tiendas\` ADD CONSTRAINT \`FK_a10ad254b6af53bd0ae207ab13d\` FOREIGN KEY (\`usuarios_id1\`) REFERENCES \`usuarios\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`productos_has_orden_compra\` ADD CONSTRAINT \`FK_1e538e625c181e16493c06e4533\` FOREIGN KEY (\`productos_id\`) REFERENCES \`productos\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`productos_has_orden_compra\` ADD CONSTRAINT \`FK_96412c7f7dfe5cb78ce0697dddb\` FOREIGN KEY (\`orden_compra_id\`) REFERENCES \`orden_compra\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`productos_has_orden_compra\` ADD CONSTRAINT \`FK_ae79da6f56e4941d1715927829c\` FOREIGN KEY (\`estados_id\`) REFERENCES \`estados\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`pagos\` ADD CONSTRAINT \`FK_51d7121c9b9257f1f49e9e12c3c\` FOREIGN KEY (\`orden_compra_id\`) REFERENCES \`orden_compra\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`orden_compra\` ADD CONSTRAINT \`FK_c2e892466f80a97f21eb8dda4c2\` FOREIGN KEY (\`usuarios_id\`) REFERENCES \`usuarios\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`orden_compra\` ADD CONSTRAINT \`FK_e6da43d12293126d3473c8e1a01\` FOREIGN KEY (\`tiendas_id\`) REFERENCES \`tiendas\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`orden_compra\` ADD CONSTRAINT \`FK_a57aaf078609f30ed1ee347a543\` FOREIGN KEY (\`estados_id\`) REFERENCES \`estados\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`cuotas\` ADD CONSTRAINT \`FK_0cd5f18cb02be0b84d0f45760ef\` FOREIGN KEY (\`orden_compra_id\`) REFERENCES \`orden_compra\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`cuotas\` ADD CONSTRAINT \`FK_e76012ebe36d558ebd509bd5aa7\` FOREIGN KEY (\`estado_id\`) REFERENCES \`estados\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`pagos_has_cuotas\` ADD CONSTRAINT \`FK_4cfd9e3adb1ca6adf6ac1089e72\` FOREIGN KEY (\`pago_id\`) REFERENCES \`pagos\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`pagos_has_cuotas\` ADD CONSTRAINT \`FK_50d9cf79ba6a3544a2c11cb7eff\` FOREIGN KEY (\`cuota_id\`) REFERENCES \`cuotas\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`pagos_has_cuotas\` DROP FOREIGN KEY \`FK_50d9cf79ba6a3544a2c11cb7eff\``);
        await queryRunner.query(`ALTER TABLE \`pagos_has_cuotas\` DROP FOREIGN KEY \`FK_4cfd9e3adb1ca6adf6ac1089e72\``);
        await queryRunner.query(`ALTER TABLE \`cuotas\` DROP FOREIGN KEY \`FK_e76012ebe36d558ebd509bd5aa7\``);
        await queryRunner.query(`ALTER TABLE \`cuotas\` DROP FOREIGN KEY \`FK_0cd5f18cb02be0b84d0f45760ef\``);
        await queryRunner.query(`ALTER TABLE \`orden_compra\` DROP FOREIGN KEY \`FK_a57aaf078609f30ed1ee347a543\``);
        await queryRunner.query(`ALTER TABLE \`orden_compra\` DROP FOREIGN KEY \`FK_e6da43d12293126d3473c8e1a01\``);
        await queryRunner.query(`ALTER TABLE \`orden_compra\` DROP FOREIGN KEY \`FK_c2e892466f80a97f21eb8dda4c2\``);
        await queryRunner.query(`ALTER TABLE \`pagos\` DROP FOREIGN KEY \`FK_51d7121c9b9257f1f49e9e12c3c\``);
        await queryRunner.query(`ALTER TABLE \`productos_has_orden_compra\` DROP FOREIGN KEY \`FK_ae79da6f56e4941d1715927829c\``);
        await queryRunner.query(`ALTER TABLE \`productos_has_orden_compra\` DROP FOREIGN KEY \`FK_96412c7f7dfe5cb78ce0697dddb\``);
        await queryRunner.query(`ALTER TABLE \`productos_has_orden_compra\` DROP FOREIGN KEY \`FK_1e538e625c181e16493c06e4533\``);
        await queryRunner.query(`ALTER TABLE \`tiendas\` DROP FOREIGN KEY \`FK_a10ad254b6af53bd0ae207ab13d\``);
        await queryRunner.query(`ALTER TABLE \`tiendas\` DROP FOREIGN KEY \`FK_5b0a19520cde0223e62c31b03d3\``);
        await queryRunner.query(`ALTER TABLE \`tiendas\` DROP FOREIGN KEY \`FK_fea61e28ed4e34fb184461c41c3\``);
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
        await queryRunner.query(`ALTER TABLE \`img_productos\` DROP FOREIGN KEY \`FK_c9f6328b75c778244953e665eee\``);
        await queryRunner.query(`DROP TABLE \`estratos\``);
        await queryRunner.query(`DROP TABLE \`pagos_has_cuotas\``);
        await queryRunner.query(`DROP TABLE \`cuotas\``);
        await queryRunner.query(`DROP TABLE \`orden_compra\``);
        await queryRunner.query(`DROP TABLE \`pagos\``);
        await queryRunner.query(`DROP TABLE \`productos_has_orden_compra\``);
        await queryRunner.query(`DROP TABLE \`tiendas\``);
        await queryRunner.query(`DROP TABLE \`img_tiendas\``);
        await queryRunner.query(`DROP INDEX \`IDX_446adfc18b35418aac32ae0b7b\` ON \`usuarios\``);
        await queryRunner.query(`DROP TABLE \`usuarios\``);
        await queryRunner.query(`DROP TABLE \`creditos\``);
        await queryRunner.query(`DROP TABLE \`roles\``);
        await queryRunner.query(`DROP TABLE \`sexos\``);
        await queryRunner.query(`DROP TABLE \`estados\``);
        await queryRunner.query(`DROP TABLE \`productos\``);
        await queryRunner.query(`DROP TABLE \`img_productos\``);
        await queryRunner.query(`DROP TABLE \`dni_tipos\``);
    }

}
