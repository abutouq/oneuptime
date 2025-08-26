import { MigrationInterface, QueryRunner } from "typeorm";
import CaptureSpan from "../../../Utils/Telemetry/CaptureSpan";

export class MigrationName1718119926223 implements MigrationInterface {
  public name = "MigrationName1718119926223";

  @CaptureSpan()
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "ServiceCatalog" ADD "serviceLanguage" character varying(100)`,
    );
  }

  @CaptureSpan()
  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "ServiceCatalog" DROP COLUMN "serviceLanguage"`,
    );
  }
}
