import SelectFormFields from "../../Types/SelectEntityField";
import API from "../../Utils/API/API";
import ModelAPI, {
  ListResult,
  ModelAPIHttpResponse,
  RequestOptions,
} from "../../Utils/ModelAPI/ModelAPI";
import PermissionUtil from "../../Utils/Permission";
import User from "../../Utils/User";
import { ButtonStyleType } from "../Button/Button";
import {
  CategoryCheckboxOption,
  CheckboxCategory,
} from "../CategoryCheckbox/CategoryCheckboxTypes";
import Loader, { LoaderType } from "../Loader/Loader";
import Pill, { PillSize } from "../Pill/Pill";
import { FormErrors, FormProps, FormSummaryConfig } from "./BasicForm";
import BasicModelForm from "./BasicModelForm";
import Field from "./Types/Field";
import Fields from "./Types/Fields";
import { FormStep } from "./Types/FormStep";
import FormValues from "./Types/FormValues";
import AnalyticsBaseModel from "../../../Models/AnalyticsModels/AnalyticsBaseModel/AnalyticsBaseModel";
import AccessControlModel from "../../../Models/DatabaseModels/DatabaseBaseModel/AccessControlModel";
import BaseModel from "../../../Models/DatabaseModels/DatabaseBaseModel/DatabaseBaseModel";
import FileModel from "../../../Models/DatabaseModels/DatabaseBaseModel/FileModel";
import URL from "../../../Types/API/URL";
import { ColumnAccessControl } from "../../../Types/BaseDatabase/AccessControl";
import { Black, VeryLightGray } from "../../../Types/BrandColors";
import Color from "../../../Types/Color";
import { getMaxLengthFromTableColumnType } from "../../../Types/Database/ColumnLength";
import { LIMIT_PER_PROJECT } from "../../../Types/Database/LimitMax";
import { TableColumnMetadata } from "../../../Types/Database/TableColumn";
import TableColumnType from "../../../Types/Database/TableColumnType";
import Dictionary from "../../../Types/Dictionary";
import BadDataException from "../../../Types/Exception/BadDataException";
import { PromiseVoidFunction } from "../../../Types/FunctionTypes";
import GenericObject from "../../../Types/GenericObject";
import { JSONObject } from "../../../Types/JSON";
import ObjectID from "../../../Types/ObjectID";
import Permission, {
  PermissionHelper,
  UserPermission,
} from "../../../Types/Permission";
import Typeof from "../../../Types/Typeof";
import React, { MutableRefObject, ReactElement, useState } from "react";
import useAsyncEffect from "use-async-effect";
import Select from "../../../Types/BaseDatabase/Select";

export enum FormType {
  Create,
  Update,
}

export interface ModelField<TBaseModel extends BaseModel | AnalyticsBaseModel>
  extends Field<TBaseModel> {
  overrideField?:
    | {
        // This is used to override the field type in the form.
        [field: string]: true;
      }
    | undefined;
}

export interface ComponentProps<TBaseModel extends BaseModel> {
  modelType: { new (): TBaseModel };
  id: string;
  onValidate?:
    | undefined
    | ((values: FormValues<TBaseModel>) => FormErrors<FormValues<TBaseModel>>);
  fields: Array<ModelField<TBaseModel>>;
  onFormStepChange?: undefined | ((stepId: string) => void);
  steps?: undefined | Array<FormStep<TBaseModel>>;
  submitButtonText?: undefined | string;
  requestHeaders?: undefined | Dictionary<string>;
  title?: undefined | string;
  description?: undefined | string;
  showAsColumns?: undefined | number;
  disableAutofocus?: undefined | boolean;
  footer?: ReactElement | undefined;
  onCancel?: undefined | (() => void);
  name?: string | undefined;
  onChange?:
    | undefined
    | ((
        values: FormValues<TBaseModel>,
        setNewFormValues: (newValues: FormValues<TBaseModel>) => void,
      ) => void);
  onSuccess?: undefined | ((data: TBaseModel, miscData?: JSONObject) => void);
  cancelButtonText?: undefined | string;
  maxPrimaryButtonWidth?: undefined | boolean;
  createOrUpdateApiUrl?: undefined | URL;
  fetchItemApiUrl?: undefined | URL;
  formType: FormType;
  hideSubmitButton?: undefined | boolean;
  submitButtonStyleType?: ButtonStyleType | undefined;
  formRef?: undefined | MutableRefObject<FormProps<FormValues<TBaseModel>>>;
  onIsLastFormStep?: undefined | ((isLastFormStep: boolean) => void);
  onLoadingChange?: undefined | ((isLoading: boolean) => void);
  initialValues?: FormValues<TBaseModel> | undefined;
  modelIdToEdit?: ObjectID | undefined;
  onError?: ((error: string) => void) | undefined;
  onBeforeCreate?:
    | ((item: TBaseModel, miscDataProps: JSONObject) => Promise<TBaseModel>)
    | undefined;
  saveRequestOptions?: RequestOptions | undefined;
  doNotFetchExistingModel?: boolean | undefined;
  modelAPI?: typeof ModelAPI | undefined;
  summary?: FormSummaryConfig | undefined;
  values?: FormValues<TBaseModel> | undefined;
}

