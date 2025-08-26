import MonitorElement from "../../../Components/Monitor/Monitor";
import MonitorGroupElement from "../../../Components/MonitorGroup/MonitorGroupElement";
import PageComponentProps from "../../PageComponentProps";
import SortOrder from "Common/Types/BaseDatabase/SortOrder";
import { LIMIT_PER_PROJECT } from "Common/Types/Database/LimitMax";
import BadDataException from "Common/Types/Exception/BadDataException";
import { PromiseVoidFunction } from "Common/Types/FunctionTypes";
import ObjectID from "Common/Types/ObjectID";
import ComponentLoader from "Common/UI/Components/ComponentLoader/ComponentLoader";
import ErrorMessage from "Common/UI/Components/ErrorMessage/ErrorMessage";
import { ModelField } from "Common/UI/Components/Forms/ModelForm";
import FormFieldSchemaType from "Common/UI/Components/Forms/Types/FormFieldSchemaType";
import FormValues from "Common/UI/Components/Forms/Types/FormValues";
import ModelTable from "Common/UI/Components/ModelTable/ModelTable";
import FieldType from "Common/UI/Components/Types/FieldType";
import { GetReactElementFunction } from "Common/UI/Types/FunctionTypes";
import API from "Common/UI/Utils/API/API";
import DropdownUtil from "Common/UI/Utils/Dropdown";
import ModelAPI, { ListResult } from "Common/UI/Utils/ModelAPI/ModelAPI";
import Navigation from "Common/UI/Utils/Navigation";
import Monitor from "Common/Models/DatabaseModels/Monitor";
import MonitorGroup from "Common/Models/DatabaseModels/MonitorGroup";
import StatusPageGroup from "Common/Models/DatabaseModels/StatusPageGroup";
import StatusPageResource from "Common/Models/DatabaseModels/StatusPageResource";
import React, {
  Fragment,
  FunctionComponent,
  ReactElement,
  useEffect,
  useState,
} from "react";
import UptimePrecision from "Common/Types/StatusPage/UptimePrecision";
import Link from "Common/UI/Components/Link/Link";
import ProjectUtil from "Common/UI/Utils/Project";
import MarkdownUtil from "Common/UI/Utils/Markdown";

