import PageComponentProps from "../../PageComponentProps";
import SortOrder from "Common/Types/BaseDatabase/SortOrder";
import BadDataException from "Common/Types/Exception/BadDataException";
import ObjectID from "Common/Types/ObjectID";
import FormFieldSchemaType from "Common/UI/Components/Forms/Types/FormFieldSchemaType";
import CardModelDetail from "Common/UI/Components/ModelDetail/CardModelDetail";
import ModelTable from "Common/UI/Components/ModelTable/ModelTable";
import FieldType from "Common/UI/Components/Types/FieldType";
import Navigation from "Common/UI/Utils/Navigation";
import StatusPage from "Common/Models/DatabaseModels/StatusPage";
import StatusPageHeaderLink from "Common/Models/DatabaseModels/StatusPageHeaderLink";
import React, { Fragment, FunctionComponent, ReactElement } from "react";
import ProjectUtil from "Common/UI/Utils/Project";

const StatusPageDelete: FunctionComponent<PageComponentProps> = (
  props: PageComponentProps,
): ReactElement => {
  const modelId: ObjectID = Navigation.getLastParamAsObjectID(1);

  return (
    <Fragment>
      <CardModelDetail<StatusPage>
        name="Status Page > Branding > Header Style"
        cardProps={{
          title: "Logo, Cover and Favicon",
          description: "These will show up on your status page.",
        }}
        isEditable={true}
        editButtonText={"Edit Images"}
        formFields={[
          {
            field: {
              logoFile: true,
            },
            title: "Logo",
            fieldType: FormFieldSchemaType.ImageFile,
            required: false,
            placeholder: "Upload logo",
          },
          {
            field: {
              coverImageFile: true,
            },
            title: "Cover",
            fieldType: FormFieldSchemaType.ImageFile,
            required: false,
            placeholder: "Upload cover image",
          },
        ]}
        modelDetailProps={{
          showDetailsInNumberOfColumns: 1,
          modelType: StatusPage,
          id: "model-detail-status-page",
          fields: [
            {
              field: {
                logoFile: {
                  file: true,
                  fileType: true,
                },
              },
              fieldType: FieldType.ImageFile,
              title: "Logo",
              placeholder: "No logo uploaded.",
            },
            {
              field: {
                coverImageFile: {
                  file: true,
                  fileType: true,
                },
              },
              fieldType: FieldType.ImageFile,
              title: "Cover Image",
              placeholder: "No cover uploaded.",
            },
          ],
          modelId: modelId,
        }}
      />

      <ModelTable<StatusPageHeaderLink>
        modelType={StatusPageHeaderLink}
        id="status-page-header-link"
        name="Status Page > Header Links"
        userPreferencesKey="status-page-header-link-table"
        isDeleteable={true}
        sortBy="order"
        sortOrder={SortOrder.Ascending}
        isCreateable={true}
        isEditable={true}
        isViewable={false}
        query={{
          statusPageId: modelId,
          projectId: ProjectUtil.getCurrentProjectId()!,
        }}
        enableDragAndDrop={true}
        dragDropIndexField="order"
        onBeforeCreate={(
          item: StatusPageHeaderLink,
        ): Promise<StatusPageHeaderLink> => {
          if (!props.currentProject || !props.currentProject._id) {
            throw new BadDataException("Project ID cannot be null");
          }
          item.statusPageId = modelId;
          item.projectId = new ObjectID(props.currentProject._id);
          return Promise.resolve(item);
        }}
        cardProps={{
          title: "Header Links",
          description: "Header Links for your status page",
        }}
        noItemsMessage={"No status header link for this status page."}
        formFields={[
          {
            field: {
              title: true,
            },
            title: "Title",
            fieldType: FormFieldSchemaType.Text,
            required: true,
            placeholder: "Title",
          },
          {
            field: {
              link: true,
            },
            title: "Link",
            fieldType: FormFieldSchemaType.URL,
            required: true,
            placeholder: "https://link.com",
            disableSpellCheck: true,
          },
        ]}
        showRefreshButton={true}
        viewPageRoute={Navigation.getCurrentRoute()}
        filters={[
          {
            field: {
              title: true,
            },
            title: "Title",
            type: FieldType.Text,
          },
          {
            field: {
              link: true,
            },
            title: "Link",
            type: FieldType.URL,
          },
        ]}
        columns={[
          {
            field: {
              title: true,
            },
            title: "Title",
            type: FieldType.Text,
          },
          {
            field: {
              link: true,
            },
            title: "Link",
            type: FieldType.URL,
            hideOnMobile: true,
          },
        ]}
      />
    </Fragment>
  );
};

export default StatusPageDelete;
