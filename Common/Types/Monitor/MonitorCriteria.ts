import DatabaseProperty from "../Database/DatabaseProperty";
import BadDataException from "../Exception/BadDataException";
import { JSONArray, JSONObject, ObjectType } from "../JSON";
import JSONFunctions from "../JSONFunctions";
import ObjectID from "../ObjectID";
import MonitorCriteriaInstance from "./MonitorCriteriaInstance";
import MonitorType from "./MonitorType";
import { FindOperator } from "typeorm";
import Zod, { ZodSchema } from "../../Utils/Schema/Zod";

export interface MonitorCriteriaType {
  monitorCriteriaInstanceArray: Array<MonitorCriteriaInstance>;
}

export default class MonitorCriteria extends DatabaseProperty {
  public data: MonitorCriteriaType | undefined = undefined;

  public constructor() {
    super();
    this.data = {
      monitorCriteriaInstanceArray: [new MonitorCriteriaInstance()],
    };
  }

  public static getDefaultMonitorCriteria(arg: {
    monitorType: MonitorType;
    monitorName: string;
    onlineMonitorStatusId: ObjectID;
    offlineMonitorStatusId: ObjectID;
    defaultIncidentSeverityId: ObjectID;
    defaultAlertSeverityId: ObjectID;
  }): MonitorCriteria {
    const monitorCriteria: MonitorCriteria = new MonitorCriteria();
    const offlineCriteria: MonitorCriteriaInstance =
      MonitorCriteriaInstance.getDefaultOfflineMonitorCriteriaInstance({
        monitorType: arg.monitorType,
        monitorStatusId: arg.offlineMonitorStatusId,
        incidentSeverityId: arg.defaultIncidentSeverityId,
        alertSeverityId: arg.defaultAlertSeverityId,
        monitorName: arg.monitorName,
      });

    const onlineCriteria: MonitorCriteriaInstance | null =
      MonitorCriteriaInstance.getDefaultOnlineMonitorCriteriaInstance({
        monitorType: arg.monitorType,
        monitorStatusId: arg.onlineMonitorStatusId,
        monitorName: arg.monitorName,
      });

    monitorCriteria.data = {
      monitorCriteriaInstanceArray: [],
    };

    if (offlineCriteria) {
      monitorCriteria.data.monitorCriteriaInstanceArray.push(offlineCriteria);
    }

    if (onlineCriteria) {
      monitorCriteria.data.monitorCriteriaInstanceArray.push(onlineCriteria);
    }

    return monitorCriteria;
  }

  public static getValidationError(
    value: MonitorCriteria,
    monitorType: MonitorType,
  ): string | null {
    if (!value.data) {
      return "Monitor Criteria is required";
    }

    if (value.data.monitorCriteriaInstanceArray.length === 0) {
      return "Monitor Criteria is required";
    }

    for (const criteria of value.data.monitorCriteriaInstanceArray) {
      if (MonitorCriteriaInstance.getValidationError(criteria, monitorType)) {
        return MonitorCriteriaInstance.getValidationError(
          criteria,
          monitorType,
        );
      }
    }

    return null;
  }

  public static getNewMonitorCriteriaAsJSON(): JSONObject {
    return {
      _type: "MonitorCriteria",
      value: {
        monitorCriteriaInstanceArray: [new MonitorCriteriaInstance().toJSON()],
      },
    };
  }

  public override toJSON(): JSONObject {
    if (!this.data) {
      return MonitorCriteria.getNewMonitorCriteriaAsJSON();
    }

    return JSONFunctions.serialize({
      _type: ObjectType.MonitorCriteria,
      value: {
        monitorCriteriaInstanceArray:
          this.data.monitorCriteriaInstanceArray.map(
            (criteria: MonitorCriteriaInstance) => {
              return criteria.toJSON();
            },
          ),
      },
    });
  }

  public static override fromJSON(json: JSONObject): MonitorCriteria {
    if (json instanceof MonitorCriteria) {
      return json;
    }

    if (!json || json["_type"] !== ObjectType.MonitorCriteria) {
      throw new BadDataException("Invalid monitor criteria");
    }

    if (!json) {
      throw new BadDataException("Invalid monitor criteria");
    }

    if (!json["value"]) {
      throw new BadDataException("Invalid monitor criteria");
    }

    if (!(json["value"] as JSONObject)["monitorCriteriaInstanceArray"]) {
      throw new BadDataException("Invalid monitor criteria");
    }

    const monitorCriteriaInstanceArray: JSONArray = (
      json["value"] as JSONObject
    )["monitorCriteriaInstanceArray"] as JSONArray;

    const monitorCriteria: MonitorCriteria = new MonitorCriteria();

    monitorCriteria.data = {
      monitorCriteriaInstanceArray: monitorCriteriaInstanceArray.map(
        (json: JSONObject) => {
          return MonitorCriteriaInstance.fromJSON(json);
        },
      ),
    };

    return monitorCriteria;
  }

  public static isValid(_json: JSONObject): boolean {
    return true;
  }

  protected static override toDatabase(
    value: MonitorCriteria | FindOperator<MonitorCriteria>,
  ): JSONObject | null {
    if (value && value instanceof MonitorCriteria) {
      return (value as MonitorCriteria).toJSON();
    } else if (value) {
      return JSONFunctions.serialize(value as any);
    }

    return null;
  }

  protected static override fromDatabase(
    value: JSONObject,
  ): MonitorCriteria | null {
    if (value) {
      return MonitorCriteria.fromJSON(value);
    }

    return null;
  }

  public override toString(): string {
    return JSON.stringify(this.toJSON());
  }

  public static override getSchema(): ZodSchema {
    return Zod.object({
      _type: Zod.literal(ObjectType.MonitorCriteria),
      value: Zod.object({
        monitorCriteriaInstanceArray: Zod.array(
          MonitorCriteriaInstance.getSchema(),
        ),
      }).openapi({
        type: "object",
        example: {
          monitorCriteriaInstanceArray: [],
        },
      }),
    }).openapi({
      type: "object",
      description: "MonitorCriteria object",
      example: {
        _type: ObjectType.MonitorCriteria,
        value: { monitorCriteriaInstanceArray: [] },
      },
    });
  }
}
