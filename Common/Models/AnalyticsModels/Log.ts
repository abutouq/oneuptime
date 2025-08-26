import AnalyticsBaseModel from "./AnalyticsBaseModel/AnalyticsBaseModel";
import Route from "../../Types/API/Route";
import AnalyticsTableEngine from "../../Types/AnalyticsDatabase/AnalyticsTableEngine";
import AnalyticsTableColumn from "../../Types/AnalyticsDatabase/TableColumn";
import TableColumnType from "../../Types/AnalyticsDatabase/TableColumnType";
import { JSONObject } from "../../Types/JSON";
import ObjectID from "../../Types/ObjectID";
import Permission from "../../Types/Permission";
import LogSeverity from "../../Types/Log/LogSeverity";

export default class Log extends AnalyticsBaseModel {
  public constructor() {
    super({
      tableName: "LogItem",
      tableEngine: AnalyticsTableEngine.MergeTree,
      singularName: "Log",
      accessControl: {
        read: [
          Permission.ProjectOwner,
          Permission.ProjectAdmin,
          Permission.ProjectMember,
          Permission.ReadTelemetryServiceLog,
        ],
        create: [
          Permission.ProjectOwner,
          Permission.ProjectAdmin,
          Permission.ProjectMember,
          Permission.CreateTelemetryServiceLog,
        ],
        update: [
          Permission.ProjectOwner,
          Permission.ProjectAdmin,
          Permission.ProjectMember,
          Permission.EditTelemetryServiceLog,
        ],
        delete: [
          Permission.ProjectOwner,
          Permission.ProjectAdmin,
          Permission.ProjectMember,
          Permission.DeleteTelemetryServiceLog,
        ],
      },
      pluralName: "Logs",
      crudApiPath: new Route("/logs"),
      tableColumns: [
        new AnalyticsTableColumn({
          key: "projectId",
          title: "Project ID",
          description: "ID of project",
          required: true,
          type: TableColumnType.ObjectID,
          isTenantId: true,
          accessControl: {
            read: [
              Permission.ProjectOwner,
              Permission.ProjectAdmin,
              Permission.ProjectMember,
              Permission.ReadTelemetryServiceLog,
            ],
            create: [
              Permission.ProjectOwner,
              Permission.ProjectAdmin,
              Permission.ProjectMember,
              Permission.CreateTelemetryServiceLog,
            ],
            update: [],
          },
        }),

        new AnalyticsTableColumn({
          key: "serviceId",
          title: "Service ID",
          description: "ID of the Service which created the log",
          required: true,
          type: TableColumnType.ObjectID,
          accessControl: {
            read: [
              Permission.ProjectOwner,
              Permission.ProjectAdmin,
              Permission.ProjectMember,
              Permission.ReadTelemetryServiceLog,
            ],
            create: [
              Permission.ProjectOwner,
              Permission.ProjectAdmin,
              Permission.ProjectMember,
              Permission.CreateTelemetryServiceLog,
            ],
            update: [],
          },
        }),

        new AnalyticsTableColumn({
          key: "time",
          title: "Time",
          description: "When was the log created?",
          required: true,
          type: TableColumnType.Date,
          accessControl: {
            read: [
              Permission.ProjectOwner,
              Permission.ProjectAdmin,
              Permission.ProjectMember,
              Permission.ReadTelemetryServiceLog,
            ],
            create: [
              Permission.ProjectOwner,
              Permission.ProjectAdmin,
              Permission.ProjectMember,
              Permission.CreateTelemetryServiceLog,
            ],
            update: [],
          },
        }),

        new AnalyticsTableColumn({
          key: "timeUnixNano",
          title: "Time (in Unix Nano)",
          description: "When was the log created?",
          required: true,
          type: TableColumnType.LongNumber,
          accessControl: {
            read: [
              Permission.ProjectOwner,
              Permission.ProjectAdmin,
              Permission.ProjectMember,
              Permission.ReadTelemetryServiceLog,
            ],
            create: [
              Permission.ProjectOwner,
              Permission.ProjectAdmin,
              Permission.ProjectMember,
              Permission.CreateTelemetryServiceLog,
            ],
            update: [],
          },
        }),

        new AnalyticsTableColumn({
          key: "severityText",
          title: "Severity Text",
          description: "Log Severity Text",
          required: true,
          type: TableColumnType.Text,
          accessControl: {
            read: [
              Permission.ProjectOwner,
              Permission.ProjectAdmin,
              Permission.ProjectMember,
              Permission.ReadTelemetryServiceLog,
            ],
            create: [
              Permission.ProjectOwner,
              Permission.ProjectAdmin,
              Permission.ProjectMember,
              Permission.CreateTelemetryServiceLog,
            ],
            update: [],
          },
        }),

        new AnalyticsTableColumn({
          key: "severityNumber",
          title: "Severity Number",
          description: "Log Severity Number",
          required: true,
          type: TableColumnType.Number,
          accessControl: {
            read: [
              Permission.ProjectOwner,
              Permission.ProjectAdmin,
              Permission.ProjectMember,
              Permission.ReadTelemetryServiceLog,
            ],
            create: [
              Permission.ProjectOwner,
              Permission.ProjectAdmin,
              Permission.ProjectMember,
              Permission.CreateTelemetryServiceLog,
            ],
            update: [],
          },
        }),

        new AnalyticsTableColumn({
          key: "attributes",
          title: "Attributes",
          description: "Attributes",
          required: true,
          defaultValue: {},
          type: TableColumnType.JSON,
          accessControl: {
            read: [
              Permission.ProjectOwner,
              Permission.ProjectAdmin,
              Permission.ProjectMember,
              Permission.ReadTelemetryServiceLog,
            ],
            create: [
              Permission.ProjectOwner,
              Permission.ProjectAdmin,
              Permission.ProjectMember,
              Permission.CreateTelemetryServiceLog,
            ],
            update: [],
          },
        }),

        new AnalyticsTableColumn({
          key: "traceId",
          title: "Trace ID",
          description: "ID of the trace",
          required: false,
          type: TableColumnType.Text,
          accessControl: {
            read: [
              Permission.ProjectOwner,
              Permission.ProjectAdmin,
              Permission.ProjectMember,
              Permission.ReadTelemetryServiceLog,
            ],
            create: [
              Permission.ProjectOwner,
              Permission.ProjectAdmin,
              Permission.ProjectMember,
              Permission.CreateTelemetryServiceLog,
            ],
            update: [],
          },
        }),

        new AnalyticsTableColumn({
          key: "spanId",
          title: "Span ID",
          description: "ID of the span",
          required: false,
          type: TableColumnType.Text,
          accessControl: {
            read: [
              Permission.ProjectOwner,
              Permission.ProjectAdmin,
              Permission.ProjectMember,
              Permission.ReadTelemetryServiceLog,
            ],
            create: [
              Permission.ProjectOwner,
              Permission.ProjectAdmin,
              Permission.ProjectMember,
              Permission.CreateTelemetryServiceLog,
            ],
            update: [],
          },
        }),

        new AnalyticsTableColumn({
          key: "body",
          title: "Log Body",
          description: "Body of the Log",
          required: false,
          type: TableColumnType.Text,
          accessControl: {
            read: [
              Permission.ProjectOwner,
              Permission.ProjectAdmin,
              Permission.ProjectMember,
              Permission.ReadTelemetryServiceLog,
            ],
            create: [
              Permission.ProjectOwner,
              Permission.ProjectAdmin,
              Permission.ProjectMember,
              Permission.CreateTelemetryServiceLog,
            ],
            update: [],
          },
        }),
      ],
      sortKeys: ["projectId", "time", "serviceId"],
      primaryKeys: ["projectId", "time", "serviceId"],
      partitionKey: "sipHash64(projectId) % 16",
    });
  }

