import ModelAPI, { RequestOptions } from "../../Utils/ModelAPI/ModelAPI";
import { FormType, ModelField } from "../Forms/ModelForm";
import ModelFormModal from "../ModelFormModal/ModelFormModal";
import BaseModelTable, { BaseTableProps, ModalType } from "./BaseModelTable";
import { AnalyticsBaseModelType } from "../../../Models/AnalyticsModels/AnalyticsBaseModel/AnalyticsBaseModel";
import BaseModel, {
  DatabaseBaseModelType,
} from "../../../Models/DatabaseModels/DatabaseBaseModel/DatabaseBaseModel";
import Dictionary from "../../../Types/Dictionary";
import { JSONObject } from "../../../Types/JSON";
import ObjectID from "../../../Types/ObjectID";
import React, { ReactElement } from "react";
import Query from "../../../Types/BaseDatabase/Query";
import GroupBy from "../../../Types/BaseDatabase/GroupBy";
import Sort from "../../../Types/BaseDatabase/Sort";
import Select from "../../../Types/BaseDatabase/Select";

export interface ComponentProps<TBaseModel extends BaseModel>
  extends BaseTableProps<TBaseModel> {
  modelAPI?: typeof ModelAPI | undefined;
}

const ModelTable: <TBaseModel extends BaseModel>(
  props: ComponentProps<TBaseModel>,
) => ReactElement = <TBaseModel extends BaseModel>(
  props: ComponentProps<TBaseModel>,
): ReactElement => {
  const modelAPI: typeof ModelAPI = props.modelAPI || ModelAPI;
  const model: TBaseModel = new props.modelType();

  return (
    <BaseModelTable
      {...props}
      callbacks={{
        getJSONFromModel: (item: TBaseModel): JSONObject => {
          return BaseModel.toJSONObject(item, props.modelType);
        },

        updateById: async (args: { id: ObjectID; data: JSONObject }) => {
          const { id, data } = args;

          await modelAPI.updateById({
            modelType: props.modelType,
            id: new ObjectID(id),
            data: data,
          });
        },

        toJSONArray: (items: TBaseModel[]): JSONObject[] => {
          return BaseModel.toJSONObjectArray(items, props.modelType);
        },

        getList: async (data: {
          modelType: DatabaseBaseModelType | AnalyticsBaseModelType;
          query: Query<TBaseModel>;
          groupBy?: GroupBy<TBaseModel> | undefined;
          limit: number;
          skip: number;
          sort: Sort<TBaseModel>;
          select: Select<TBaseModel>;
          requestOptions?: RequestOptions | undefined;
        }) => {
          return await modelAPI.getList<TBaseModel>({
            modelType: data.modelType as { new (): TBaseModel },
            query: data.query,
            limit: data.limit,
            groupBy: data.groupBy,
            skip: data.skip,
            sort: data.sort,
            select: data.select,
            requestOptions: data.requestOptions,
          });
        },

        addSlugToSelect: (select: Select<TBaseModel>): Select<TBaseModel> => {
          const slugifyColumn: string | null = (
            model as BaseModel
          ).getSlugifyColumn();

          if (slugifyColumn) {
            (select as Dictionary<boolean>)[slugifyColumn] = true;
          }

          return select;
        },

        showCreateEditModal: (data: {
          modalType: ModalType;
          modelIdToEdit?: ObjectID | undefined;
          onBeforeCreate?:
            | ((
                item: TBaseModel,
                miscDataProps: JSONObject,
              ) => Promise<TBaseModel>)
            | undefined;
          onSuccess?: ((item: TBaseModel) => void) | undefined;
          onClose?: (() => void) | undefined;
        }): ReactElement => {
          const {
            modalType,
            modelIdToEdit,
            onBeforeCreate,
            onSuccess,
            onClose,
          } = data;

          return (
            <ModelFormModal<TBaseModel>
              modelAPI={props.modelAPI}
              title={
                modalType === ModalType.Create
                  ? `${props.createVerb || "Create"} New ${
                      props.singularName || model.singularName
                    }`
                  : `Edit ${props.singularName || model.singularName}`
              }
              formRef={props.createEditFromRef}
              modalWidth={props.createEditModalWidth}
              name={
                modalType === ModalType.Create
                  ? `${props.name} > ${props.createVerb || "Create"} New ${
                      props.singularName || model.singularName
                    }`
                  : `${props.name} > Edit ${
                      props.singularName || model.singularName
                    }`
              }
              initialValues={
                modalType === ModalType.Create
                  ? props.createInitialValues
                  : undefined
              }
              onClose={onClose}
              submitButtonText={
                modalType === ModalType.Create
                  ? `${props.createVerb || "Create"} ${
                      props.singularName || model.singularName
                    }`
                  : `Save Changes`
              }
              onSuccess={onSuccess}
              onBeforeCreate={onBeforeCreate}
              modelType={props.modelType}
              formProps={{
                summary: props.formSummary,
                name: `create-${props.modelType.name}-from`,
                modelType: props.modelType,
                id: `create-${props.modelType.name}-from`,
                fields:
                  props.formFields?.filter((field: ModelField<TBaseModel>) => {
                    // If the field has doNotShowWhenEditing set to true, then don't show it when editing

                    if (modelIdToEdit) {
                      return !field.doNotShowWhenEditing;
                    }

                    // If the field has doNotShowWhenCreating set to true, then don't show it when creating

                    return !field.doNotShowWhenCreating;
                  }) || [],
                steps: props.formSteps || [],
                formType:
                  modalType === ModalType.Create
                    ? FormType.Create
                    : FormType.Update,
              }}
              modelIdToEdit={modelIdToEdit}
            />
          );
        },

        getModelFromJSON: (item: JSONObject): TBaseModel => {
          return BaseModel.fromJSON(item, props.modelType) as TBaseModel;
        },

        deleteItem: async (item: TBaseModel) => {
          await modelAPI.deleteItem({
            modelType: props.modelType,
            id: item.id as ObjectID,
            requestOptions: props.deleteRequestOptions,
          });
        },
      }}
    />
  );
};

export default ModelTable;
