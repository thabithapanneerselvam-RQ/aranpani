import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1767522089202 implements MigrationInterface {
    name = 'Init1767522089202'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "donors" DROP COLUMN "country"`);
        await queryRunner.query(`ALTER TABLE "donors" DROP COLUMN "state"`);
        await queryRunner.query(`ALTER TABLE "donors" ADD "email" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "donors" DROP COLUMN "email"`);
        await queryRunner.query(`ALTER TABLE "donors" ADD "state" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "donors" ADD "country" character varying NOT NULL`);
    }

}
