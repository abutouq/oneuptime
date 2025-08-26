import { MigrationInterface, QueryRunner } from "typeorm";
import CaptureSpan from "../../../Utils/Telemetry/CaptureSpan";

export class MigrationName1717955235341 implements MigrationInterface {
  public name = "MigrationName1717955235341";

  @CaptureSpan()
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "CodeRepository" ("_id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "version" integer NOT NULL, "projectId" uuid NOT NULL, "name" character varying(100) NOT NULL, "slug" character varying(100) NOT NULL, "description" character varying(500), "createdByUserId" uuid, "deletedByUserId" uuid, "secretToken" uuid NOT NULL, CONSTRAINT "PK_7b5219d06a82fbc0bc4540b74f0" PRIMARY KEY ("_id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_a653bdc2fac520c9c8b9a7c7a6" ON "CodeRepository" ("projectId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_789f71951901d03fe3da24dca5" ON "CodeRepository" ("secretToken") `,
    );
    await queryRunner.query(
      `CREATE TABLE "CodeRepositoryLabel" ("codeRepositoryId" uuid NOT NULL, "labelId" uuid NOT NULL, CONSTRAINT "PK_5adb09e0b5957488be8931f46bc" PRIMARY KEY ("codeRepositoryId", "labelId"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_7710ab8ee47601f78f3a4b76b6" ON "CodeRepositoryLabel" ("codeRepositoryId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_8f7d12100e441fc72e02151fc5" ON "CodeRepositoryLabel" ("labelId") `,
    );
    await queryRunner.query(
      `ALTER TABLE "CodeRepository" ADD CONSTRAINT "FK_a653bdc2fac520c9c8b9a7c7a6a" FOREIGN KEY ("projectId") REFERENCES "Project"("_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "CodeRepository" ADD CONSTRAINT "FK_a870b71b99c87ea658c11421490" FOREIGN KEY ("createdByUserId") REFERENCES "User"("_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "CodeRepository" ADD CONSTRAINT "FK_79d9249eb5f8174a6f6228311f4" FOREIGN KEY ("deletedByUserId") REFERENCES "User"("_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "CodeRepositoryLabel" ADD CONSTRAINT "FK_7710ab8ee47601f78f3a4b76b64" FOREIGN KEY ("codeRepositoryId") REFERENCES "CodeRepository"("_id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "CodeRepositoryLabel" ADD CONSTRAINT "FK_8f7d12100e441fc72e02151fc56" FOREIGN KEY ("labelId") REFERENCES "Label"("_id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
  }

  @CaptureSpan()
  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "CodeRepositoryLabel" DROP CONSTRAINT "FK_8f7d12100e441fc72e02151fc56"`,
    );
    await queryRunner.query(
      `ALTER TABLE "CodeRepositoryLabel" DROP CONSTRAINT "FK_7710ab8ee47601f78f3a4b76b64"`,
    );
    await queryRunner.query(
      `ALTER TABLE "CodeRepository" DROP CONSTRAINT "FK_79d9249eb5f8174a6f6228311f4"`,
    );
    await queryRunner.query(
      `ALTER TABLE "CodeRepository" DROP CONSTRAINT "FK_a870b71b99c87ea658c11421490"`,
    );
    await queryRunner.query(
      `ALTER TABLE "CodeRepository" DROP CONSTRAINT "FK_a653bdc2fac520c9c8b9a7c7a6a"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_8f7d12100e441fc72e02151fc5"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_7710ab8ee47601f78f3a4b76b6"`,
    );
    await queryRunner.query(`DROP TABLE "CodeRepositoryLabel"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_789f71951901d03fe3da24dca5"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_a653bdc2fac520c9c8b9a7c7a6"`,
    );
    await queryRunner.query(`DROP TABLE "CodeRepository"`);
  }
}
