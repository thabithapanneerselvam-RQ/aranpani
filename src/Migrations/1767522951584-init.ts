import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1767522951584 implements MigrationInterface {
    name = 'Init1767522951584'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "one_time_payment" ADD "donor_id" integer`);
        await queryRunner.query(`ALTER TABLE "one_time_payment" ADD CONSTRAINT "FK_79f90b06cf512763d20129125ff" FOREIGN KEY ("donor_id") REFERENCES "donors"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "one_time_payment" DROP CONSTRAINT "FK_79f90b06cf512763d20129125ff"`);
        await queryRunner.query(`ALTER TABLE "one_time_payment" DROP COLUMN "donor_id"`);
    }

}
