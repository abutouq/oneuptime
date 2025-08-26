import UserMiddleware from "../Middleware/UserAuthorization";
import MonitorGroupService, {
  Service as MonitorGroupServiceType,
} from "../Services/MonitorGroupService";
import {
  ExpressRequest,
  ExpressResponse,
  NextFunction,
} from "../Utils/Express";
import Response from "../Utils/Response";
import BaseAPI from "./BaseAPI";
import CommonAPI from "./CommonAPI";
import OneUptimeDate from "../../Types/Date";
import BadDataException from "../../Types/Exception/BadDataException";
import ObjectID from "../../Types/ObjectID";
import MonitorGroup from "../../Models/DatabaseModels/MonitorGroup";
import MonitorStatus from "../../Models/DatabaseModels/MonitorStatus";
import MonitorStatusTimeline from "../../Models/DatabaseModels/MonitorStatusTimeline";

export default class MonitorGroupAPI extends BaseAPI<
  MonitorGroup,
  MonitorGroupServiceType
> {
  public constructor() {
    super(MonitorGroup, MonitorGroupService);

    this.router.post(
      `${new this.entityType()
        .getCrudApiPath()
        ?.toString()}/current-status/:monitorGroupId`,
      UserMiddleware.getUserMiddleware,
      async (req: ExpressRequest, res: ExpressResponse, next: NextFunction) => {
        try {
          // get group id.

          if (!req.params["monitorGroupId"]) {
            throw new BadDataException("Monitor group id is required.");
          }

          const currentStatus: MonitorStatus =
            await this.service.getCurrentStatus(
              new ObjectID(req.params["monitorGroupId"].toString()),
              await CommonAPI.getDatabaseCommonInteractionProps(req),
            );

          return Response.sendEntityResponse(
            req,
            res,
            currentStatus,
            MonitorStatus,
          );
        } catch (err) {
          next(err);
        }
      },
    );

    this.router.post(
      `${new this.entityType()
        .getCrudApiPath()
        ?.toString()}/timeline/:monitorGroupId`,
      UserMiddleware.getUserMiddleware,
      async (req: ExpressRequest, res: ExpressResponse, next: NextFunction) => {
        try {
          // get group id.

          if (!req.params["monitorGroupId"]) {
            throw new BadDataException("Monitor group id is required.");
          }

          const startDate: Date = OneUptimeDate.getSomeDaysAgo(90);
          const endDate: Date = OneUptimeDate.getCurrentDate();

          const timeline: Array<MonitorStatusTimeline> =
            await this.service.getStatusTimeline(
              new ObjectID(req.params["monitorGroupId"].toString()),
              startDate,
              endDate,
              await CommonAPI.getDatabaseCommonInteractionProps(req),
            );

          return Response.sendEntityArrayResponse(
            req,
            res,
            timeline,
            timeline.length,
            MonitorStatusTimeline,
          );
        } catch (err) {
          next(err);
        }
      },
    );
  }
}
