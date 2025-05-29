import { MigrationInterface, QueryRunner } from "typeorm";

export class Initial1748493834241 implements MigrationInterface {
    name = 'Initial1748493834241'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`sexos\` (\`created_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`id\` int UNSIGNED NOT NULL AUTO_INCREMENT, \`sexo\` varchar(45) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`dni_tipos\` (\`created_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`id\` int UNSIGNED NOT NULL AUTO_INCREMENT, \`dni_tipos\` varchar(45) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`estados\` (\`created_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`id\` int UNSIGNED NOT NULL AUTO_INCREMENT, \`estado\` varchar(45) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`estratos\` (\`created_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`id\` int UNSIGNED NOT NULL AUTO_INCREMENT, \`estrato\` varchar(45) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`roles\` (\`created_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`id\` int UNSIGNED NOT NULL AUTO_INCREMENT, \`role\` varchar(45) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`usuarios\` (\`created_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`id\` int UNSIGNED NOT NULL AUTO_INCREMENT, \`nombre\` varchar(255) NULL, \`apellido\` varchar(255) NULL, \`dni\` varchar(255) NULL, \`contrato\` varchar(255) NOT NULL, \`nacionalidad\` varchar(255) NULL, \`codigo_departamento\` varchar(255) NULL, \`departamento\` varchar(255) NULL, \`codigo_municipio\` varchar(255) NULL, \`municipio\` varchar(255) NULL, \`via_principal_clave\` varchar(255) NULL, \`via_principal_valor\` varchar(255) NULL, \`via_secundaria_clave\` varchar(255) NULL, \`via_secundaria_valor\` varchar(255) NULL, \`tipo_unidad_uno_clave\` varchar(255) NULL, \`tipo_unidad_uno_valor\` varchar(255) NULL, \`tipo_unidad_dos_clave\` varchar(255) NULL, \`tipo_unidad_dos_valor\` varchar(255) NULL, \`barrio\` varchar(255) NULL, \`latitud\` varchar(255) NULL, \`longitud\` varchar(255) NULL, \`direccion\` varchar(255) NULL, \`telefono_uno\` varchar(255) NULL, \`telefono_dos\` varchar(255) NULL, \`Telefono_tres\` varchar(255) NULL, \`password\` text NULL, \`email\` varchar(255) NULL, \`fecha_nacimiento\` datetime NULL, \`anexo\` text NULL, \`dni_tipos_id\` int UNSIGNED NULL, \`estados_id\` int UNSIGNED NULL, \`sexos_id\` int UNSIGNED NULL, \`estratos_id\` int UNSIGNED NULL, \`roles_id\` int UNSIGNED NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`usuarios\` ADD CONSTRAINT \`FK_ce3ae280065412e091a080372f5\` FOREIGN KEY (\`dni_tipos_id\`) REFERENCES \`dni_tipos\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`usuarios\` ADD CONSTRAINT \`FK_2085bf8ad0172da09676fa67d76\` FOREIGN KEY (\`estados_id\`) REFERENCES \`estados\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`usuarios\` ADD CONSTRAINT \`FK_ad0600ba0c3ccd924ddfd2de481\` FOREIGN KEY (\`sexos_id\`) REFERENCES \`sexos\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`usuarios\` ADD CONSTRAINT \`FK_81432c4eb8f9e176a4dc0f8c0fb\` FOREIGN KEY (\`estratos_id\`) REFERENCES \`estratos\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`usuarios\` ADD CONSTRAINT \`FK_28de221731be7761ba1b165df08\` FOREIGN KEY (\`roles_id\`) REFERENCES \`roles\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`usuarios\` DROP FOREIGN KEY \`FK_28de221731be7761ba1b165df08\``);
        await queryRunner.query(`ALTER TABLE \`usuarios\` DROP FOREIGN KEY \`FK_81432c4eb8f9e176a4dc0f8c0fb\``);
        await queryRunner.query(`ALTER TABLE \`usuarios\` DROP FOREIGN KEY \`FK_ad0600ba0c3ccd924ddfd2de481\``);
        await queryRunner.query(`ALTER TABLE \`usuarios\` DROP FOREIGN KEY \`FK_2085bf8ad0172da09676fa67d76\``);
        await queryRunner.query(`ALTER TABLE \`usuarios\` DROP FOREIGN KEY \`FK_ce3ae280065412e091a080372f5\``);
        await queryRunner.query(`DROP TABLE \`usuarios\``);
        await queryRunner.query(`DROP TABLE \`roles\``);
        await queryRunner.query(`DROP TABLE \`estratos\``);
        await queryRunner.query(`DROP TABLE \`estados\``);
        await queryRunner.query(`DROP TABLE \`dni_tipos\``);
        await queryRunner.query(`DROP TABLE \`sexos\``);
    }

}
