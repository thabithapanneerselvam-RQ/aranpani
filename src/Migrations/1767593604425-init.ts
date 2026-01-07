import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1767593604425 implements MigrationInterface {
    name = 'Init1767593604425'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "otp" ("id" SERIAL NOT NULL, "code" character varying NOT NULL, "expiry" TIMESTAMP NOT NULL, "onetimepayment_id" integer, CONSTRAINT "REL_b60622ac99cdcdab11ef4d9541" UNIQUE ("onetimepayment_id"), CONSTRAINT "PK_32556d9d7b22031d7d0e1fd6723" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "otp" ADD CONSTRAINT "FK_b60622ac99cdcdab11ef4d9541c" FOREIGN KEY ("onetimepayment_id") REFERENCES "one_time_payment"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "otp" DROP CONSTRAINT "FK_b60622ac99cdcdab11ef4d9541c"`);
        await queryRunner.query(`DROP TABLE "otp"`);
    }

}
