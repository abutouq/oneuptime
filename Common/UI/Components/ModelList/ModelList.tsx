import API from "../../Utils/API/API";
import Query from "../../../Types/BaseDatabase/Query";
import ModelAPI, {
  ListResult,
  RequestOptions,
} from "../../Utils/ModelAPI/ModelAPI";
import ComponentLoader from "../ComponentLoader/ComponentLoader";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import Input from "../Input/Input";
import StaticModelList from "../ModelList/StaticModelList";
import BaseModel from "../../../Models/DatabaseModels/DatabaseBaseModel/DatabaseBaseModel";
import HTTPResponse from "../../../Types/API/HTTPResponse";
import URL from "../../../Types/API/URL";
import SortOrder from "../../../Types/BaseDatabase/SortOrder";
import { LIMIT_PER_PROJECT } from "../../../Types/Database/LimitMax";
import BadDataException from "../../../Types/Exception/BadDataException";
import { PromiseVoidFunction } from "../../../Types/FunctionTypes";
import { JSONArray } from "../../../Types/JSON";
import ObjectID from "../../../Types/ObjectID";
import React, { ReactElement, useEffect, useState } from "react";
import Select from "../../../Types/BaseDatabase/Select";

export interface ComponentProps<TBaseModel extends BaseModel> {
  id: string;
  query?: Query<TBaseModel>;
  modelType: { new (): TBaseModel };
  titleField: string;
  isSearchEnabled?: boolean | undefined;
  descriptionField?: string | undefined;
  selectMultiple?: boolean | undefined;
  overrideFetchApiUrl?: URL | undefined;
  select: Select<TBaseModel>;
  fetchRequestOptions?: RequestOptions | undefined;
  customElement?: ((item: TBaseModel) => ReactElement) | undefined;
  noItemsMessage: string;
  headerField?: string | ((item: TBaseModel) => ReactElement) | undefined;
  onSelectChange?: ((list: Array<TBaseModel>) => void) | undefined;
  refreshToggle?: string | undefined;
  footer?: ReactElement | undefined;
  isDeleteable?: boolean | undefined;
  enableDragAndDrop?: boolean | undefined;
  dragDropIdField?: keyof TBaseModel | undefined;
  dragDropIndexField?: keyof TBaseModel | undefined;
  sortBy?: keyof TBaseModel | undefined;
  sortOrder?: SortOrder | undefined;
  onListLoaded?: ((list: Array<TBaseModel>) => void) | undefined;
}

