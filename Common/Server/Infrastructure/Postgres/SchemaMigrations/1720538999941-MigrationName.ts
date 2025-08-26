import { MigrationInterface, QueryRunner } from "typeorm";
import CaptureSpan from "../../../Utils/Telemetry/CaptureSpan";

export class MigrationName1720538999941 implements MigrationInterface {
  public name = "MigrationName1720538999941";

  @CaptureSpan()
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "CopilotCodeRepository" DROP COLUMN "onBeforeRepositoryCloneScript"`,
    );
    await queryRunner.query(
      `ALTER TABLE "CopilotCodeRepository" DROP COLUMN "onAfterRepositoryCloneScript"`,
    );
    await queryRunner.query(
      `ALTER TABLE "CopilotCodeRepository" DROP COLUMN "onAfterCommitScript"`,
    );
    await queryRunner.query(
      `ALTER TABLE "CopilotCodeRepository" DROP COLUMN "onBeforeCommitScript"`,
    );
  }

  @CaptureSpan()
  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "CopilotCodeRepository" ADD "onBeforeCommitScript" text`,
    );
    await queryRunner.query(
      `ALTER TABLE "CopilotCodeRepository" ADD "onAfterCommitScript" text`,
    );
    await queryRunner.query(
      `ALTER TABLE "CopilotCodeRepository" ADD "onAfterRepositoryCloneScript" text`,
    );
    await queryRunner.query(
      `ALTER TABLE "CopilotCodeRepository" ADD "onBeforeRepositoryCloneScript" text`,
    );
  }
}
