import AnalyticsBaseModel from "./AnalyticsBaseModel/AnalyticsBaseModel";
import Route from "../../Types/API/Route";
import AnalyticsTableEngine from "../../Types/AnalyticsDatabase/AnalyticsTableEngine";
import AnalyticsTableColumn from "../../Types/AnalyticsDatabase/TableColumn";
import TableColumnType from "../../Types/AnalyticsDatabase/TableColumnType";
import { JSONObject } from "../../Types/JSON";
import ObjectID from "../../Types/ObjectID";
import Permission from "../../Types/Permission";

export enum AggregationTemporality {
  Delta = "Delta",
  Cumulative = "Cumulative",
}

export enum MetricPointType {
  Sum = "Sum",
  Gauge = "Gauge",
  Histogram = "Histogram",
  ExponentialHistogram = "ExponentialHistogram",
}

export enum ServiceType {
  OpenTelemetry = "OpenTelemetry",
  Monitor = "Monitor",
  Alert = "Alert",
  Incident = "Incident",
}

export default class Metric extends AnalyticsBaseModel {
  public constructor() {
    super({
      tableName: "MetricItem",
      tableEngine: AnalyticsTableEngine.MergeTree,
      singularName: "Metric",
      pluralName: "Metrics",
      crudApiPath: new Route("/metrics"),
      accessControl: {
        read: [
          Permission.ProjectOwner,
          Permission.ProjectAdmin,
          Permission.ProjectMember,
          Permission.ReadTelemetryServiceTraces,
        ],
        create: [
          Permission.ProjectOwner,
          Permission.ProjectAdmin,
          Permission.ProjectMember,
          Permission.CreateTelemetryServiceTraces,
        ],
        update: [
          Permission.ProjectOwner,
          Permission.ProjectAdmin,
          Permission.ProjectMember,
          Permission.EditTelemetryServiceTraces,
        ],
        delete: [
          Permission.ProjectOwner,
          Permission.ProjectAdmin,
          Permission.ProjectMember,
          Permission.DeleteTelemetryServiceTraces,
        ],
      },
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

        // this can also be the monitor id or the telemetry service id.
        new AnalyticsTableColumn({
          key: "serviceId",
          title: "Service ID",
          description: "ID of the Service which created the Metric",
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

        // this can also be the monitor id or the telemetry service id.
        new AnalyticsTableColumn({
          key: "serviceType",
          title: "Service Type",
          description: "Type of the service that this telemetry belongs to",
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

        // add name and description

        new AnalyticsTableColumn({
          key: "name",
          title: "Name",
          description: "Name of the Metric",
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
          key: "aggregationTemporality",
          title: "Aggregation Temporality",
          description: "Aggregation Temporality of this Metric",
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
          key: "metricPointType",
          title: "Metric Point Type",
          description: "Metric Point Type of this Metric",
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

        // this is end time.
        new AnalyticsTableColumn({
          key: "time",
          title: "Time",
          description: "When did the Metric happen?",
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
          key: "startTime",
          title: "Start Time",
          description: "When did the Metric happen?",
          required: false,
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

        // end time.
        new AnalyticsTableColumn({
          key: "timeUnixNano",
          title: "Time (in Unix Nano)",
          description: "When did the Metric happen?",
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
          key: "startTimeUnixNano",
          title: "Start Time (in Unix Nano)",
          description: "When did the Metric happen?",
          required: false,
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
          key: "attributes",
          title: "Attributes",
          description: "Attributes",
          required: true,
          type: TableColumnType.JSON,
          defaultValue: {},
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
          key: "isMonotonic",
          title: "Is Monotonic",
          description: "Is Monotonic",
          required: false,
          type: TableColumnType.Boolean,
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
          key: "count",
          title: "Count",
          description: "Count",
          required: false,
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
          key: "sum",
          title: "Sum",
          description: "Sum",
          required: false,
          type: TableColumnType.Decimal,
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
          key: "value",
          title: "Value",
          description: "Value",
          required: false,
          type: TableColumnType.Decimal,
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
          key: "min",
          title: "Min",
          description: "Min",
          required: false,
          type: TableColumnType.Decimal,
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
          key: "max",
          title: "Max",
          description: "Max",
          required: false,
          type: TableColumnType.Decimal,
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
          key: "bucketCounts",
          title: "Bucket Counts",
          description: "Bucket Counts",
          required: true,
          defaultValue: [],
          type: TableColumnType.ArrayNumber,
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
          key: "explicitBounds",
          title: "Explicit Bonds",
          description: "Explicit Bonds",
          required: true,
          defaultValue: [],
          type: TableColumnType.ArrayNumber,
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

  public get serviceType(): ServiceType | undefined {
    return this.getColumnValue("serviceType") as ServiceType | undefined;
  }

  public get name(): string | undefined {
    return this.getColumnValue("name") as string | undefined;
  }

  public set name(v: string | undefined) {
    this.setColumnValue("name", v);
  }

  public get aggregationTemporality(): AggregationTemporality | undefined {
    return this.getColumnValue("aggregationTemporality") as
      | AggregationTemporality
      | undefined;
  }

  public set aggregationTemporality(v: AggregationTemporality | undefined) {
    this.setColumnValue("aggregationTemporality", v);
  }

  public get metricPointType(): MetricPointType | undefined {
    return this.getColumnValue("metricPointType") as
      | MetricPointType
      | undefined;
  }

  public set metricPointType(v: MetricPointType | undefined) {
    this.setColumnValue("metricPointType", v);
  }

  public get isMonotonic(): boolean | undefined {
    return this.getColumnValue("isMonotonic") as boolean | undefined;
  }

  public set isMonotonic(v: boolean | undefined) {
    this.setColumnValue("isMonotonic", v);
  }

  public set serviceId(v: ObjectID | undefined) {
    this.setColumnValue("serviceId", v);
  }

  public set serviceType(v: ServiceType | undefined) {
    this.setColumnValue("serviceType", v);
  }

  public get time(): Date | undefined {
    return this.getColumnValue("time") as Date | undefined;
  }

  public set time(v: Date | undefined) {
    this.setColumnValue("time", v);
  }

  public get attributes(): JSONObject | undefined {
    return this.getColumnValue("attributes") as JSONObject | undefined;
  }

  public set attributes(v: JSONObject | undefined) {
    this.setColumnValue("attributes", v);
  }

  public get startTime(): Date | undefined {
    return this.getColumnValue("startTime") as Date | undefined;
  }

  public set startTime(v: Date | undefined) {
    this.setColumnValue("startTime", v);
  }

  public get startTimeUnixNano(): number | undefined {
    return this.getColumnValue("startTimeUnixNano") as number | undefined;
  }

  public set startTimeUnixNano(v: number | undefined) {
    this.setColumnValue("startTimeUnixNano", v);
  }

  public get timeUnixNano(): number | undefined {
    return this.getColumnValue("timeUnixNano") as number | undefined;
  }

  public set timeUnixNano(v: number | undefined) {
    this.setColumnValue("timeUnixNano", v);
  }

  public get count(): number | undefined {
    return this.getColumnValue("count") as number | undefined;
  }

  public set count(v: number | undefined) {
    this.setColumnValue("count", v);
  }

  public get sum(): number | undefined {
    return this.getColumnValue("sum") as number | undefined;
  }

  public set sum(v: number | undefined) {
    this.setColumnValue("sum", v);
  }

  public get value(): number | undefined {
    return this.getColumnValue("value") as number | undefined;
  }

  public set value(v: number | undefined) {
    this.setColumnValue("value", v);
  }

  public get min(): number | undefined {
    return this.getColumnValue("min") as number | undefined;
  }

  public set min(v: number | undefined) {
    this.setColumnValue("min", v);
  }

  public get max(): number | undefined {
    return this.getColumnValue("max") as number | undefined;
  }

  public set max(v: number | undefined) {
    this.setColumnValue("max", v);
  }

  public get bucketCounts(): Array<number> | undefined {
    return this.getColumnValue("bucketCounts") as Array<number> | undefined;
  }

  public set bucketCounts(v: Array<number> | undefined) {
    this.setColumnValue("bucketCounts", v);
  }

  public get explicitBounds(): Array<number> | undefined {
    return this.getColumnValue("explicitBounds") as Array<number> | undefined;
  }

  public set explicitBounds(v: Array<number> | undefined) {
    this.setColumnValue("explicitBounds", v);
  }
}
