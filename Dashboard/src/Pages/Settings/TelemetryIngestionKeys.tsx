import ProjectUtil from "Common/UI/Utils/Project";
import PageComponentProps from "../PageComponentProps";
import FormFieldSchemaType from "Common/UI/Components/Forms/Types/FormFieldSchemaType";
import ModelTable from "Common/UI/Components/ModelTable/ModelTable";
import FieldType from "Common/UI/Components/Types/FieldType";
import Navigation from "Common/UI/Utils/Navigation";
import TelemetryIngestionKey from "Common/Models/DatabaseModels/TelemetryIngestionKey";
import React, { Fragment, FunctionComponent, ReactElement } from "react";

const APIKeys: FunctionComponent<PageComponentProps> = (): ReactElement => {
  return (
    <Fragment>
      <ModelTable<TelemetryIngestionKey>
        modelType={TelemetryIngestionKey}
        query={{
          projectId: ProjectUtil.getCurrentProjectId()!,
        }}
        id="api-keys-table"
        name="Settings > Telemetry Ingestion Keys"
        isDeleteable={false}
        isEditable={false}
        showViewIdButton={false}
        isCreateable={true}
        isViewable={true}
        singularName="Ingestion Key"
        userPreferencesKey="telemetry-ingestion-keys-table"
        cardProps={{
          title: "Telemetry Ingestion Keys",
          description:
            "These keys are used to ingest telemetry data like Logs, Traces and Metrics for your project.",
        }}
        noItemsMessage={"No telemetry ingestion keys found."}
        formFields={[
          {
            field: {
              name: true,
            },
            title: "Name",
            fieldType: FormFieldSchemaType.Text,
            required: true,
            placeholder: "Ingestion Key Name",
            validation: {
              minLength: 2,
            },
          },
          {
            field: {
              description: true,
            },
            title: "Description",
            fieldType: FormFieldSchemaType.LongText,
            required: false,
            placeholder: "Ingestion Key Description",
          },
        ]}
        showRefreshButton={true}
        viewPageRoute={Navigation.getCurrentRoute()}
        filters={[
          {
            field: {
              name: true,
            },
            type: FieldType.Text,
            title: "Name",
          },
          {
            field: {
              description: true,
            },
            type: FieldType.Text,
            title: "Description",
          },
        ]}
        columns={[
          {
            field: {
              name: true,
            },
            title: "Name",
            type: FieldType.Text,
          },
          {
            field: {
              description: true,
            },
            noValueMessage: "-",
            title: "Description",
            type: FieldType.LongText,
          },
        ]}
      />
    </Fragment>
  );
};

export default APIKeys;
