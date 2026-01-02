import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1767374082110 implements MigrationInterface {
    name = 'Init1767374082110'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."one_time_payment_mode_enum" AS ENUM('paid', 'pending', 'not_paid', 'paid by rep', 'pending with rep')`);
        await queryRunner.query(`CREATE TABLE "one_time_payment" ("id" SERIAL NOT NULL, "date_of_pay" date NOT NULL, "mode" "public"."one_time_payment_mode_enum" NOT NULL, "amount" integer NOT NULL, "transaction_id" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "areaRepId" integer, "projectId" integer, CONSTRAINT "PK_ed428b396452d704277ae66790c" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "area_reps" ("id" SERIAL NOT NULL, "rep_name" character varying NOT NULL, "phone_no" character varying NOT NULL, "address" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_7e63791bee3d1a5d069f4ed5fbf" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "group_members" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "phone_no" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "donorId" integer, CONSTRAINT "PK_86446139b2c96bfd0f3b8638852" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."donors_status_enum" AS ENUM('active', 'inactive')`);
        await queryRunner.query(`CREATE TABLE "donors" ("id" SERIAL NOT NULL, "donor_name" character varying NOT NULL, "phone_no" character varying NOT NULL, "address" character varying NOT NULL, "country" character varying NOT NULL, "state" character varying NOT NULL, "district" character varying NOT NULL, "pincode" character varying NOT NULL, "status" "public"."donors_status_enum" NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "areaRepId" integer, CONSTRAINT "PK_7fafae759bcc8cc1dfa09c3fbcf" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."payments_mode_enum" AS ENUM('paid', 'pending', 'not_paid', 'paid by rep', 'pending with rep')`);
        await queryRunner.query(`CREATE TYPE "public"."payments_role_enum" AS ENUM('donor', 'area_rep')`);
        await queryRunner.query(`CREATE TYPE "public"."payments_scheme_enum" AS ENUM('monthly', 'half_yearly', 'yearly')`);
        await queryRunner.query(`CREATE TABLE "payments" ("id" SERIAL NOT NULL, "date_of_pay" date NOT NULL, "mode" "public"."payments_mode_enum" NOT NULL, "role" "public"."payments_role_enum" NOT NULL, "scheme" "public"."payments_scheme_enum" NOT NULL, "amount" integer NOT NULL, "transaction_id" character varying NOT NULL, "paid_by" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "donorId" integer, "projectId" integer, CONSTRAINT "PK_197ab7af18c93fbb0c9b28b4a59" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."projects_status_enum" AS ENUM('proposed', 'planned', 'active', 'completed', 'scrapped')`);
        await queryRunner.query(`CREATE TABLE "projects" ("id" SERIAL NOT NULL, "temple_name" character varying NOT NULL, "temple_incharge_name" character varying NOT NULL, "contact_no" character varying NOT NULL, "temple_location" character varying NOT NULL, "status" "public"."projects_status_enum" NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_6271df0a7aed1d6c0691ce6ac50" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "one_time_payment" ADD CONSTRAINT "FK_6cbc555d96101fdd65631b9d4ab" FOREIGN KEY ("areaRepId") REFERENCES "area_reps"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "one_time_payment" ADD CONSTRAINT "FK_121952bc961ffd36bb6091bb5dd" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "group_members" ADD CONSTRAINT "FK_11a96601f0aa0391e719134cf81" FOREIGN KEY ("donorId") REFERENCES "donors"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "donors" ADD CONSTRAINT "FK_f90a5e14b456f5b10b6fcc4b9eb" FOREIGN KEY ("areaRepId") REFERENCES "area_reps"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "payments" ADD CONSTRAINT "FK_2c03d25704666613095b093320c" FOREIGN KEY ("donorId") REFERENCES "donors"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "payments" ADD CONSTRAINT "FK_497370a7f747f66f524ab3c548d" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "payments" DROP CONSTRAINT "FK_497370a7f747f66f524ab3c548d"`);
        await queryRunner.query(`ALTER TABLE "payments" DROP CONSTRAINT "FK_2c03d25704666613095b093320c"`);
        await queryRunner.query(`ALTER TABLE "donors" DROP CONSTRAINT "FK_f90a5e14b456f5b10b6fcc4b9eb"`);
        await queryRunner.query(`ALTER TABLE "group_members" DROP CONSTRAINT "FK_11a96601f0aa0391e719134cf81"`);
        await queryRunner.query(`ALTER TABLE "one_time_payment" DROP CONSTRAINT "FK_121952bc961ffd36bb6091bb5dd"`);
        await queryRunner.query(`ALTER TABLE "one_time_payment" DROP CONSTRAINT "FK_6cbc555d96101fdd65631b9d4ab"`);
        await queryRunner.query(`DROP TABLE "projects"`);
        await queryRunner.query(`DROP TYPE "public"."projects_status_enum"`);
        await queryRunner.query(`DROP TABLE "payments"`);
        await queryRunner.query(`DROP TYPE "public"."payments_scheme_enum"`);
        await queryRunner.query(`DROP TYPE "public"."payments_role_enum"`);
        await queryRunner.query(`DROP TYPE "public"."payments_mode_enum"`);
        await queryRunner.query(`DROP TABLE "donors"`);
        await queryRunner.query(`DROP TYPE "public"."donors_status_enum"`);
        await queryRunner.query(`DROP TABLE "group_members"`);
        await queryRunner.query(`DROP TABLE "area_reps"`);
        await queryRunner.query(`DROP TABLE "one_time_payment"`);
        await queryRunner.query(`DROP TYPE "public"."one_time_payment_mode_enum"`);
    }

}
