import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1767595606885 implements MigrationInterface {
    name = 'Init1767595606885'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "otp" ADD "phoneNo" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "otp" ADD "verified" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "otp" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "otp" DROP CONSTRAINT "FK_b60622ac99cdcdab11ef4d9541c"`);
        await queryRunner.query(`ALTER TABLE "otp" DROP CONSTRAINT "REL_b60622ac99cdcdab11ef4d9541"`);
        await queryRunner.query(`ALTER TABLE "otp" ADD CONSTRAINT "FK_b60622ac99cdcdab11ef4d9541c" FOREIGN KEY ("onetimepayment_id") REFERENCES "one_time_payment"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "otp" DROP CONSTRAINT "FK_b60622ac99cdcdab11ef4d9541c"`);
        await queryRunner.query(`ALTER TABLE "otp" ADD CONSTRAINT "REL_b60622ac99cdcdab11ef4d9541" UNIQUE ("onetimepayment_id")`);
        await queryRunner.query(`ALTER TABLE "otp" ADD CONSTRAINT "FK_b60622ac99cdcdab11ef4d9541c" FOREIGN KEY ("onetimepayment_id") REFERENCES "one_time_payment"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "otp" DROP COLUMN "createdAt"`);
        await queryRunner.query(`ALTER TABLE "otp" DROP COLUMN "verified"`);
        await queryRunner.query(`ALTER TABLE "otp" DROP COLUMN "phoneNo"`);
    }

}
