import { MigrationInterface, QueryRunner } from "typeorm";
import CaptureSpan from "../../../Utils/Telemetry/CaptureSpan";

export class MigrationName1724078044172 implements MigrationInterface {
  public name = "MigrationName1724078044172";

  @CaptureSpan()
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "Monitor" ADD "incomingRequestMonitorHeartbeatCheckedAt" TIMESTAMP WITH TIME ZONE`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_62cf90e5fbcd9f3742ed35a2bb" ON "Monitor" ("incomingRequestMonitorHeartbeatCheckedAt") `,
    );
  }

  @CaptureSpan()
  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX "public"."IDX_62cf90e5fbcd9f3742ed35a2bb"`,
    );
    await queryRunner.query(
      `ALTER TABLE "Monitor" DROP COLUMN "incomingRequestMonitorHeartbeatCheckedAt"`,
    );
  }
}
