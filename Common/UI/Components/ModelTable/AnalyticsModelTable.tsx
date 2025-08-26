import ModelAPI from "../../Utils/AnalyticsModelAPI/AnalyticsModelAPI";
import Query from "../../../Types/BaseDatabase/Query";
import BaseModelTable, { BaseTableProps, ModalType } from "./BaseModelTable";
import AnalyticsBaseModel, {
  AnalyticsBaseModelType,
} from "../../../Models/AnalyticsModels/AnalyticsBaseModel/AnalyticsBaseModel";
import { DatabaseBaseModelType } from "../../../Models/DatabaseModels/DatabaseBaseModel/DatabaseBaseModel";
import NotImplementedException from "../../../Types/Exception/NotImplementedException";
import { JSONObject } from "../../../Types/JSON";
import ObjectID from "../../../Types/ObjectID";
import React, { ReactElement } from "react";
import Select from "../../../Types/BaseDatabase/Select";
import Sort from "../../../Types/BaseDatabase/Sort";
import GroupBy from "../../../Types/BaseDatabase/GroupBy";
import RequestOptions from "../../Utils/API/RequestOptions";

export interface ComponentProps<TBaseModel extends AnalyticsBaseModel>
  extends BaseTableProps<TBaseModel> {
  modelAPI?: typeof ModelAPI | undefined;
}

const AnalyticsModelTable: <TBaseModel extends AnalyticsBaseModel>(
  props: ComponentProps<TBaseModel>,
) => ReactElement = <TBaseModel extends AnalyticsBaseModel>(
  props: ComponentProps<TBaseModel>,
): ReactElement => {
  const modelAPI: typeof ModelAPI = props.modelAPI || ModelAPI;

  return (
    <BaseModelTable
      {...props}
      callbacks={{
        getJSONFromModel: (item: TBaseModel): JSONObject => {
          return AnalyticsBaseModel.toJSON(item, props.modelType);
        },

        updateById: async (args: { id: ObjectID; data: JSONObject }) => {
          const { id, data } = args;

          await modelAPI.updateById({
            modelType: props.modelType,
            id: new ObjectID(id),
            data: data,
          });
        },

        showCreateEditModal: (_data: {
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
          // Analytics database like clickhuse dont support edit operations
          throw new NotImplementedException();
        },

        toJSONArray: (items: TBaseModel[]): JSONObject[] => {
          return AnalyticsBaseModel.toJSONArray(items, props.modelType);
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
            groupBy: data.groupBy,
            limit: data.limit,
            skip: data.skip,
            sort: data.sort,
            select: data.select,
            requestOptions: data.requestOptions,
          });
        },

        addSlugToSelect: (select: Select<TBaseModel>): Select<TBaseModel> => {
          return select;
        },

        getModelFromJSON: (item: JSONObject): TBaseModel => {
          return AnalyticsBaseModel.fromJSON(
            item,
            props.modelType,
          ) as TBaseModel;
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

export default AnalyticsModelTable;
