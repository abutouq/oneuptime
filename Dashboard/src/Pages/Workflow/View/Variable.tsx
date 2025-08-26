import PageComponentProps from "../../PageComponentProps";
import ObjectID from "Common/Types/ObjectID";
import FormFieldSchemaType from "Common/UI/Components/Forms/Types/FormFieldSchemaType";
import ModelTable from "Common/UI/Components/ModelTable/ModelTable";
import FieldType from "Common/UI/Components/Types/FieldType";
import Navigation from "Common/UI/Utils/Navigation";
import WorkflowVariable from "Common/Models/DatabaseModels/WorkflowVariable";
import React, { Fragment, FunctionComponent, ReactElement } from "react";
import ProjectUtil from "Common/UI/Utils/Project";

const Workflows: FunctionComponent<PageComponentProps> = (): ReactElement => {
  const modelId: ObjectID = Navigation.getLastParamAsObjectID(1);

  return (
    <Fragment>
      <ModelTable<WorkflowVariable>
        modelType={WorkflowVariable}
        id="status-page-table"
        isDeleteable={true}
        isEditable={false}
        isCreateable={true}
        showViewIdButton={true}
        name="Workflows"
        isViewable={false}
        userPreferencesKey="workflow-variable-table"
        cardProps={{
          title: "Workflow Variables",
          description:
            "Here is a list of workflow secrets and variables for this specific workflow.",
        }}
        query={{
          workflowId: modelId,
          projectId: ProjectUtil.getCurrentProjectId()!,
        }}
        onBeforeCreate={(item: WorkflowVariable): Promise<WorkflowVariable> => {
          item.workflowId = modelId;
          return Promise.resolve(item);
        }}
        noItemsMessage={"No workflow variables found."}
        formFields={[
          {
            field: {
              name: true,
            },
            title: "Name",
            fieldType: FormFieldSchemaType.Text,
            required: true,
            placeholder: "Workflow Name",
            validation: {
              minLength: 2,
              noSpaces: true,
              noSpecialCharacters: true,
              noNumbers: true,
            },
          },
          {
            field: {
              description: true,
            },
            title: "Description",
            fieldType: FormFieldSchemaType.LongText,
            required: false,
            placeholder: "Description",
          },
          {
            field: {
              isSecret: true,
            },
            title: "Secret",
            description:
              "Is this variable secret or secure? Should this be encrypted in the Database?",
            fieldType: FormFieldSchemaType.Toggle,
            required: false,
          },
          {
            field: {
              content: true,
            },
            title: "Content",
            description: "Enter the content of the variable",
            fieldType: FormFieldSchemaType.LongText,
            required: true,
          },
        ]}
        showRefreshButton={true}
        filters={[
          {
            title: "Name",
            type: FieldType.Text,
            field: {
              name: true,
            },
          },
          {
            title: "Description",
            type: FieldType.LongText,
            field: {
              description: true,
            },
          },
          {
            title: "Secret",
            type: FieldType.Boolean,
            field: {
              isSecret: true,
            },
          },
          {
            title: "Created At",
            type: FieldType.Date,
            field: {
              createdAt: true,
            },
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
          {
            field: {
              isSecret: true,
            },
            title: "Secret",
            type: FieldType.Boolean,
          },
          {
            field: {
              createdAt: true,
            },
            title: "Created At",
            type: FieldType.DateTime,
          },
        ]}
      />
    </Fragment>
  );
};

export default Workflows;
