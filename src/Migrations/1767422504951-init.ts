import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1767422504951 implements MigrationInterface {
    name = 'Init1767422504951'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "projects" RENAME COLUMN "contact_no" TO " contact_no"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "projects" RENAME COLUMN " contact_no" TO "contact_no"`);
    }

}