const ModelForm: <TBaseModel extends BaseModel>(
  props: ComponentProps<TBaseModel>,
) => ReactElement = <TBaseModel extends BaseModel>(
  props: ComponentProps<TBaseModel>,
): ReactElement => {
  const [fields, setFields] = useState<Fields<TBaseModel>>([]);
  const [isLoading, setLoading] = useState<boolean>(false);
  const [isFetching, setIsFetching] = useState<boolean>(false);
  const [isFetchingDropdownOptions, setIsFetchingDropdownOptions] =
    useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [itemToEdit, setItemToEdit] = useState<TBaseModel | null>(null);
  const model: TBaseModel = new props.modelType();

  const modelAPI: typeof ModelAPI = props.modelAPI || ModelAPI;

  type GetSelectFieldsFunction = () => Select<TBaseModel>;

  const getSelectFields: GetSelectFieldsFunction = (): Select<TBaseModel> => {
    const select: Select<TBaseModel> = {};
    for (const field of props.fields) {
      const key: string | null = field.field
        ? (Object.keys(field.field)[0] as string)
        : null;

      if (
        key &&
        (hasPermissionOnField(key) || field.showEvenIfPermissionDoesNotExist)
      ) {
        (select as Dictionary<boolean>)[key] = true;
      }
    }

    return select;
  };

  const getRelationSelect: () => Select<TBaseModel> =
    (): Select<TBaseModel> => {
      const relationSelect: Select<TBaseModel> = {};

      for (const field of props.fields) {
        const key: string | null = field.field
          ? (Object.keys(field.field)[0] as string)
          : null;

        if (key && model.isFileColumn(key)) {
          (relationSelect as JSONObject)[key] = {
            file: true,
            _id: true,
            fileType: true,
            name: true,
          };
        } else if (key && model.isEntityColumn(key)) {
          (relationSelect as JSONObject)[key] = (field.field as any)[key];
        }
      }

      return relationSelect;
    };

  const hasPermissionOnField: (fieldName: string) => boolean = (
    fieldName: string,
  ): boolean => {
    if (User.isMasterAdmin()) {
      return true; // master admin can do anything.
    }

    let userPermissions: Array<Permission> =
      PermissionUtil.getGlobalPermissions()?.globalPermissions || [];
    if (
      PermissionUtil.getProjectPermissions() &&
      PermissionUtil.getProjectPermissions()?.permissions &&
      PermissionUtil.getProjectPermissions()!.permissions.length > 0
    ) {
      userPermissions = userPermissions.concat(
        PermissionUtil.getProjectPermissions()!.permissions.map(
          (i: UserPermission) => {
            return i.permission;
          },
        ),
      );
    }

    userPermissions.push(Permission.Public);

    const fieldPermissions: Array<Permission> = getFieldPermissions(fieldName);

    if (
      fieldPermissions &&
      PermissionHelper.doesPermissionsIntersect(
        userPermissions,
        fieldPermissions,
      )
    ) {
      return true;
    }

    return false;
  };

  const getFieldPermissions: (fieldName: string) => Array<Permission> = (
    fieldName: string,
  ): Array<Permission> => {
    const accessControl: Dictionary<ColumnAccessControl> =
      model.getColumnAccessControlForAllColumns();

    let fieldPermissions: Array<Permission> = [];

    if (FormType.Create === props.formType) {
      fieldPermissions = accessControl[fieldName]?.create || [];
    } else {
      fieldPermissions = accessControl[fieldName]?.update || [];
    }

    return fieldPermissions;
  };

  const setFormFields: PromiseVoidFunction = async (): Promise<void> => {
    let fieldsToSet: Fields<TBaseModel> = [];

    for (const field of props.fields) {
      const fieldObj:
        | {
            [field: string]: true;
          }
        | SelectFormFields<TBaseModel>
        | undefined = field.field || field.overrideField;

      if (!fieldObj) {
        continue;
      }

      const keys: Array<string> = Object.keys(fieldObj);

      if (keys.length > 0) {
        const key: string = keys[0] as string;

        const hasPermission: boolean = hasPermissionOnField(key);

        if (
          (field.showEvenIfPermissionDoesNotExist || hasPermission) &&
          fieldsToSet.filter((i: ModelField<TBaseModel>) => {
            const fieldObj:
              | {
                  [field: string]: true;
                }
              | SelectFormFields<TBaseModel>
              | undefined = i.field || i.overrideField;

            if (!fieldObj) {
              return false;
            }
            // check if field already exists. If it does, don't add it.
            const iKeys: Array<string> = Object.keys(fieldObj);
            const iFieldKey: string = iKeys[0] as string;
            return iFieldKey === key;
          }).length === 0
        ) {
          // check if has maxLength
          if (
            !field.validation?.maxLength &&
            model.getTableColumnMetadata(key)?.type
          ) {
            field.validation = {
              ...field.validation,
              maxLength: getMaxLengthFromTableColumnType(
                model.getTableColumnMetadata(key).type,
              ),
            };
          }

          fieldsToSet.push({
            ...field,
            field: {
              [key]: true,
            } as SelectFormFields<TBaseModel>,
          });
        }
      }
    }

    fieldsToSet = await fetchDropdownOptions(fieldsToSet);

    // if there are no fields to set, then show permission erorr. This is useful when there are no fields to show.
    if (fieldsToSet.length === 0 && props.fields.length > 0) {
      const field: ModelField<TBaseModel> | undefined = props.fields[0];

      if (field) {
        const fieldName: string | undefined = Object.keys(field.field || {})[0];

        if (fieldName) {
          const fieldPermisisons: Array<Permission> =
            getFieldPermissions(fieldName);

          const columnMetadata: TableColumnMetadata =
            model.getTableColumnMetadata(fieldName);

          setError(
            `You don't have enough permissions to ${
              props.formType === FormType.Create ? "create" : "edit"
            } ${columnMetadata.title} on ${model.singularName}. You need one of the following permissions: ${fieldPermisisons.join(", ")}`,
          );
        }
      }
    }

    setFields(fieldsToSet);
  };

  useAsyncEffect(async () => {
    // set fields.
    await setFormFields();
  }, [props.fields]);

  const fetchItem: PromiseVoidFunction = async (): Promise<void> => {
    if (!props.modelIdToEdit || props.formType !== FormType.Update) {
      throw new BadDataException("Model ID to update not found.");
    }

    let item: BaseModel | null = await modelAPI.getItem({
      modelType: props.modelType,
      id: props.modelIdToEdit,
      select: { ...getSelectFields(), ...getRelationSelect() },
      requestOptions: {
        overrideRequestUrl: props.fetchItemApiUrl,
      },
    });

    if (!(item instanceof BaseModel) && item) {
      item = BaseModel.fromJSON(
        item as JSONObject,
        props.modelType,
      ) as BaseModel;
    }

    if (!item) {
      setError(
        `Cannot edit ${(
          model.singularName || "item"
        ).toLowerCase()}. It could be because you don't have enough permissions to read or edit this ${(
          model.singularName || "item"
        ).toLowerCase()}.`,
      );
    }

    const relationSelect: Select<TBaseModel> = getRelationSelect();

    for (const key in relationSelect) {
      if (item) {
        if (Array.isArray((item as any)[key])) {
          const idArray: Array<string> = [];
          let isModelArray: boolean = false;
          for (const itemInArray of (item as any)[key] as any) {
            if (typeof (itemInArray as any) === "object") {
              if ((itemInArray as any as JSONObject)["_id"]) {
                isModelArray = true;
                idArray.push(
                  (itemInArray as any as JSONObject)["_id"] as string,
                );
              }
            }
          }

          if (isModelArray) {
            (item as any)[key] = idArray;
          }
        }
        if (
          (item as any)[key] &&
          typeof (item as any)[key] === "object" &&
          !((item as any)[key] instanceof FileModel)
        ) {
          if (((item as any)[key] as JSONObject)["_id"]) {
            (item as any)[key] = ((item as any)[key] as JSONObject)[
              "_id"
            ] as string;
          }
        }
      }
    }

    setItemToEdit(item as TBaseModel);
  };

  type FetchDropdownOptionsFunction = (
    fields: Fields<TBaseModel>,
  ) => Promise<Fields<TBaseModel>>;

  const fetchDropdownOptions: FetchDropdownOptionsFunction = async (
    fields: Fields<TBaseModel>,
  ): Promise<Fields<TBaseModel>> => {
    setIsFetchingDropdownOptions(true);

    try {
      for (const field of fields) {
        if (field.dropdownModal && field.dropdownModal.type) {
          const tempModel: BaseModel = new field.dropdownModal.type();
          const select: any = {
            [field.dropdownModal.labelField]: true,
            [field.dropdownModal.valueField]: true,
          } as any;

          let hasAccessControlColumn: boolean = false;

          // also select labels, so they can select resources by labels. This is useful for resources like monitors, etc.
          if (tempModel.getAccessControlColumn()) {
            select[tempModel.getAccessControlColumn()!] = {
              _id: true,
              name: true,
              color: true,
            } as any;

            hasAccessControlColumn = true;
          }

          const listResult: ListResult<BaseModel> =
            await modelAPI.getList<BaseModel>({
              modelType: field.dropdownModal.type,
              query: {},
              limit: LIMIT_PER_PROJECT,
              skip: 0,
              select: select,
              sort: {},
            });

          if (listResult.data && listResult.data.length > 0) {
            field.dropdownOptions = listResult.data.map((item: BaseModel) => {
              if (!field.dropdownModal) {
                throw new BadDataException("Dropdown Modal value mot found");
              }

              return {
                label: (item as any)[
                  field.dropdownModal?.labelField
                ].toString(),
                value: (item as any)[
                  field.dropdownModal?.valueField
                ].toString(),
              };
            });

            if (hasAccessControlColumn) {
              const categories: Array<CheckboxCategory> = [];

              // populate categories.

              let localLabels: Array<AccessControlModel> = [];

              for (const item of listResult.data) {
                const accessControlColumn: string | null =
                  tempModel.getAccessControlColumn()!;
                const labels: Array<AccessControlModel> =
                  ((item as any)[
                    accessControlColumn
                  ] as Array<AccessControlModel>) || [];

                for (const label of labels) {
                  if (label && label._id && label.getColumnValue("name")) {
                    // check if this category already exists.

                    const existingLabel: AccessControlModel | undefined =
                      localLabels.find((i: AccessControlModel) => {
                        return i._id?.toString() === label._id?.toString();
                      });

                    if (!existingLabel) {
                      localLabels.push(label);
                    }
                  }
                }
              }

              // sort category by name.

              localLabels = localLabels.sort(
                (a: AccessControlModel, b: AccessControlModel) => {
                  return a
                    .getColumnValue("name")!
                    .toString()
                    .localeCompare(b.getColumnValue("name")?.toString() || "");
                },
              );

              // for each of these labels add category.

              for (const label of localLabels) {
                categories.push({
                  id: label._id?.toString() || "",
                  title: (
                    <span className="mb-1">
                      <Pill
                        size={PillSize.Small}
                        color={
                          (label.getColumnValue("color") as Color) || Black
                        }
                        text={(label.getColumnValue("name") as string) || ""}
                      />
                    </span>
                  ),
                });
              }

              // now populate options.
              const options: Array<CategoryCheckboxOption> = [];

              for (const item of listResult.data) {
                const accessControlColumn: string =
                  tempModel.getAccessControlColumn()!;
                const labels: Array<AccessControlModel> =
                  ((item as any)[
                    accessControlColumn
                  ] as Array<AccessControlModel>) || [];

                if (labels.length > 0) {
                  for (const label of labels) {
                    options.push({
                      value: item.getColumnValue(
                        field.dropdownModal.valueField,
                      ) as string,
                      label: item.getColumnValue(
                        field.dropdownModal.labelField,
                      ) as string,
                      categoryId: label._id?.toString() || "",
                    });
                  }
                } else {
                  options.push({
                    value: item.getColumnValue(
                      field.dropdownModal.valueField,
                    ) as string,
                    label: item.getColumnValue(
                      field.dropdownModal.labelField,
                    ) as string,
                    categoryId: "",
                  });
                }
              }

              field.selectByAccessControlProps = {
                categoryCheckboxProps: {
                  categories: categories,
                  options: options,
                },
                accessControlColumnTitle:
                  tempModel.getTableColumnMetadata(
                    tempModel.getAccessControlColumn()!,
                  ).title || "",
              };
            }
          } else {
            field.dropdownOptions = [];
          }
        }
      }
    } catch (err) {
      setError(API.getFriendlyMessage(err));
    }

    setIsFetchingDropdownOptions(false);

    return fields;
  };

  useAsyncEffect(async () => {
    if (
      props.modelIdToEdit &&
      props.formType === FormType.Update &&
      !props.doNotFetchExistingModel
    ) {
      // get item.
      setLoading(true);
      setIsFetching(true);
      setError("");
      try {
        await fetchItem();
      } catch (err) {
        setError(API.getFriendlyMessage(err));
        props.onError?.(API.getFriendlyMessage(err));
      }

      setLoading(false);
      setIsFetching(false);
    }
  }, []);

  type GetMiscDataPropsFunction = (
    values: FormValues<JSONObject>,
  ) => JSONObject;

  const getMiscDataProps: GetMiscDataPropsFunction = (
    values: FormValues<JSONObject>,
  ): JSONObject => {
    const result: JSONObject = {};

    for (const field of fields) {
      if (field.overrideFieldKey && values[field.overrideFieldKey]) {
        result[field.overrideFieldKey] =
          (values[field.overrideFieldKey] as JSONObject) || null;
      }
    }

    return result;
  };

  const onSubmit: (
    values: FormValues<JSONObject>,
    onSubmitSuccessful: () => void,
  ) => Promise<void> = async (
    values: FormValues<JSONObject>,
    onSubmitSuccessful: () => void,
  ): Promise<void> => {
    // Ping an API here.

    setError("");
    setLoading(true);
    if (props.onLoadingChange) {
      props.onLoadingChange(true);
    }

    let result: ModelAPIHttpResponse<TBaseModel>;

    try {
      // strip data.
      const valuesToSend: JSONObject = {};

      for (const key in getSelectFields()) {
        (valuesToSend as any)[key] = values[key];
      }

      if (props.formType === FormType.Update && props.modelIdToEdit) {
        (valuesToSend as any)["_id"] = props.modelIdToEdit.toString();
      }

      const miscDataProps: JSONObject = getMiscDataProps(values);

      // remove those props from valuesToSend
      for (const key in miscDataProps) {
        delete valuesToSend[key];
      }

      for (const key of model.getTableColumns().columns) {
        const tableColumnMetadata: TableColumnMetadata =
          model.getTableColumnMetadata(key);

        if (
          tableColumnMetadata &&
          tableColumnMetadata.modelType &&
          tableColumnMetadata.type === TableColumnType.Entity &&
          valuesToSend[key] &&
          typeof valuesToSend[key] === Typeof.String
        ) {
          const baseModel: BaseModel = new tableColumnMetadata.modelType();
          baseModel._id = valuesToSend[key] as string;
          valuesToSend[key] = baseModel;
        }

        if (
          tableColumnMetadata &&
          tableColumnMetadata.modelType &&
          tableColumnMetadata.type === TableColumnType.EntityArray &&
          Array.isArray(valuesToSend[key]) &&
          (valuesToSend[key] as Array<any>).length > 0 &&
          typeof (valuesToSend[key] as Array<any>)[0] === Typeof.Object &&
          typeof (valuesToSend[key] as Array<any>)[0].value === Typeof.String
        ) {
          const arr: Array<string> = [];
          for (const id of valuesToSend[key] as Array<GenericObject>) {
            arr.push((id as any).value as string);
          }
          valuesToSend[key] = arr;
        }

        if (
          tableColumnMetadata &&
          tableColumnMetadata.modelType &&
          tableColumnMetadata.type === TableColumnType.EntityArray &&
          Array.isArray(valuesToSend[key]) &&
          (valuesToSend[key] as Array<any>).length > 0 &&
          typeof (valuesToSend[key] as Array<any>)[0] === Typeof.String
        ) {
          const arr: Array<BaseModel> = [];
          for (const id of valuesToSend[key] as Array<string>) {
            const baseModel: BaseModel = new tableColumnMetadata.modelType();
            baseModel._id = id as string;
            arr.push(baseModel);
          }
          valuesToSend[key] = arr;
        }
      }

      let tBaseModel: TBaseModel = BaseModel.fromJSON(
        valuesToSend,
        props.modelType,
      ) as TBaseModel;

      if (props.onBeforeCreate && props.formType === FormType.Create) {
        tBaseModel = await props.onBeforeCreate(tBaseModel, miscDataProps);
      }

      result = await modelAPI.createOrUpdate<TBaseModel>({
        model: tBaseModel as TBaseModel,
        modelType: props.modelType,
        formType: props.formType,
        miscDataProps: miscDataProps,
        requestOptions: {
          ...props.saveRequestOptions,
          requestHeaders: props.requestHeaders,
          overrideRequestUrl: props.createOrUpdateApiUrl,
        },
      });

      const miscData: JSONObject | undefined = result.miscData;

      if (props.onSuccess) {
        // we do props.formType === FormType.Create ? result.data: tBaseModel because update API does not return the updated model.
        props.onSuccess(
          BaseModel.fromJSONObject(
            props.formType === FormType.Create ? result.data : tBaseModel,
            props.modelType,
          ),
          miscData,
        );
      }

      onSubmitSuccessful();
    } catch (err) {
      setError(API.getFriendlyMessage(err));
    }

    setLoading(false);

    if (props.onLoadingChange) {
      props.onLoadingChange(false);
    }
  };

  if (isFetching || isFetchingDropdownOptions) {
    return (
      <div className="row flex justify-center mt-20 mb-20">
        <Loader loaderType={LoaderType.Bar} color={VeryLightGray} size={200} />
      </div>
    );
  }

  return (
    <div>
      <BasicModelForm<TBaseModel>
        values={props.values}
        title={props.title}
        description={props.description}
        disableAutofocus={props.disableAutofocus}
        model={model}
        id={props.id}
        name={props.name}
        onFormStepChange={props.onFormStepChange}
        onIsLastFormStep={props.onIsLastFormStep}
        fields={fields}
        steps={props.steps}
        onChange={(
          values: FormValues<TBaseModel>,
          setNewFormValues: (newValues: FormValues<TBaseModel>) => void,
        ) => {
          if (!isLoading) {
            props.onChange?.(values, setNewFormValues);
          }
        }}
        showAsColumns={props.showAsColumns}
        footer={props.footer}
        isLoading={isLoading}
        submitButtonText={props.submitButtonText}
        cancelButtonText={props.cancelButtonText}
        onSubmit={onSubmit}
        submitButtonStyleType={props.submitButtonStyleType}
        onValidate={props.onValidate}
        onCancel={props.onCancel}
        maxPrimaryButtonWidth={props.maxPrimaryButtonWidth}
        error={error}
        hideSubmitButton={props.hideSubmitButton}
        formRef={props.formRef}
        initialValues={
          (itemToEdit || props.initialValues) as
            | FormValues<TBaseModel>
            | undefined
        }
        summary={props.summary}
      ></BasicModelForm>
    </div>
  );
};

export default ModelForm;
