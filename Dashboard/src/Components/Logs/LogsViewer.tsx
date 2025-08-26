import Includes from "Common/Types/BaseDatabase/Includes";
import SortOrder from "Common/Types/BaseDatabase/SortOrder";
import { LIMIT_PER_PROJECT } from "Common/Types/Database/LimitMax";
import { PromiseVoidFunction } from "Common/Types/FunctionTypes";
import ObjectID from "Common/Types/ObjectID";
import ErrorMessage from "Common/UI/Components/ErrorMessage/ErrorMessage";
import LogsViewer from "Common/UI/Components/LogsViewer/LogsViewer";
import API from "Common/UI/Utils/API/API";
import AnalyticsModelAPI, {
  ListResult,
} from "Common/UI/Utils/AnalyticsModelAPI/AnalyticsModelAPI";
import Query from "Common/Types/BaseDatabase/Query";
import ProjectUtil from "Common/UI/Utils/Project";
import Realtime from "Common/UI/Utils/Realtime";
import Log from "Common/Models/AnalyticsModels/Log";
import React, { FunctionComponent, ReactElement, useEffect } from "react";
import ModelEventType from "Common/Types/Realtime/ModelEventType";
import Select from "Common/Types/BaseDatabase/Select";

export interface ComponentProps {
  id: string;
  telemetryServiceIds?: Array<ObjectID> | undefined;
  enableRealtime?: boolean;
  traceIds?: Array<string> | undefined;
  spanIds?: Array<string> | undefined;
  showFilters?: boolean | undefined;
  noLogsMessage?: string | undefined;
  logQuery?: Query<Log> | undefined;
  limit?: number | undefined;
}

const DashboardLogsViewer: FunctionComponent<ComponentProps> = (
  props: ComponentProps,
): ReactElement => {
  type RefreshQueryFunction = () => Query<Log>;

  const refreshQuery: RefreshQueryFunction = (): Query<Log> => {
    const query: Query<Log> = {};

    if (props.telemetryServiceIds && props.telemetryServiceIds.length > 0) {
      query.serviceId = new Includes(props.telemetryServiceIds);
    }

    if (props.traceIds && props.traceIds.length > 0) {
      query.traceId = new Includes(props.traceIds);
    }

    if (props.spanIds && props.spanIds.length > 0) {
      query.spanId = new Includes(props.spanIds);
    }

    if (props.logQuery && Object.keys(props.logQuery).length > 0) {
      for (const key in props.logQuery) {
        (query as any)[key] = (props.logQuery as any)[key] as any;
      }
    }

    return query;
  };

  const [logs, setLogs] = React.useState<Array<Log>>([]);
  const [error, setError] = React.useState<string>("");
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [filterOptions, setFilterOptions] =
    React.useState<Query<Log>>(refreshQuery());

  const select: Select<Log> = {
    body: true,
    time: true,
    projectId: true,
    serviceId: true,
    spanId: true,
    traceId: true,
    severityText: true,
    attributes: true,
  };

  type GetQueryFunction = () => Query<Log>;

  const getQuery: GetQueryFunction = (): Query<Log> => {
    return filterOptions;
  };

  useEffect(() => {
    fetchItems().catch((err: unknown) => {
      setError(API.getFriendlyMessage(err));
    });
  }, [filterOptions]);

  useEffect(() => {
    setFilterOptions(refreshQuery());
  }, [
    props.telemetryServiceIds,
    props.traceIds,
    props.spanIds,
    props.logQuery,
  ]);

  const fetchItems: PromiseVoidFunction = async (): Promise<void> => {
    setError("");
    setIsLoading(true);

    try {
      const listResult: ListResult<Log> = await AnalyticsModelAPI.getList<Log>({
        modelType: Log,
        query: getQuery(),
        limit: props.limit || LIMIT_PER_PROJECT,
        skip: 0,
        select: select,
        sort: {
          time: SortOrder.Descending,
        },
        requestOptions: {},
      });

      // reverse the logs so that the newest logs are at the bottom
      listResult.data.reverse();

      setLogs(listResult.data);
    } catch (err) {
      setError(API.getFriendlyMessage(err));
    }

    setIsLoading(false);
  };

  useEffect(() => {
    if (!props.enableRealtime) {
      return;
    }

    const disconnectFunction: () => void = Realtime.listenToAnalyticsModelEvent(
      {
        modelType: Log,
        eventType: ModelEventType.Create,
        tenantId: ProjectUtil.getCurrentProjectId()!,
      },
      (model: Log) => {
        setLogs((logs: Array<Log>) => {
          return [...logs, model];
        });
      },
    );

    return () => {
      disconnectFunction();
    };
  }, []);

  if (error) {
    return <ErrorMessage message={error} />;
  }

  return (
    <div id={props.id}>
      <LogsViewer
        isLoading={isLoading}
        onFilterChanged={(filterOptions: Query<Log>) => {
          setFilterOptions(filterOptions);
        }}
        filterData={filterOptions}
        logs={logs}
        showFilters={props.showFilters}
        noLogsMessage={props.noLogsMessage}
      />
    </div>
  );
};

export default DashboardLogsViewer;
