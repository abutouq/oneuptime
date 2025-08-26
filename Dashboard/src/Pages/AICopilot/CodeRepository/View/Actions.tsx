import FormFieldSchemaType from "Common/UI/Components/Forms/Types/FormFieldSchemaType";
import ModelTable from "Common/UI/Components/ModelTable/ModelTable";
import FieldType from "Common/UI/Components/Types/FieldType";
import Navigation from "Common/UI/Utils/Navigation";
import CopilotActionTypePriority from "Common/Models/DatabaseModels/CopilotActionTypePriority";
import React, { Fragment, FunctionComponent, ReactElement } from "react";
import PageComponentProps from "../../../PageComponentProps";
import ObjectID from "Common/Types/ObjectID";
import SortOrder from "Common/Types/BaseDatabase/SortOrder";
import DropdownUtil from "Common/UI/Utils/Dropdown";
import CopilotActionType from "Common/Types/Copilot/CopilotActionType";
import CopilotActionTypeElement from "../../../../Components/Copilot/CopilotAction/CopilotActionTypeElement";
import ProjectUtil from "Common/UI/Utils/Project";

const CopilotPriorities: FunctionComponent<
  PageComponentProps
> = (): ReactElement => {
  const modelId: ObjectID = Navigation.getLastParamAsObjectID(1);

  return (
    <Fragment>
      <ModelTable<CopilotActionTypePriority>
        modelType={CopilotActionTypePriority}
        query={{
          projectId: ProjectUtil.getCurrentProjectId()!,
          codeRepositoryId: modelId,
        }}
        sortBy={"priority"}
        sortOrder={SortOrder.Ascending}
        userPreferencesKey="copilot-priorities-table"
        id="priority-table"
        name="Settings > priority"
        isDeleteable={true}
        isEditable={true}
        isCreateable={true}
        cardProps={{
          title: "Actions",
          description:
            "Actions lets you define what would you like to be improved in your codebase.",
        }}
        noItemsMessage={"No actions found."}
        viewPageRoute={Navigation.getCurrentRoute()}
        formFields={[
          {
            field: {
              actionType: true,
            },
            title: "Action",
            fieldType: FormFieldSchemaType.Dropdown,
            dropdownOptions:
              DropdownUtil.getDropdownOptionsFromEnum(CopilotActionType),
          },
          {
            field: {
              priority: true,
            },
            title: "Priority",
            fieldType: FormFieldSchemaType.Number,
            required: true,
            defaultValue: 1,
            placeholder:
              "Please enter priority for this action. Please enter a number from 1 to 5.",
          },
        ]}
        createVerb="Add"
        singularName="Action"
        pluralName="Actions"
        showRefreshButton={true}
        onBeforeCreate={(
          copilotActionTypePriority: CopilotActionTypePriority,
        ) => {
          copilotActionTypePriority.codeRepositoryId = modelId;
          return Promise.resolve(copilotActionTypePriority);
        }}
        showViewIdButton={true}
        filters={[]}
        columns={[
          {
            field: {
              actionType: true,
            },
            title: "Action",
            type: FieldType.Element,
            getElement: (
              copilotActionTypePriority: CopilotActionTypePriority,
            ) => {
              return (
                <CopilotActionTypeElement
                  copilotAction={copilotActionTypePriority.actionType!}
                />
              );
            },
          },
          {
            field: {
              priority: true,
            },
            title: "Priotiry",
            type: FieldType.Number,
          },
        ]}
      />
    </Fragment>
  );
};

export default CopilotPriorities;
