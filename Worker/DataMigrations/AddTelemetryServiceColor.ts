import DataMigrationBase from "./DataMigrationBase";
import ArrayUtil from "Common/Utils/Array";
import { BrightColors } from "Common/Types/BrandColors";
import LIMIT_MAX from "Common/Types/Database/LimitMax";
import TelemetryServiceService from "Common/Server/Services/TelemetryServiceService";
import TelemetryService from "Common/Models/DatabaseModels/TelemetryService";

export default class AddTelemetryServiceColor extends DataMigrationBase {
  public constructor() {
    super("AddTelemetryServiceColor");
  }

  public override async migrate(): Promise<void> {
    // get all the users with email isVerified true.

    const services: Array<TelemetryService> =
      await TelemetryServiceService.findBy({
        query: {},
        select: {
          _id: true,
          serviceColor: true,
        },
        limit: LIMIT_MAX,
        skip: 0,
        props: {
          isRoot: true,
        },
      });

    for (const service of services) {
      if (!service.serviceColor) {
        service.serviceColor = ArrayUtil.selectItemByRandom(BrightColors);
        await TelemetryServiceService.updateOneById({
          id: service.id!,
          data: {
            serviceColor: service.serviceColor,
          },
          props: {
            isRoot: true,
          },
        });
      }
    }
  }

  public override async rollback(): Promise<void> {
    return;
  }
}