const StatusPageDelete: FunctionComponent<PageComponentProps> = (
  props: PageComponentProps,
): ReactElement => {
  const modelId: ObjectID = Navigation.getLastParamAsObjectID(1);

  const [groups, setGroups] = useState<Array<StatusPageGroup>>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  const [addMonitorGroup, setAddMonitorGroup] = useState<boolean>(false);

  const fetchGroups: PromiseVoidFunction = async (): Promise<void> => {
    setError("");
    setIsLoading(true);

    try {
      const listResult: ListResult<StatusPageGroup> =
        await ModelAPI.getList<StatusPageGroup>({
          modelType: StatusPageGroup,
          query: {
            statusPageId: modelId,
            projectId: props.currentProject!.id!,
          },
          limit: LIMIT_PER_PROJECT,
          skip: 0,
          select: {
            name: true,
            _id: true,
          },
          sort: {
            order: SortOrder.Ascending,
          },
          requestOptions: {},
        });

      setGroups(listResult.data);
    } catch (err) {
      setError(API.getFriendlyMessage(err));
    }

    setIsLoading(false);
  };

  useEffect(() => {
    fetchGroups().catch((err: Error) => {
      setError(API.getFriendlyMessage(err));
    });
  }, []);

  const getFooterForMonitor: GetReactElementFunction = (): ReactElement => {
    if (props.currentProject?.isFeatureFlagMonitorGroupsEnabled) {
      if (!addMonitorGroup) {
        return (
          <Link
            onClick={() => {
              setAddMonitorGroup(true);
            }}
            className="mt-1 text-sm text-gray-500 underline"
          >
            <div>
              <p> Add a Monitor Group instead. </p>
            </div>
          </Link>
        );
      }
      return (
        <Link
          onClick={() => {
            setAddMonitorGroup(false);
          }}
          className="mt-1 text-sm text-gray-500 underline"
        >
          <div>
            <p> Add a Monitor instead. </p>
          </div>
        </Link>
      );
    }

    return <></>;
  };

  let formFields: Array<ModelField<StatusPageResource>> = [
    {
      field: {
        monitor: true,
      },
      title: "Monitor",
      description: "Select monitor that will be shown on the status page.",
      fieldType: FormFieldSchemaType.Dropdown,
      dropdownModal: {
        type: Monitor,
        labelField: "name",
        valueField: "_id",
      },
      required: true,
      placeholder: "Select Monitor",
      stepId: "monitor-details",
      footerElement: getFooterForMonitor(),
    },
  ];

  if (addMonitorGroup) {
    formFields = [
      {
        field: {
          monitorGroup: true,
        },
        title: "Monitor Group",
        description:
          "Select monitor group that will be shown on the status page.",
        fieldType: FormFieldSchemaType.Dropdown,
        dropdownModal: {
          type: MonitorGroup,
          labelField: "name",
          valueField: "_id",
        },
        required: true,
        placeholder: "Select Monitor Group",
        stepId: "monitor-details",
        footerElement: getFooterForMonitor(),
      },
    ];
  }

  formFields = formFields.concat([
    {
      field: {
        displayName: true,
      },
      title: "Display Name",
      description:
        "This will be the name that will be shown on the status page",
      fieldType: FormFieldSchemaType.Text,
      required: true,
      placeholder: "Display Name",
      stepId: "monitor-details",
    },
    {
      field: {
        displayDescription: true,
      },
      title: "Description",
      fieldType: FormFieldSchemaType.Markdown,
      required: false,
      placeholder: "",
      stepId: "monitor-details",
      description: MarkdownUtil.getMarkdownCheatsheet(
        "Describe this resource here",
      ),
    },
    {
      field: {
        displayTooltip: true,
      },
      title: "Tooltip ",
      fieldType: FormFieldSchemaType.LongText,
      required: false,
      description:
        "This will show up as tooltip beside the resource on your status page.",
      placeholder: "Tooltip",
      stepId: "advanced",
    },
    {
      field: {
        showCurrentStatus: true,
      },
      title: "Show Current Resource Status",
      fieldType: FormFieldSchemaType.Toggle,
      required: false,
      defaultValue: true,
      description:
        "Current Resource Status will be shown beside this resource on your status page.",
      stepId: "advanced",
    },
    {
      field: {
        showUptimePercent: true,
      },
      title: "Show Uptime %",
      fieldType: FormFieldSchemaType.Toggle,
      required: false,
      defaultValue: false,
      description:
        "Show uptime percentage for the past 90 days beside this resource on your status page.",
      stepId: "advanced",
    },
    {
      field: {
        uptimePercentPrecision: true,
      },
      stepId: "advanced",
      fieldType: FormFieldSchemaType.Dropdown,
      dropdownOptions: DropdownUtil.getDropdownOptionsFromEnum(UptimePrecision),
      showIf: (item: FormValues<StatusPageResource>): boolean => {
        return Boolean(item.showUptimePercent);
      },
      title: "Select Uptime Precision",
      defaultValue: UptimePrecision.ONE_DECIMAL,
      required: true,
    },
    {
      field: {
        showStatusHistoryChart: true,
      },
      title: "Show Status History Chart",
      fieldType: FormFieldSchemaType.Toggle,
      required: false,
      description: "Show resource status history for the past 90 days. ",
      defaultValue: true,
      stepId: "advanced",
    },
  ]);

  type GetModelTableFunction = (
    statusPageGroupId: ObjectID | null,
    statusPageGroupName: string | null,
  ) => ReactElement;

  const getModelTable: GetModelTableFunction = (
    statusPageGroupId: ObjectID | null,
    statusPageGroupName: string | null,
  ): ReactElement => {
    return (
      <ModelTable<StatusPageResource>
        modelType={StatusPageResource}
        id={`status-page-group-${statusPageGroupId?.toString() || ""}`}
        userPreferencesKey="status-page-resource-table"
        isDeleteable={true}
        name="Status Page > Resources"
        sortBy="order"
        showViewIdButton={true}
        sortOrder={SortOrder.Ascending}
        isCreateable={true}
        isViewable={false}
        isEditable={true}
        query={{
          statusPageId: modelId,
          projectId: ProjectUtil.getCurrentProjectId()!,
          statusPageGroupId: statusPageGroupId!,
        }}
        enableDragAndDrop={true}
        dragDropIndexField="order"
        onBeforeCreate={(
          item: StatusPageResource,
        ): Promise<StatusPageResource> => {
          if (!props.currentProject || !props.currentProject._id) {
            throw new BadDataException("Project ID cannot be null");
          }
          item.statusPageId = modelId;
          item.projectId = new ObjectID(props.currentProject._id);

          if (statusPageGroupId) {
            item.statusPageGroupId = statusPageGroupId;
          }

          return Promise.resolve(item);
        }}
        cardProps={{
          title: `${
            statusPageGroupName
              ? statusPageGroupName + " - "
              : groups.length > 0
                ? "Uncategorized - "
                : ""
          }Status Page Resources`,
          description: "Resources that will be shown on the page",
        }}
        noItemsMessage={
          "No status page resources created for this status page."
        }
        formSteps={[
          {
            title: "Monitor Details",
            id: "monitor-details",
          },
          {
            title: "Advanced",
            id: "advanced",
          },
        ]}
        formFields={formFields}
        showRefreshButton={true}
        viewPageRoute={Navigation.getCurrentRoute()}
        selectMoreFields={{
          monitorGroup: {
            name: true,
            _id: true,
            projectId: true,
          },
        }}
        filters={[
          {
            field: {
              monitor: {
                name: true,
              },
            },
            title: "Monitor",
            type: FieldType.Entity,
            filterEntityType: Monitor,
            filterQuery: {
              projectId: ProjectUtil.getCurrentProjectId()!,
            },
            filterDropdownField: {
              label: "name",
              value: "_id",
            },
          },
          {
            field: {
              displayName: true,
            },
            title: "Display Name",
            type: FieldType.Text,
          },
        ]}
        columns={[
          {
            field: {
              monitor: {
                name: true,
                _id: true,
                projectId: true,
              },
            },
            title: props.currentProject?.isFeatureFlagMonitorGroupsEnabled
              ? "Resource"
              : "Monitor",
            type: FieldType.Entity,

            getElement: (item: StatusPageResource): ReactElement => {
              if (item["monitor"]) {
                return (
                  <MonitorElement
                    monitor={item["monitor"]}
                    showIcon={
                      props.currentProject?.isFeatureFlagMonitorGroupsEnabled ||
                      false
                    }
                  />
                );
              }

              if (item["monitorGroup"]) {
                return (
                  <MonitorGroupElement
                    monitorGroup={item["monitorGroup"]}
                    showIcon={
                      props.currentProject?.isFeatureFlagMonitorGroupsEnabled ||
                      false
                    }
                  />
                );
              }

              return <></>;
            },
          },
          {
            field: {
              displayName: true,
            },
            title: "Display Name",
            type: FieldType.Text,
          },
        ]}
      />
    );
  };

  return (
    <Fragment>
      <>
        {isLoading ? <ComponentLoader /> : <></>}

        {error ? <ErrorMessage message={error} /> : <></>}

        {!isLoading && !error ? getModelTable(null, null) : <></>}

        {!isLoading && !error && groups && groups.length > 0 ? (
          groups.map((group: StatusPageGroup) => {
            return getModelTable(group.id, group.name || null);
          })
        ) : (
          <></>
        )}
      </>
    </Fragment>
  );
};

export default StatusPageDelete;
