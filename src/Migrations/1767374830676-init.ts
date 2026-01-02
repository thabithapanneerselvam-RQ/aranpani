import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1767374830676 implements MigrationInterface {
    name = 'Init1767374830676'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "one_time_payment" DROP CONSTRAINT "FK_6cbc555d96101fdd65631b9d4ab"`);
        await queryRunner.query(`ALTER TABLE "one_time_payment" DROP CONSTRAINT "FK_121952bc961ffd36bb6091bb5dd"`);
        await queryRunner.query(`ALTER TABLE "group_members" DROP CONSTRAINT "FK_11a96601f0aa0391e719134cf81"`);
        await queryRunner.query(`ALTER TABLE "donors" DROP CONSTRAINT "FK_f90a5e14b456f5b10b6fcc4b9eb"`);
        await queryRunner.query(`ALTER TABLE "payments" DROP CONSTRAINT "FK_2c03d25704666613095b093320c"`);
        await queryRunner.query(`ALTER TABLE "payments" DROP CONSTRAINT "FK_497370a7f747f66f524ab3c548d"`);
        await queryRunner.query(`ALTER TABLE "group_members" RENAME COLUMN "donorId" TO "donor_id"`);
        await queryRunner.query(`ALTER TABLE "donors" RENAME COLUMN "areaRepId" TO "area_rep_id"`);
        await queryRunner.query(`ALTER TABLE "one_time_payment" DROP COLUMN "areaRepId"`);
        await queryRunner.query(`ALTER TABLE "one_time_payment" DROP COLUMN "projectId"`);
        await queryRunner.query(`ALTER TABLE "payments" DROP COLUMN "donorId"`);
        await queryRunner.query(`ALTER TABLE "payments" DROP COLUMN "projectId"`);
        await queryRunner.query(`ALTER TABLE "one_time_payment" ADD "area_rep_id" integer`);
        await queryRunner.query(`ALTER TABLE "one_time_payment" ADD "project_id" integer`);
        await queryRunner.query(`ALTER TABLE "payments" ADD "donor_id" integer`);
        await queryRunner.query(`ALTER TABLE "payments" ADD "project_id" integer`);
        await queryRunner.query(`ALTER TABLE "one_time_payment" ADD CONSTRAINT "FK_4ba5354991a94cec74b0a322659" FOREIGN KEY ("area_rep_id") REFERENCES "area_reps"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "one_time_payment" ADD CONSTRAINT "FK_9b77804819db95bf1331be11303" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "group_members" ADD CONSTRAINT "FK_21bd80903b77ef567886fe0cae1" FOREIGN KEY ("donor_id") REFERENCES "donors"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "donors" ADD CONSTRAINT "FK_24a7b5e07e718fb8c366f5415f4" FOREIGN KEY ("area_rep_id") REFERENCES "area_reps"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "payments" ADD CONSTRAINT "FK_dbcc3c75f538ab209b1ddd5fec8" FOREIGN KEY ("donor_id") REFERENCES "donors"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "payments" ADD CONSTRAINT "FK_7679cab4a6968de68c2a1a8faf2" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "payments" DROP CONSTRAINT "FK_7679cab4a6968de68c2a1a8faf2"`);
        await queryRunner.query(`ALTER TABLE "payments" DROP CONSTRAINT "FK_dbcc3c75f538ab209b1ddd5fec8"`);
        await queryRunner.query(`ALTER TABLE "donors" DROP CONSTRAINT "FK_24a7b5e07e718fb8c366f5415f4"`);
        await queryRunner.query(`ALTER TABLE "group_members" DROP CONSTRAINT "FK_21bd80903b77ef567886fe0cae1"`);
        await queryRunner.query(`ALTER TABLE "one_time_payment" DROP CONSTRAINT "FK_9b77804819db95bf1331be11303"`);
        await queryRunner.query(`ALTER TABLE "one_time_payment" DROP CONSTRAINT "FK_4ba5354991a94cec74b0a322659"`);
        await queryRunner.query(`ALTER TABLE "payments" DROP COLUMN "project_id"`);
        await queryRunner.query(`ALTER TABLE "payments" DROP COLUMN "donor_id"`);
        await queryRunner.query(`ALTER TABLE "one_time_payment" DROP COLUMN "project_id"`);
        await queryRunner.query(`ALTER TABLE "one_time_payment" DROP COLUMN "area_rep_id"`);
        await queryRunner.query(`ALTER TABLE "payments" ADD "projectId" integer`);
        await queryRunner.query(`ALTER TABLE "payments" ADD "donorId" integer`);
        await queryRunner.query(`ALTER TABLE "one_time_payment" ADD "projectId" integer`);
        await queryRunner.query(`ALTER TABLE "one_time_payment" ADD "areaRepId" integer`);
        await queryRunner.query(`ALTER TABLE "donors" RENAME COLUMN "area_rep_id" TO "areaRepId"`);
        await queryRunner.query(`ALTER TABLE "group_members" RENAME COLUMN "donor_id" TO "donorId"`);
        await queryRunner.query(`ALTER TABLE "payments" ADD CONSTRAINT "FK_497370a7f747f66f524ab3c548d" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "payments" ADD CONSTRAINT "FK_2c03d25704666613095b093320c" FOREIGN KEY ("donorId") REFERENCES "donors"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "donors" ADD CONSTRAINT "FK_f90a5e14b456f5b10b6fcc4b9eb" FOREIGN KEY ("areaRepId") REFERENCES "area_reps"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "group_members" ADD CONSTRAINT "FK_11a96601f0aa0391e719134cf81" FOREIGN KEY ("donorId") REFERENCES "donors"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "one_time_payment" ADD CONSTRAINT "FK_121952bc961ffd36bb6091bb5dd" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "one_time_payment" ADD CONSTRAINT "FK_6cbc555d96101fdd65631b9d4ab" FOREIGN KEY ("areaRepId") REFERENCES "area_reps"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
