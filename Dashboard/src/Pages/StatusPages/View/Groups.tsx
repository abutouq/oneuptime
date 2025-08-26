import PageComponentProps from "../../PageComponentProps";
import SortOrder from "Common/Types/BaseDatabase/SortOrder";
import BadDataException from "Common/Types/Exception/BadDataException";
import ObjectID from "Common/Types/ObjectID";
import FormFieldSchemaType from "Common/UI/Components/Forms/Types/FormFieldSchemaType";
import ModelTable from "Common/UI/Components/ModelTable/ModelTable";
import FieldType from "Common/UI/Components/Types/FieldType";
import Navigation from "Common/UI/Utils/Navigation";
import StatusPageGroup from "Common/Models/DatabaseModels/StatusPageGroup";
import React, { Fragment, FunctionComponent, ReactElement } from "react";
import UptimePrecision from "Common/Types/StatusPage/UptimePrecision";
import DropdownUtil from "Common/UI/Utils/Dropdown";
import FormValues from "Common/UI/Components/Forms/Types/FormValues";
import ProjectUtil from "Common/UI/Utils/Project";
import MarkdownUtil from "Common/UI/Utils/Markdown";

const StatusPageDelete: FunctionComponent<PageComponentProps> = (
  props: PageComponentProps,
): ReactElement => {
  const modelId: ObjectID = Navigation.getLastParamAsObjectID(1);

  return (
    <Fragment>
      <ModelTable<StatusPageGroup>
        modelType={StatusPageGroup}
        id="status-page-group"
        name="Status Page > Groups"
        userPreferencesKey="status-page-group-table"
        isDeleteable={true}
        sortBy="order"
        showViewIdButton={true}
        sortOrder={SortOrder.Ascending}
        isCreateable={true}
        isViewable={false}
        isEditable={true}
        query={{
          statusPageId: modelId,
          projectId: ProjectUtil.getCurrentProjectId()!,
        }}
        enableDragAndDrop={true}
        dragDropIndexField="order"
        onBeforeCreate={(item: StatusPageGroup): Promise<StatusPageGroup> => {
          if (!props.currentProject || !props.currentProject._id) {
            throw new BadDataException("Project ID cannot be null");
          }
          item.statusPageId = modelId;
          item.projectId = new ObjectID(props.currentProject._id);
          return Promise.resolve(item);
        }}
        cardProps={{
          title: "Resource Groups",
          description:
            "Here are different groups for your status page resources.",
        }}
        noItemsMessage={"No status page group created for this status page."}
        formSteps={[
          {
            title: "Group Details",
            id: "group-details",
          },
          {
            title: "Advanced",
            id: "advanced",
          },
        ]}
        formFields={[
          {
            field: {
              name: true,
            },
            title: "Group Name",
            fieldType: FormFieldSchemaType.Text,
            required: true,
            placeholder: "Resource Group Name",
            stepId: "group-details",
          },
          {
            field: {
              description: true,
            },
            title: "Group Description",
            fieldType: FormFieldSchemaType.Markdown,
            required: false,
            stepId: "group-details",
            description: MarkdownUtil.getMarkdownCheatsheet(
              "Describe the status page group here",
            ),
          },
          {
            field: {
              isExpandedByDefault: true,
            },
            title: "Expand on Status Page by Default",
            fieldType: FormFieldSchemaType.Toggle,
            required: false,
            stepId: "group-details",
          },
          {
            field: {
              showCurrentStatus: true,
            },
            title: "Show Current Group Status",
            fieldType: FormFieldSchemaType.Toggle,
            required: false,
            defaultValue: true,
            description:
              "Current Status will be shown beside this group on your status page.",
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
              "Show uptime percentage for the past 90 days beside this group on your status page.",
            stepId: "advanced",
          },
          {
            field: {
              uptimePercentPrecision: true,
            },
            stepId: "advanced",
            fieldType: FormFieldSchemaType.Dropdown,
            dropdownOptions:
              DropdownUtil.getDropdownOptionsFromEnum(UptimePrecision),
            showIf: (item: FormValues<StatusPageGroup>): boolean => {
              return Boolean(item.showUptimePercent);
            },
            title: "Select Uptime Precision",
            defaultValue: UptimePrecision.ONE_DECIMAL,
            required: true,
          },
        ]}
        showRefreshButton={true}
        viewPageRoute={Navigation.getCurrentRoute()}
        filters={[
          {
            field: {
              name: true,
            },
            title: "Resource Group Name",
            type: FieldType.Text,
          },
          {
            field: {
              isExpandedByDefault: true,
            },
            title: "Expanded on Status Page by Default",
            type: FieldType.Boolean,
          },
        ]}
        columns={[
          {
            field: {
              name: true,
            },
            title: "Resource Group Name",
            type: FieldType.Text,
          },
          {
            field: {
              isExpandedByDefault: true,
            },
            title: "Expanded on Status Page by Default",
            type: FieldType.Boolean,
            hideOnMobile: true,
          },
        ]}
      />
    </Fragment>
  );
};

export default StatusPageDelete;