const ModelList: <TBaseModel extends BaseModel>(
  props: ComponentProps<TBaseModel>,
) => ReactElement = <TBaseModel extends BaseModel>(
  props: ComponentProps<TBaseModel>,
): ReactElement => {
  const [selectedList, setSelectedList] = useState<Array<TBaseModel>>([]);
  const [modelList, setModalList] = useState<Array<TBaseModel>>([]);
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [searchedList, setSearchedList] = useState<Array<TBaseModel>>([]);
  const [searchText, setSearchText] = useState<string>("");

  useEffect(() => {
    props.onSelectChange?.(selectedList);
  }, [selectedList]);

  useEffect(() => {
    fetchItems().catch((err: Error) => {
      setError(API.getFriendlyMessage(err));
    });
  }, [props.refreshToggle]);

  useEffect(() => {
    fetchItems().catch((err: Error) => {
      setError(API.getFriendlyMessage(err));
    });
  }, []);

  useEffect(() => {
    if (!props.isSearchEnabled) {
      setSearchedList([...modelList]);
    }
  }, [props.isSearchEnabled, modelList]);

  const fetchItems: PromiseVoidFunction = async (): Promise<void> => {
    setError("");
    setIsLoading(true);

    try {
      const select: Select<TBaseModel> = {
        ...props.select,
      };

      if (
        props.dragDropIdField &&
        !Object.keys(select).includes(props.dragDropIdField as string)
      ) {
        select[props.dragDropIdField] = true;
      }

      if (
        props.dragDropIndexField &&
        !Object.keys(select).includes(props.dragDropIndexField as string)
      ) {
        select[props.dragDropIndexField] = true;
      }

      let listResult: ListResult<TBaseModel> = {
        data: [],
        count: 0,
        skip: 0,
        limit: 0,
      };

      if (props.overrideFetchApiUrl) {
        const result: HTTPResponse<JSONArray> = (await API.post(
          props.overrideFetchApiUrl,
          {},
          {},
        )) as HTTPResponse<JSONArray>;

        listResult = {
          data: BaseModel.fromJSONArray(
            result.data as JSONArray,
            props.modelType,
          ),
          count: (result.data as JSONArray).length as number,
          skip: 0,
          limit: LIMIT_PER_PROJECT,
        };
      } else {
        listResult = await ModelAPI.getList<TBaseModel>({
          modelType: props.modelType,
          query: {
            ...props.query,
          },
          limit: LIMIT_PER_PROJECT,
          skip: 0,
          select: select,
          sort: props.sortBy
            ? {
                [props.sortBy as any]: props.sortOrder,
              }
            : {},

          requestOptions: props.fetchRequestOptions,
        });
      }

      props.onListLoaded?.(listResult.data);
      setModalList(listResult.data);
    } catch (err) {
      setError(API.getFriendlyMessage(err));
    }

    setIsLoading(false);
  };

  useEffect(() => {
    if (!searchText) {
      setSearchedList([...modelList]);
    } else {
      // search

      setSearchedList(
        [...modelList].filter((model: TBaseModel): boolean => {
          const includedInSearch: boolean = (
            model.getValue(props.titleField) as string
          )
            .toLowerCase()
            .includes(searchText);

          if (!includedInSearch && props.descriptionField) {
            return (model.getValue(props.descriptionField) as string)
              .toLowerCase()
              .includes(searchText);
          }

          return includedInSearch;
        }),
      );
    }
  }, [modelList, searchText]);

  type DeleteItemFunction = (item: TBaseModel) => Promise<void>;

  const deleteItem: DeleteItemFunction = async (item: TBaseModel) => {
    if (!item.id) {
      throw new BadDataException("item.id cannot be null");
    }

    setIsLoading(true);

    try {
      await ModelAPI.deleteItem<TBaseModel>({
        modelType: props.modelType,
        id: item.id,
      });

      await fetchItems();
    } catch (err) {
      setError(API.getFriendlyMessage(err));
    }

    setIsLoading(false);
  };

  return (
    <div>
      <div>
        {!isLoading && !error && props.isSearchEnabled && (
          <div className="p-2">
            <Input
              placeholder="Search..."
              onChange={(value: string) => {
                setSearchText(value);
              }}
            />
          </div>
        )}
      </div>
      <div className="max-h-96 mb-5 overflow-y-auto p-2">
        {error ? <ErrorMessage message={error} /> : <></>}
        {isLoading ? <ComponentLoader /> : <></>}

        {!isLoading && !error && searchedList.length === 0 ? (
          <ErrorMessage
            message={
              searchText
                ? "No items match your search"
                : props.noItemsMessage || "No items found."
            }
          />
        ) : (
          <></>
        )}

        {!error && !isLoading && (
          <StaticModelList<TBaseModel>
            enableDragAndDrop={props.enableDragAndDrop}
            dragDropIdField={props.dragDropIdField}
            dragDropIndexField={props.dragDropIndexField}
            list={searchedList}
            headerField={props.headerField}
            descriptionField={props.descriptionField}
            dragAndDropScope={`${props.id}-dnd`}
            customElement={props.customElement}
            onDragDrop={async (id: string, newOrder: number) => {
              if (!props.dragDropIndexField) {
                return;
              }

              setIsLoading(true);

              await ModelAPI.updateById({
                modelType: props.modelType,
                id: new ObjectID(id),
                data: {
                  [props.dragDropIndexField]: newOrder,
                },
              });

              await fetchItems();
            }}
            titleField={props.titleField}
            onDelete={
              props.isDeleteable
                ? async (item: TBaseModel) => {
                    await deleteItem(item);
                  }
                : undefined
            }
            selectedItems={selectedList}
            onClick={(model: TBaseModel) => {
              if (props.selectMultiple) {
                // if added to the list, then remove or add to list
                const isSelected: boolean =
                  selectedList.filter((selectedItem: TBaseModel) => {
                    return (
                      selectedItem._id?.toString() === model._id?.toString()
                    );
                  }).length > 0;
                if (isSelected) {
                  // remove the item.
                  setSelectedList(
                    selectedList.filter((i: TBaseModel) => {
                      return i._id?.toString() !== model._id?.toString();
                    }),
                  );
                } else {
                  setSelectedList([...selectedList, { ...model }]);
                }
              } else {
                setSelectedList([{ ...model }]);
              }
            }}
          />
        )}
        {props.footer}
      </div>
    </div>
  );
};

export default ModelList;
