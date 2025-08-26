import PageComponentProps from "../../PageComponentProps";
import NotNull from "Common/Types/BaseDatabase/NotNull";
import BadDataException from "Common/Types/Exception/BadDataException";
import ObjectID from "Common/Types/ObjectID";
import FormFieldSchemaType from "Common/UI/Components/Forms/Types/FormFieldSchemaType";
import ModelTable from "Common/UI/Components/ModelTable/ModelTable";
import FieldType from "Common/UI/Components/Types/FieldType";
import Navigation from "Common/UI/Utils/Navigation";
import StatusPageSubscriber from "Common/Models/DatabaseModels/StatusPageSubscriber";
import React, { Fragment, FunctionComponent, ReactElement } from "react";
import ProjectUtil from "Common/UI/Utils/Project";

const StatusPageDelete: FunctionComponent<PageComponentProps> = (
  props: PageComponentProps,
): ReactElement => {
  const modelId: ObjectID = Navigation.getLastParamAsObjectID(1);

  return (
    <Fragment>
      <ModelTable<StatusPageSubscriber>
        modelType={StatusPageSubscriber}
        name="Status Page > Webhook Subscribers"
        id="table-subscriber"
        userPreferencesKey="status-page-subscriber-table"
        isDeleteable={true}
        isCreateable={true}
        isEditable={false}
        isViewable={false}
        query={{
          statusPageId: modelId,
          projectId: ProjectUtil.getCurrentProjectId()!,
          subscriberWebhook: new NotNull(),
        }}
        onBeforeCreate={(
          item: StatusPageSubscriber,
        ): Promise<StatusPageSubscriber> => {
          if (!props.currentProject || !props.currentProject._id) {
            throw new BadDataException("Project ID cannot be null");
          }

          item.statusPageId = modelId;
          item.projectId = new ObjectID(props.currentProject._id);
          return Promise.resolve(item);
        }}
        cardProps={{
          title: "Webhook Subscribers",
          description:
            "Here are the list of subscribers who have subscribed to the status page.",
        }}
        noItemsMessage={"No subscribers found."}
        formFields={[
          {
            field: {
              subscriberWebhook: true,
            },
            title: "Webhook URL",
            description: "A POST request will be sent to this webhook.",
            fieldType: FormFieldSchemaType.URL,
            required: true,
            placeholder: "URL",
            disableSpellCheck: true,
          },
        ]}
        showRefreshButton={true}
        viewPageRoute={Navigation.getCurrentRoute()}
        filters={[
          {
            field: {
              subscriberWebhook: true,
            },
            title: "Webhook URL",
            type: FieldType.URL,
          },
          {
            field: {
              createdAt: true,
            },
            title: "Subscribed At",
            type: FieldType.DateTime,
          },
        ]}
        columns={[
          {
            field: {
              subscriberWebhook: true,
            },
            title: "Webhook URL",
            type: FieldType.URL,
          },
          {
            field: {
              createdAt: true,
            },
            title: "Subscribed At",
            type: FieldType.DateTime,
            hideOnMobile: true,
          },
        ]}
      />
    </Fragment>
  );
};

export default StatusPageDelete;