  public get projectId(): ObjectID | undefined {
    return this.getColumnValue("projectId") as ObjectID | undefined;
  }

  public set projectId(v: ObjectID | undefined) {
    this.setColumnValue("projectId", v);
  }

  public get serviceId(): ObjectID | undefined {
    return this.getColumnValue("serviceId") as ObjectID | undefined;
  }

  public set serviceId(v: ObjectID | undefined) {
    this.setColumnValue("serviceId", v);
  }

  public set body(v: string | undefined) {
    this.setColumnValue("body", v);
  }

  public get body(): string | undefined {
    return this.getColumnValue("body");
  }

  public get time(): Date | undefined {
    return this.getColumnValue("time") as Date | undefined;
  }

  public set time(v: Date | undefined) {
    this.setColumnValue("time", v);
  }

  public get timeUnixNano(): number | undefined {
    return this.getColumnValue("timeUnixNano") as number | undefined;
  }

  public set timeUnixNano(v: number | undefined) {
    this.setColumnValue("timeUnixNano", v);
  }

  public get severityText(): LogSeverity | undefined {
    return this.getColumnValue("severityText") as LogSeverity | undefined;
  }

  public set severityText(v: LogSeverity | undefined) {
    this.setColumnValue("severityText", v);
  }

  public get severityNumber(): number | undefined {
    return this.getColumnValue("severityNumber") as number | undefined;
  }

  public set severityNumber(v: number | undefined) {
    this.setColumnValue("severityNumber", v);
  }

  public get attributes(): JSONObject | undefined {
    return this.getColumnValue("attributes") as JSONObject | undefined;
  }

  public set attributes(v: JSONObject | undefined) {
    this.setColumnValue("attributes", v);
  }

  public get traceId(): string | undefined {
    return this.getColumnValue("traceId") as string | undefined;
  }

  public set traceId(v: string | undefined) {
    this.setColumnValue("traceId", v);
  }

  public get spanId(): string | undefined {
    return this.getColumnValue("spanId") as string | undefined;
  }

  public set spanId(v: string | undefined) {
    this.setColumnValue("spanId", v);
  }
}
