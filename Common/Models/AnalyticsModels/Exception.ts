import AnalyticsBaseModel from "./AnalyticsBaseModel/AnalyticsBaseModel";
import Route from "../../Types/API/Route";
import AnalyticsTableEngine from "../../Types/AnalyticsDatabase/AnalyticsTableEngine";
import AnalyticsTableColumn from "../../Types/AnalyticsDatabase/TableColumn";
import TableColumnType from "../../Types/AnalyticsDatabase/TableColumnType";
import ObjectID from "../../Types/ObjectID";
import Permission from "../../Types/Permission";

export default class Exception extends AnalyticsBaseModel {
    public constructor() {
        super({
            tableName: "ExceptionTelemetry",
            tableEngine: AnalyticsTableEngine.MergeTree,
            singularName: "Exception",
            enableRealtimeEventsOn: {
                create: true,
            },
            accessControl: {
                read: [
                    Permission.ProjectOwner,
                    Permission.ProjectAdmin,
                    Permission.ProjectMember,
                    Permission.ReadTelemetryServiceException,
                ],
                create: [
                    Permission.ProjectOwner,
                    Permission.ProjectAdmin,
                    Permission.ProjectMember,
                    Permission.CreateTelemetryServiceException,
                ],
                update: [
                    Permission.ProjectOwner,
                    Permission.ProjectAdmin,
                    Permission.ProjectMember,
                    Permission.EditTelemetryServiceException,
                ],
                delete: [
                    Permission.ProjectOwner,
                    Permission.ProjectAdmin,
                    Permission.ProjectMember,
                    Permission.DeleteTelemetryServiceException,
                ],
            },
            pluralName: "Exceptions",
            crudApiPath: new Route("/exceptions"),
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
                            Permission.ReadTelemetryServiceException,
                        ],
                        create: [
                            Permission.ProjectOwner,
                            Permission.ProjectAdmin,
                            Permission.ProjectMember,
                            Permission.CreateTelemetryServiceException,
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
                            Permission.ReadTelemetryServiceException,
                        ],
                        create: [
                            Permission.ProjectOwner,
                            Permission.ProjectAdmin,
                            Permission.ProjectMember,
                            Permission.CreateTelemetryServiceException,
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
                            Permission.ReadTelemetryServiceException,
                        ],
                        create: [
                            Permission.ProjectOwner,
                            Permission.ProjectAdmin,
                            Permission.ProjectMember,
                            Permission.CreateTelemetryServiceException,
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
                            Permission.ReadTelemetryServiceException,
                        ],
                        create: [
                            Permission.ProjectOwner,
                            Permission.ProjectAdmin,
                            Permission.ProjectMember,
                            Permission.CreateTelemetryServiceException,
                        ],
                        update: [],
                    },
                }),

                new AnalyticsTableColumn({
                    key: "exceptionType",
                    title: "Exception Type",
                    description: "Exception Type", // Examples: java.net.ConnectException; OSError; etc.
                    required: false,
                    type: TableColumnType.Text,
                    accessControl: {
                        read: [
                            Permission.ProjectOwner,
                            Permission.ProjectAdmin,
                            Permission.ProjectMember,
                            Permission.ReadTelemetryServiceException,
                        ],
                        create: [
                            Permission.ProjectOwner,
                            Permission.ProjectAdmin,
                            Permission.ProjectMember,
                            Permission.CreateTelemetryServiceException,
                        ],
                        update: [],
                    },
                }),

                new AnalyticsTableColumn({
                    key: "stackTrace",
                    title: "Stack Trace",
                    description: "Exception Stack Trace", // Examples: Division by zero; Can't convert 'int' object to str implicitly
                    required: false,
                    type: TableColumnType.Text,
                    accessControl: {
                        read: [
                            Permission.ProjectOwner,
                            Permission.ProjectAdmin,
                            Permission.ProjectMember,
                            Permission.ReadTelemetryServiceException,
                        ],
                        create: [
                            Permission.ProjectOwner,
                            Permission.ProjectAdmin,
                            Permission.ProjectMember,
                            Permission.CreateTelemetryServiceException,
                        ],
                        update: [],
                    },
                }),

                new AnalyticsTableColumn({
                    key: "message",
                    title: "Exception Message",
                    description: "Exception Message", // Examples: Division by zero; Can't convert 'int' object to str implicitly
                    required: false,
                    type: TableColumnType.Text,
                    accessControl: {
                        read: [
                            Permission.ProjectOwner,
                            Permission.ProjectAdmin,
                            Permission.ProjectMember,
                            Permission.ReadTelemetryServiceException,
                        ],
                        create: [
                            Permission.ProjectOwner,
                            Permission.ProjectAdmin,
                            Permission.ProjectMember,
                            Permission.CreateTelemetryServiceException,
                        ],
                        update: [],
                    },
                }),

                new AnalyticsTableColumn({
                    key: "escapted",
                    title: "Exception Escaped",
                    description: "Exception Escaped", // SHOULD be set to true if the exception event is recorded at a point where it is known that the exception is escaping the scope of the span.
                    required: false,
                    type: TableColumnType.Boolean,
                    accessControl: {
                        read: [
                            Permission.ProjectOwner,
                            Permission.ProjectAdmin,
                            Permission.ProjectMember,
                            Permission.ReadTelemetryServiceException,
                        ],
                        create: [
                            Permission.ProjectOwner,
                            Permission.ProjectAdmin,
                            Permission.ProjectMember,
                            Permission.CreateTelemetryServiceException,
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
                            Permission.ReadTelemetryServiceException,
                        ],
                        create: [
                            Permission.ProjectOwner,
                            Permission.ProjectAdmin,
                            Permission.ProjectMember,
                            Permission.CreateTelemetryServiceException,
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
                            Permission.ReadTelemetryServiceException,
                        ],
                        create: [
                            Permission.ProjectOwner,
                            Permission.ProjectAdmin,
                            Permission.ProjectMember,
                            Permission.CreateTelemetryServiceException,
                        ],
                        update: [],
                    },
                }),
            ],
            sortKeys: ["projectId", "serviceId", "time", "exceptionType"],
            primaryKeys: ["projectId", "serviceId"],
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

    public get exceptionType(): string | undefined {
        return this.getColumnValue("exceptionType") as string | undefined;
    }

    public set exceptionType(v: string | undefined) {
        this.setColumnValue("exceptionType", v);
    }

    public get stackTrace(): string | undefined {
        return this.getColumnValue("stackTrace") as string | undefined;
    }

    public set stackTrace(v: string | undefined) {
        this.setColumnValue("stackTrace", v);
    }

    public get message(): string | undefined {
        return this.getColumnValue("message") as string | undefined;
    }

    public set message(v: string | undefined) {
        this.setColumnValue("message", v);
    }

    public get escapted(): boolean | undefined {
        return this.getColumnValue("escapted") as boolean | undefined;
    }

    public set escapted(v: boolean | undefined) {
        this.setColumnValue("escapted", v);
    }
}
